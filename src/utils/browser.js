const { chromium, firefox, webkit } = require('playwright');
const { browserStackConfig } = require('../config/browserstack.config');
const logger = require('./logger');

// Load environment variables
require('dotenv').config();

class BrowserManager {
  static browser = null;
  static context = null;
  static page = null;

  static getBrowserType() {
    const browserName = process.env.BROWSER?.toLowerCase() || 'chrome';

    // Handle BrowserStack specific browsers
    if (process.env.ENV === 'browserstack') {
      if (browserName.includes('safari')) {
        return webkit;
      }
      // Default to chromium for BrowserStack
      return chromium;
    }

    // Handle local browsers
    switch (browserName) {
      case 'firefox':
        return firefox;
      case 'webkit':
      case 'safari':
        return webkit;
      default:
        return chromium;
    }
  }

  static getBrowserStackCapabilities() {
    const browserName = process.env.BROWSER?.toLowerCase() || 'chrome';
    const browserEnv = browserStackConfig.environments[browserName];

    if (!browserEnv) {
      throw new Error(`Unsupported browser environment: ${browserName}`);
    }

    const timestamp = new Date().toISOString();

    // Desktop browser capabilities
    return {
      'browserstack.local': false,
      'browserstack.debug': true,
      'browserstack.console': 'verbose',
      'browserstack.networkLogs': true,
      'name': `Test Run - ${timestamp}`,
      'build': `${browserName} Build ${timestamp}`,
      'project': 'TESTX_Playwright_Automation',
      'browser': browserEnv.browser || 'chrome',
      'browser_version': browserEnv.browser_version || 'latest',
      'os': browserEnv.os || 'Windows',
      'os_version': browserEnv.os_version || '11',
      'resolution': '1920x1080',
      'bstack:options': {
        'debug': true,
        'networkLogs': true,
        'consoleLogs': 'verbose'
      }
    };
  }

  static async getPage() {
    try {
      // If we have a valid page, return it
      if (this.page) {
        try {
          // Test if the page is still usable
          await this.page.evaluate(() => true);
          return this.page;
        } catch (error) {
          logger.info('Existing page is no longer valid, creating new one');
          this.page = null;
        }
      }

      if (!this.browser) {
        const browserType = this.getBrowserType();
        logger.info(`Initializing browser with type: ${browserType.name()}`);

        if (process.env.ENV === 'browserstack') {
          const caps = this.getBrowserStackCapabilities();

          // Construct the WebSocket endpoint with credentials in URL
          const wsEndpoint = `wss://${browserStackConfig.user}:${browserStackConfig.key}@cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`;

          console.log('BrowserStack Connection Details:');
          console.log(`Platform: ${caps.os}`);
          console.log(`Browser: ${caps.browser}`);
          console.log(`Username: ${browserStackConfig.user}`);
          console.log(`Access Key: ${browserStackConfig.key ? 'SET' : 'NOT SET'}`);
          console.log(`WebSocket URL: ${wsEndpoint.replace(browserStackConfig.key, 'HIDDEN')}`);

          logger.info('Connecting to BrowserStack...');

          try {
            console.log('Attempting BrowserStack connection...');
            console.log('Using 60 second timeout');
            
            this.browser = await browserType.connect(wsEndpoint, {
              timeout: 60000
            });
            console.log('Browser connected successfully!');
          } catch (error) {
            console.log(`Connection failed: ${error.message}`);
            throw new Error(`Failed to connect to BrowserStack: ${error.message}`);
          }
        } else {
          this.browser = await browserType.launch({
            headless: process.env.HEADLESS !== 'false'
          });
        }
      }

      if (!this.context) {
        if (!this.browser) {
          throw new Error('Browser instance is null when trying to create a context.');
        }

        this.context = await this.browser.newContext({
          viewport: { width: 1920, height: 1080 }
        });
      }

      if (!this.page) {
        this.page = await this.context.newPage();
      }

      if (!this.page) {
        throw new Error('Failed to create browser page');
      }

      return this.page;

    } catch (error) {
      logger.error('Failed to initialize browser/page:', error);
      throw error;
    }
  }

  static async closeBrowser() {
    console.log('BrowserManager.closeBrowser() called');
    try {
      // Close in reverse order of creation
      if (this.page) {
        console.log('Closing page...');
        try {
          await this.page.close().catch(() => {});
          console.log('Page closed successfully');
        } catch (err) {
          logger.warn('Non-critical error while closing page', { error: err });
        } finally {
          this.page = null;
        }
      }

      if (this.context) {
        console.log('Closing context...');
        try {
          await Promise.resolve(this.context.close()).catch(() => { });
          console.log('Context closed successfully');
        } catch (err) {
          logger.warn('Non-critical error while closing context', { error: err });
        } finally {
          this.context = null;
        }
      }

      if (this.browser) {
        console.log('Closing browser...');
        try {
          if ('isConnected' in this.browser && typeof this.browser.isConnected === 'function') {
            const isConnected = this.browser.isConnected();
            console.log(`Browser connected status: ${isConnected}`);
            if (isConnected) {
              await Promise.resolve(this.browser.close()).catch(() => { });
            }
          } else {
            await Promise.resolve(this.browser.close()).catch(() => { });
          }
          console.log('Browser closed successfully');
        } catch (err) {
          logger.warn('Non-critical error while closing browser', { error: err });
        } finally {
          this.browser = null;
        }
      }

      logger.info('Browser cleanup completed');
      console.log('BrowserManager.closeBrowser() completed');
    } catch (error) {
      logger.error('Error during browser cleanup', { error });
      console.error('BrowserManager.closeBrowser() failed:', error);
    }
  }
}

module.exports = { BrowserManager };
