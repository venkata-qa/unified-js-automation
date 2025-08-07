const { request } = require('@playwright/test');
const logger = require('./logger');

class ApiUtils {
  constructor() {
    this.apiContext = null;
    this.apiUrl = '';
    this.queryParams = {};
    this.requestBody = {};
    this.headers = {};
    this.response = null;
    this.responseData = null;
    this.responseCode = null;
  }

  setHeaders(headers) {
    this.headers = headers;
    logger.debug(`Headers set: ${JSON.stringify(headers)}`);
  }

  async initRequest(baseURL) {
    this.apiContext = await request.newContext({
      baseURL: baseURL,
      extraHTTPHeaders: this.headers
    });
    logger.info(`Initialized API context with baseURL: ${baseURL}`);
  }

  setEndpoint(endpoint) {
    this.apiUrl = endpoint;
    logger.debug(`Endpoint set: ${endpoint}`);
  }

  setQueryParams(queryParams) {
    this.queryParams = queryParams;
    logger.debug(`Query params set: ${JSON.stringify(queryParams)}`);
  }

  setRequestBody(body) {
    this.requestBody = body;
    logger.debug(`Request body set: ${JSON.stringify(body)}`);
  }

  setPathParam(paramValue) {
    const originalUrl = this.apiUrl;
    if (this.apiUrl.endsWith('/')) {
      this.apiUrl += paramValue;
    } else {
      this.apiUrl += `/${paramValue}`;
    }
    logger.debug(
      `Updated URL from ${originalUrl} to ${this.apiUrl} with path param: ${paramValue}`
    );
  }

  async makeRequest(method) {
    const lowerMethod = method.toLowerCase();
    const urlWithQuery = Object.keys(this.queryParams).length
      ? `${this.apiUrl}?${new URLSearchParams(this.queryParams).toString()}`
      : this.apiUrl;

    const opts = ['post', 'put'].includes(lowerMethod) ? { data: this.requestBody } : undefined;

    logger.info(`Making ${method.toUpperCase()} request to ${urlWithQuery}`);

    try {
      this.response =
        lowerMethod === 'get'
          ? await this.apiContext.get(urlWithQuery)
          : lowerMethod === 'post'
            ? await this.apiContext.post(urlWithQuery, opts)
            : lowerMethod === 'put'
              ? await this.apiContext.put(urlWithQuery, opts)
              : lowerMethod === 'delete'
                ? await this.apiContext.delete(urlWithQuery)
                : (() => {
                  throw new Error(`Unsupported method: ${method}`);
                })();
      this.responseCode = this.response.status();
      logger.info(`Received response with status: ${this.responseCode}`);
      if (lowerMethod !== 'delete') {
        this.responseData = await this.response.json();
        logger.debug(`Response data: ${JSON.stringify(this.responseData)}`);
      }
    } catch (error) {
      logger.error(
        `Error during ${method.toUpperCase()} request to ${urlWithQuery}: ${error.message}`
      );
      throw error;
    }
  }

  getResponseCode() {
    logger.debug(`Returning response code: ${this.responseCode}`);
    return this.responseCode;
  }

  getResponseData() {
    logger.debug('Returning response data');
    return this.responseData;
  }

  getResponse() {
    logger.debug('Returning full response');
    return this.response;
  }
}

module.exports = { ApiUtils };
