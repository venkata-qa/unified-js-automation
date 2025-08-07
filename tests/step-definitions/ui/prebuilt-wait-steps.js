const { Given, When, Then } = require('@cucumber/cucumber');
const { Helper } = require('../../../src/utils/helper');
const { expect } = require('chai');
const { TIMEOUT_DURATION } = require('../../../src/utils/config');
const UrlManager = require('../../../src/utils/UrlManager');

const helperObj = new Helper();

When(
  'I wait for element (string) to be present on the (string)',
  async function (elementName, pageName) {
    const webElement = await helperObj.getWebElement(elementName, pageName);
    await global.page.waitForSelector(webElement, { state: 'attached' });
  }
);

When(
  'I wait element (string) to be visible on the (string)',
  async function (elementName, pageName) {
    const webElement = await helperObj.getWebElement(elementName, pageName);
    await global.page.waitForSelector(webElement, { state: 'visible' });
  }
);

When('I wait {string} seconds to synchronize the things on app', async function (time) {
  const seconds = parseInt(time);
  await global.page.waitForTimeout(seconds * 1000);
});
