/**
 * URL Manager - Centralized URL configuration using environment variables
 *
 * This utility provides a single source of truth for all application URLs,
 * supporting different environments and fallback defaults.
 */

const CONFIG = require('../config/globalConfig');
const logger = require('./logger');

class UrlManager {
  /**
   * Get all configured URLs for the current environment
   * @returns {Object} Object containing all application URLs
   */
  static getUrls() {
    const env = CONFIG.NODE_ENV;
    logger.info(`Loading URLs for environment: ${env}`);

    return {
      demo: process.env.DEMO_URL || this.getDefaultUrl('demo', env),
      parabank: process.env.PARABANK_URL || this.getDefaultUrl('parabank', env),
      reqres: process.env.API_BASE_URL || this.getDefaultUrl('reqres', env),
      basicUI: process.env.BASIC_UI_DEMO_URL || this.getDefaultUrl('basicUI', env),
      alerts: process.env.BASIC_UI_ALERT_URL || this.getDefaultUrl('alerts', env),
      dragDrop: process.env.DRAG_DROP_URL || this.getDefaultUrl('dragDrop', env),
      keyboard: process.env.KEYBOARD_PAGE_URL || this.getDefaultUrl('keyboard', env)
    };
  }

  /**
   * Get a specific URL by name
   * @param {string} urlName - The name of the URL to retrieve
   * @returns {string} The URL for the specified name
   */
  static getUrl(urlName) {
    const urls = this.getUrls();
    const url = urls[urlName];

    if (!url) {
      logger.warn(`URL not found for: ${urlName}. Available URLs: ${Object.keys(urls).join(', ')}`);
      throw new Error(`URL not configured for: ${urlName}`);
    }

    logger.info(`Retrieved URL for ${urlName}: ${url}`);
    return url;
  }

  /**
   * Get default URL based on environment and type
   * @param {string} type - The type of URL (demo, parabank, etc.)
   * @param {string} env - The environment (dev, test, prod)
   * @returns {string} The default URL for the given type and environment
   */
  static getDefaultUrl(type, env) {
    const urls = {
      dev: {
        demo: 'https://demoqa.com/',
        parabank: 'https://parabank.parasoft.com/parabank/index.html',
        reqres: 'https://reqres.in/',
        basicUI: 'https://testpages.herokuapp.com/styled/basic-html-form-test.html',
        alerts: 'https://testpages.eviltester.com/styled/alerts/alert-test.html',
        dragDrop: 'https://testpages.eviltester.com/styled/drag-drop-javascript.html',
        keyboard: 'https://the-internet.herokuapp.com/key_presses'
      },
      test: {
        demo: 'https://test-demoqa.com/',
        parabank: 'https://test-parabank.parasoft.com/parabank/index.html',
        reqres: 'https://test-reqres.in/',
        basicUI: 'https://test-testpages.herokuapp.com/styled/basic-html-form-test.html',
        alerts: 'https://test-testpages.eviltester.com/styled/alerts/alert-test.html',
        dragDrop: 'https://test-testpages.eviltester.com/styled/drag-drop-javascript.html',
        keyboard: 'https://test-internet.herokuapp.com/key_presses'
      },
      prod: {
        demo: 'https://demoqa.com/',
        parabank: 'https://parabank.parasoft.com/parabank/index.html',
        reqres: 'https://reqres.in/',
        basicUI: 'https://testpages.herokuapp.com/styled/basic-html-form-test.html',
        alerts: 'https://testpages.eviltester.com/styled/alerts/alert-test.html',
        dragDrop: 'https://testpages.eviltester.com/styled/drag-drop-javascript.html',
        keyboard: 'https://the-internet.herokuapp.com/key_presses'
      }
    };

    const environmentUrls = urls[env] || urls.dev;
    const url = environmentUrls[type];

    if (!url) {
      logger.warn(`No default URL found for ${type} in ${env} environment`);
      return environmentUrls.demo; // fallback to demo URL
    }

    return url;
  }

  /**
   * Get API configuration from environment variables
   * @returns {Object} API configuration object
   */
  static getApiConfig() {
    return {
      baseUrl: process.env.API_BASE_URL || 'https://reqres.in',
      contentType: process.env.API_CONTENT_TYPE || 'application/json',
      apiKey: process.env.API_KEY || 'reqres-free-v1',
      timeout: parseInt(process.env.TIMEOUT_DURATION) || 30000
    };
  }

  /**
   * Validate that all required URLs are configured
   * @returns {Object} Validation result with status and missing URLs
   */
  static validateUrls() {
    const requiredUrls = ['demo', 'parabank', 'reqres', 'basicUI'];
    const urls = this.getUrls();
    const missing = [];

    requiredUrls.forEach(urlName => {
      if (!urls[urlName]) {
        missing.push(urlName);
      }
    });

    const isValid = missing.length === 0;

    if (isValid) {
      logger.info('All required URLs are configured');
    } else {
      logger.warn(`Missing URL configurations: ${missing.join(', ')}`);
    }

    return {
      valid: isValid,
      missing: missing,
      configured: Object.keys(urls).filter(key => urls[key])
    };
  }
}

module.exports = UrlManager;
