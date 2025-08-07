const { chromium, firefox, webkit } = require('@playwright/test');
const { BrowserConstants } = require('../constants/BrowserConstants');
const browserConstants = new BrowserConstants();

const browserOptions = {
  slowMo: 50,
  args: ['--start-maximized', '--disable-extensions', '--disable-plugins'],
  headless: process.env.HEADLESS === 'true' || false
};

class BrowserUtils {
  async launchBrowser() {
    console.log('Launching Local Browser');
    const browserType = process.env.BROWSER || 'chromium';
    return await this.launchLocalBrowser(browserType);
  }

  async launchLocalBrowser(browserType) {
    if (browserConstants.getFirefox() === browserType) {
      return await firefox.launch(browserOptions);
    } else if (browserConstants.getWebkit() === browserType) {
      return await webkit.launch(browserOptions);
    } else {
      return await chromium.launch(browserOptions);
    }
  }

  async highlightElement(page, locator) {
    try {
      const elementHandle = await locator.elementHandle();
      if (elementHandle) {
        await page.evaluate(el => {
          el.style.border = '3px solid red';
          el.style.transition = 'border 0.3s ease-in-out';
        }, elementHandle);
      }
    } catch (err) {
      console.error('Error highlighting element:', err);
    }
  }

  async closeBrowser(browser, context, page) {
    try {
      if (page && !page.isClosed()) {
        await page.close();
        console.log('📄 Page closed successfully');
      }
      if (context) {
        await context.close();
        console.log('🔄 Context closed successfully');
      }
      if (browser && browser.isConnected()) {
        await browser.close();
        console.log('💻 Local browser closed successfully');
      }
    } catch (error) {
      console.warn(`⚠️ Error closing local browser resources: ${error.message}`);
    }
  }
}

module.exports = { BrowserUtils };
