const { request } = require('@playwright/test');
const { BrowserUtils } = require('../../src/utils/BrowserUtils');
const { BrowserManager } = require('../../src/utils/browser');
const { BrowserStackUtils } = require('../../src/utils/browserstack');
const fs = require('fs');
const path = require('path');
// Load environment variables from .env file
require('dotenv').config();
const browserUtils = new BrowserUtils();
const logger = require('../../src/utils/logger');
const {
  Before,
  After,
  BeforeStep,
  AfterStep,
  AfterAll,
  Status,
  setDefaultTimeout,
  formatterHelpers
} = require('@cucumber/cucumber');

// Set default timeout for all hooks
setDefaultTimeout(120 * 1000); // Increased to 120 seconds

console.log('Hooks file loaded successfully!');

Before({ timeout: 180000 }, async function (scenario) {
  console.log('Before hook starting...');
  const tags = scenario.pickle ? scenario.pickle.tags : scenario.gherkinDocument.feature.tags || [];
  const isUITest = tags.some(tag => tag.name === '@ui');
  const cloudProvider = process.env.ENV;
  console.log(`Tags: ${tags.map(tag => tag.name).join(', ')}, isUITest: ${isUITest}, ENV: ${cloudProvider}`);

  if (isUITest) {
    if (cloudProvider === 'browserstack') {
      console.log('Using BrowserStack for browser launch...');
      logger.info('Using BrowserStack for browser launch...');
    } else {
      console.log('Using local browser for launch...');
      logger.info('Using local browser for launch...');
    }

    try {
      global.page = await BrowserManager.getPage();
      console.log('Browser and page initialized successfully');

      // Set session name for BrowserStack
      if (cloudProvider === 'browserstack') {
        try {
          await BrowserStackUtils.setSessionName(global.page, scenario.pickle.name);
        } catch (error) {
          logger.warn('Failed to set BrowserStack session name:', error);
        }
      }
    } catch (error) {
      const errorMessage = `BrowserStack setup failed: ${error.message}`;
      console.log(errorMessage);
      logger.error(errorMessage, error);
      throw error;
    }
  }
});

BeforeStep(function (scenario) {
  global.testName = scenario.pickle.name.replace(/\s+/g, '_');
  logger.debug(`Starting step: ${global.testName}`);
});

After({ timeout: 180000 }, async function (scenario) {
  console.log(`After hook starting for scenario: ${scenario.pickle.name}`);
  
  try {
    // Update BrowserStack status based on scenario result
    if (this.page && process.env.ENV === 'browserstack') {
      const status = scenario.result?.status === 'PASSED' ? 'passed' : 'failed';
      const reason = `Scenario: ${scenario.pickle.name} - ${scenario.result?.status || 'UNKNOWN'}`;
      
      console.log(`Updating BrowserStack session status to: ${status}`);
      const success = await BrowserStackUtils.updateSessionStatus(this.page, status, reason);
      if (success) {
        console.log(`BrowserStack session status updated to: ${status}`);
      } else {
        console.log(`Failed to update BrowserStack session status`);
      }
    }

    // Capture screenshot for failed scenarios
    if (scenario.result?.status === 'FAILED' && this.page) {
      try {
        console.log('Capturing screenshot for failed scenario');
        const screenshotBuffer = await this.page.screenshot({ 
          fullPage: true,
          type: 'png'
        });
        
        if (screenshotBuffer && this.attach) {
          await this.attach(screenshotBuffer, 'image/png');
          console.log('Screenshot embedded in report');
        } else {
          logger.warn('Attach function not available, skipping screenshot attachment.');
        }
      } catch (error) {
        console.warn('Failed to capture screenshot:', error);
      }
    }

    this.page = undefined;
    console.log('After hook completed successfully');
  } catch (error) {
    console.error('Error in After hook:', error);
    throw error;
  } finally {
    this.page = undefined;
  }

  // Handle local browser cleanup
  if (process.env.ENV !== 'browserstack' && global.browser) {
    await browserUtils.closeBrowser(global.browser, global.context, global.page);
  }

  // Close API context
  if (global.apiContext) {
    await global.apiContext.dispose();
    logger.debug('API context disposed');
  }

  const { line } = formatterHelpers.PickleParser.getPickleLocation({ 
    gherkinDocument: scenario.gherkinDocument, 
    pickle: scenario.pickle 
  });
  const status = scenario.result.status;
  logger.info(`${scenario.pickle.name} (line ${line}) finished with status: ${status}`);
});

// AfterAll hook to ensure proper cleanup
AfterAll({ timeout: 60000 }, async function () {
  console.log('AfterAll hook starting...');
  try {
    if (process.env.ENV === 'browserstack') {
      await BrowserManager.closeBrowser();
      console.log('AfterAll hook completed successfully');
    }
  } catch (error) {
    console.error('Error in AfterAll hook:', error);
    throw error;
  }
});
