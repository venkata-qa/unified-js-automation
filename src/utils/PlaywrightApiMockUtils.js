const { expect } = require('@playwright/test');
const { request } = require('@playwright/test');
const logger = require('./logger');
const path = require('path');
const fs = require('fs');

/**
 * PlaywrightApiMockUtils - Using Playwright's native API capabilities
 * Provides both API testing and mocking using Playwright's request context
 */
class PlaywrightApiMockUtils {
  constructor(page = null) {
    this.page = page;
    this.apiContext = null;
    this.mocks = new Map();
    this.requestLog = [];
    this.mockStats = {
      totalMocks: 0,
      totalCalls: 0,
      callDetails: {}
    };
    this.env = process.env.NODE_ENV || 'dev';
    this.mockDataPath = `test-data/mockdata/${this.env.toUpperCase()}/`;
  }

  /**
   * Initialize API context for making real API calls
   */
  async initializeApiContext(baseURL = null, options = {}) {
    const defaultOptions = {
      baseURL: baseURL,
      timeout: 30000,
      ignoreHTTPSErrors: true,
      ...options
    };

    this.apiContext = await request.newContext(defaultOptions);
    logger.info(`Playwright API context initialized with baseURL: ${baseURL}`);
    return this.apiContext;
  }

  /**
   * Setup page route for mocking (requires page context)
   */
  async setupPageRouteMocking() {
    if (!this.page) {
      throw new Error('Page context required for route mocking. Initialize with page parameter.');
    }

    // Enable route mocking for all requests
    await this.page.route('**/*', async (route, request) => {
      const url = request.url();
      const method = request.method();

      // Check if this request should be mocked
      const mockResponse = this.findMockForRequest(method, url);

      if (mockResponse) {
        logger.info(`Mock found for ${method} ${url}`);

        // Track the mock call
        this.trackMockCall(method, url);

        // Fulfill with mock response
        await route.fulfill({
          status: mockResponse.status || 200,
          contentType: mockResponse.contentType || 'application/json',
          body: JSON.stringify(mockResponse.body),
          headers: mockResponse.headers || {}
        });
      } else {
        // Let the request continue normally
        await route.continue();
      }
    });

    logger.info('Playwright page route mocking enabled');
  }

  /**
   * Make API request using Playwright's request context
   */
  async makeApiRequest(method, endpoint, options = {}) {
    if (!this.apiContext) {
      throw new Error('API context not initialized. Call initializeApiContext() first.');
    }

    const requestOptions = {
      data: options.data,
      params: options.params,
      headers: options.headers,
      timeout: options.timeout || 30000,
      ...options
    };

    let response;

    try {
      switch (method.toUpperCase()) {
        case 'GET':
          response = await this.apiContext.get(endpoint, requestOptions);
          break;
        case 'POST':
          response = await this.apiContext.post(endpoint, requestOptions);
          break;
        case 'PUT':
          response = await this.apiContext.put(endpoint, requestOptions);
          break;
        case 'DELETE':
          response = await this.apiContext.delete(endpoint, requestOptions);
          break;
        case 'PATCH':
          response = await this.apiContext.patch(endpoint, requestOptions);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      // Log the request
      this.requestLog.push({
        method: method.toUpperCase(),
        endpoint,
        status: response.status(),
        timestamp: new Date().toISOString(),
        options: requestOptions
      });

      logger.info(`${method.toUpperCase()} ${endpoint} - Status: ${response.status()}`);
      return response;
    } catch (error) {
      logger.error(`API request failed: ${method.toUpperCase()} ${endpoint} - ${error.message}`);
      throw error;
    }
  }

  /**
   * Mock API endpoint with custom response
   */
  mockApiEndpoint(method, urlPattern, mockResponse, options = {}) {
    const mockKey = `${method.toUpperCase()}_${urlPattern}`;

    const mock = {
      method: method.toUpperCase(),
      urlPattern,
      body: mockResponse,
      status: options.status || 200,
      contentType: options.contentType || 'application/json',
      headers: options.headers || {},
      delay: options.delay || 0,
      callCount: 0,
      times: options.times || Infinity, // How many times this mock should be used
      ...options
    };

    this.mocks.set(mockKey, mock);
    this.mockStats.totalMocks++;

    logger.info(`API mock configured: ${method.toUpperCase()} ${urlPattern} -> ${mock.status}`);
    return mock;
  }

  /**
   * Mock API endpoint with response from file
   */
  async mockApiEndpointFromFile(method, urlPattern, fileName, options = {}) {
    const filePath = path.join(this.mockDataPath, fileName);

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const mockData = JSON.parse(fileContent);

      return this.mockApiEndpoint(method, urlPattern, mockData, options);
    } catch (error) {
      logger.error(`Failed to load mock data from file ${fileName}: ${error.message}`);
      throw new Error(`Mock file not found or invalid: ${fileName}`);
    }
  }

  /**
   * Find mock response for a request
   */
  findMockForRequest(method, url) {
    for (const [mockKey, mock] of this.mocks) {
      if (mock.method === method.toUpperCase() && this.urlMatches(url, mock.urlPattern)) {
        // Check if mock is still valid (hasn't exceeded call limit)
        if (mock.callCount < mock.times) {
          return mock;
        }
      }
    }
    return null;
  }

  /**
   * Check if URL matches pattern
   */
  urlMatches(url, pattern) {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\*\*/g, '.*') // ** matches any characters
      .replace(/\*/g, '[^/]*') // * matches any characters except /
      .replace(/\?/g, '\\?') // Escape ?
      .replace(/\./g, '\\.'); // Escape .

    const regex = new RegExp(regexPattern);
    return regex.test(url);
  }

  /**
   * Track mock call statistics
   */
  trackMockCall(method, url) {
    const mockKey = this.findMockKeyForRequest(method, url);
    if (mockKey && this.mocks.has(mockKey)) {
      const mock = this.mocks.get(mockKey);
      mock.callCount++;

      this.mockStats.totalCalls++;
      if (!this.mockStats.callDetails[mockKey]) {
        this.mockStats.callDetails[mockKey] = 0;
      }
      this.mockStats.callDetails[mockKey]++;
    }
  }

  /**
   * Find mock key for a request
   */
  findMockKeyForRequest(method, url) {
    for (const [mockKey, mock] of this.mocks) {
      if (mock.method === method.toUpperCase() && this.urlMatches(url, mock.urlPattern)) {
        return mockKey;
      }
    }
    return null;
  }

  /**
   * Verify that a mock was called
   */
  verifyMockCalled(method, urlPattern, expectedTimes = 1) {
    const mockKey = `${method.toUpperCase()}_${urlPattern}`;
    const mock = this.mocks.get(mockKey);

    if (!mock) {
      throw new Error(`Mock not found: ${method.toUpperCase()} ${urlPattern}`);
    }

    if (mock.callCount !== expectedTimes) {
      throw new Error(
        `Mock call count mismatch for ${method.toUpperCase()} ${urlPattern}. ` +
          `Expected: ${expectedTimes}, Actual: ${mock.callCount}`
      );
    }

    logger.info(
      `Mock verification passed: ${method.toUpperCase()} ${urlPattern} called ${expectedTimes} times`
    );
    return true;
  }

  /**
   * Wait for mock to be called
   */
  async waitForMockCall(method, urlPattern, timeout = 5000) {
    const mockKey = `${method.toUpperCase()}_${urlPattern}`;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const mock = this.mocks.get(mockKey);
      if (mock && mock.callCount > 0) {
        logger.info(`Mock call detected: ${method.toUpperCase()} ${urlPattern}`);
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    throw new Error(
      `Mock call timeout: ${method.toUpperCase()} ${urlPattern} not called within ${timeout}ms`
    );
  }

  /**
   * Get mock statistics
   */
  getStats() {
    return {
      ...this.mockStats,
      activeMocks: this.mocks.size,
      mockDetails: Array.from(this.mocks.entries()).map(([key, mock]) => ({
        key,
        method: mock.method,
        urlPattern: mock.urlPattern,
        callCount: mock.callCount,
        maxTimes: mock.times
      }))
    };
  }

  /**
   * Clear all mocks
   */
  clearAllMocks() {
    this.mocks.clear();
    this.mockStats = {
      totalMocks: 0,
      totalCalls: 0,
      callDetails: {}
    };
    logger.info('All API mocks cleared');
  }

  /**
   * Clear specific mock
   */
  clearMock(method, urlPattern) {
    const mockKey = `${method.toUpperCase()}_${urlPattern}`;
    if (this.mocks.delete(mockKey)) {
      this.mockStats.totalMocks--;
      delete this.mockStats.callDetails[mockKey];
      logger.info(`Mock cleared: ${method.toUpperCase()} ${urlPattern}`);
      return true;
    }
    return false;
  }

  /**
   * Get request log
   */
  getRequestLog() {
    return this.requestLog;
  }

  /**
   * Clear request log
   */
  clearRequestLog() {
    this.requestLog = [];
    logger.info('Request log cleared');
  }

  /**
   * Close API context
   */
  async dispose() {
    if (this.apiContext) {
      await this.apiContext.dispose();
      logger.info('Playwright API context disposed');
    }
  }

  /**
   * Validate API response against schema
   */
  async validateResponse(response, schemaPath) {
    const Ajv = require('ajv');
    const addFormats = require('ajv-formats');

    const ajv = new Ajv();
    addFormats(ajv);

    try {
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      const schema = JSON.parse(schemaContent);
      const responseData = await response.json();

      const validate = ajv.compile(schema);
      const valid = validate(responseData);

      if (!valid) {
        logger.error('API response validation failed:', validate.errors);
        throw new Error(`Schema validation failed: ${JSON.stringify(validate.errors)}`);
      }

      logger.info('API response validation passed');
      return true;
    } catch (error) {
      logger.error(`Schema validation error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = { PlaywrightApiMockUtils };
