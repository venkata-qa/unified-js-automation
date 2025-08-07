const logger = require('./logger');

class ErrorHandler {
  constructor() {
    this.errors = [];
    this.retryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      exponentialBackoff: true
    };
  }

  async withRetry(operation, options = {}) {
    const config = { ...this.retryConfig, ...options };
    let lastError;

    for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
      try {
        const result = await operation();
        if (attempt > 1) {
          logger.info(`Operation succeeded on attempt ${attempt}`);
        }
        return result;
      } catch (error) {
        lastError = error;

        if (attempt <= config.maxRetries && this.isRetryableError(error)) {
          const delay = config.exponentialBackoff
            ? config.retryDelay * Math.pow(2, attempt - 1)
            : config.retryDelay;

          logger.warn(`Attempt ${attempt} failed: ${error.message}. Retrying in ${delay}ms...`);
          await this.sleep(delay);
        } else {
          break;
        }
      }
    }

    logger.error(`Operation failed after ${config.maxRetries + 1} attempts: ${lastError.message}`);
    throw lastError;
  }

  isRetryableError(error) {
    const retryableErrors = [
      'ETIMEDOUT',
      'ECONNRESET',
      'ENOTFOUND',
      'ECONNREFUSED',
      'TimeoutError',
      'NetworkError',
      'Target page, context or browser has been closed'
    ];

    return retryableErrors.some(
      retryableError =>
        error.message.includes(retryableError) || error.name.includes(retryableError)
    );
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  captureError(error, context = {}) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      name: error.name,
      context,
      testInfo: {
        scenario: global.testName || 'Unknown',
        step: context.step || 'Unknown',
        environment: process.env.NODE_ENV || 'Unknown'
      }
    };

    this.errors.push(errorInfo);
    logger.error('Error captured:', errorInfo);

    return errorInfo;
  }

  async takeScreenshotOnError(page, error, scenarioName = 'error') {
    try {
      if (page && !page.isClosed()) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `error_${scenarioName}_${timestamp}.png`;
        const screenshotPath = `./reports/screenshots/${fileName}`;

        await page.screenshot({
          path: screenshotPath,
          fullPage: true
        });

        logger.info(`Error screenshot saved: ${screenshotPath}`);
        return screenshotPath;
      }
    } catch (screenshotError) {
      logger.warn(`Failed to take error screenshot: ${screenshotError.message}`);
    }
    return null;
  }

  createCustomError(message, type = 'TestError', cause = null) {
    const error = new Error(message);
    error.name = type;
    error.timestamp = new Date().toISOString();
    error.cause = cause;
    return error;
  }

  handleAsyncError(promise, context = {}) {
    return promise.catch(error => {
      this.captureError(error, context);
      throw error;
    });
  }

  wrapPageMethod(page, methodName, context = {}) {
    const originalMethod = page[methodName];

    page[methodName] = async (...args) => {
      try {
        return await originalMethod.apply(page, args);
      } catch (error) {
        await this.takeScreenshotOnError(page, error, context.scenario);
        this.captureError(error, {
          ...context,
          method: methodName,
          args: this.sanitizeArgs(args)
        });
        throw error;
      }
    };
  }

  sanitizeArgs(args) {
    // Remove sensitive data from arguments for logging
    return args.map(arg => {
      if (typeof arg === 'string' && arg.includes('password')) {
        return '***REDACTED***';
      }
      if (typeof arg === 'object' && arg !== null) {
        const sanitized = { ...arg };
        Object.keys(sanitized).forEach(key => {
          if (
            key.toLowerCase().includes('password') ||
            key.toLowerCase().includes('token') ||
            key.toLowerCase().includes('secret')
          ) {
            sanitized[key] = '***REDACTED***';
          }
        });
        return sanitized;
      }
      return arg;
    });
  }

  generateErrorReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalErrors: this.errors.length,
      errorsByType: this.groupErrorsByType(),
      errorsByScenario: this.groupErrorsByScenario(),
      errors: this.errors
    };

    logger.info(`Generated error report with ${report.totalErrors} errors`);
    return report;
  }

  groupErrorsByType() {
    const grouped = {};
    this.errors.forEach(error => {
      const type = error.name || 'Unknown';
      grouped[type] = (grouped[type] || 0) + 1;
    });
    return grouped;
  }

  groupErrorsByScenario() {
    const grouped = {};
    this.errors.forEach(error => {
      const scenario = error.testInfo?.scenario || 'Unknown';
      grouped[scenario] = (grouped[scenario] || 0) + 1;
    });
    return grouped;
  }

  clearErrors() {
    this.errors = [];
    logger.debug('Error history cleared');
  }
}

// Global error handler instance
const globalErrorHandler = new ErrorHandler();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  globalErrorHandler.captureError(new Error(`Unhandled Promise Rejection: ${reason}`), {
    type: 'unhandledRejection',
    promise
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  globalErrorHandler.captureError(error, { type: 'uncaughtException' });
  process.exit(1);
});

module.exports = { ErrorHandler, globalErrorHandler };
