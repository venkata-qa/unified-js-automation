const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const { Helper } = require('../../../src/utils/helper');
const { TIMEOUT_DURATION } = require('../../../src/utils/config');
const UrlManager = require('../../../src/utils/UrlManager');
const helperObj = new Helper();

Given('I accept the alert from {string} on {string}', async function (elementName, pageName) {
  await Promise.all([
    global.page.waitForEvent('dialog').then(dialog => dialog.accept()),
    helperObj.getWebElement(elementName, pageName).then(element => element.click())
  ]);
});

Given('I dismiss the alert from {string} on {string}', async function (elementName, pageName) {
  await Promise.all([
    global.page.waitForEvent('dialog').then(dialog => dialog.dismiss()),
    helperObj.getWebElement(elementName, pageName).then(element => element.click())
  ]);
});

Given(
  'I should see alert text as {string} from {string} on {string}',
  async function (expectedText, elementName, pageName) {
    await Promise.all([
      global.page.waitForEvent('dialog').then(async dialog => {
        expect(dialog.message()).to.equal(expectedText);
        await dialog.dismiss();
      }),
      helperObj.getWebElement(elementName, pageName).then(element => element.click())
    ]);
  }
);

// NEW: Environment-based alert testing
Given(
  'I test alerts on {string} application from environment',
  { timeout: TIMEOUT_DURATION },
  async function (appName) {
    const url = UrlManager.getUrl(appName);
    await global.page.goto(url);
    console.log(`Navigated to ${appName} for alert testing: ${url}`);
  }
);

Given('I accept the environment alert from {string}', async function (elementSelector) {
  await Promise.all([
    global.page.waitForEvent('dialog').then(dialog => dialog.accept()),
    global.page.locator(elementSelector).click()
  ]);
});

Given('I dismiss the environment alert from {string}', async function (elementSelector) {
  await Promise.all([
    global.page.waitForEvent('dialog').then(dialog => dialog.dismiss()),
    global.page.locator(elementSelector).click()
  ]);
});
