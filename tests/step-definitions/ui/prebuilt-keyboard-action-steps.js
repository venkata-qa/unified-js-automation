const { Given, When, Then } = require('@cucumber/cucumber');
const { Helper } = require('../../../src/utils/helper');
const { TIMEOUT_DURATION } = require('../../../src/utils/config');
const UrlManager = require('../../../src/utils/UrlManager');
const helperObj = new Helper();

When(
  'I press enter button for the {string} on the {string}',
  async function (elementName, pageClassName) {
    const element = await helperObj.getWebElement(elementName, pageClassName);
    await element.press('Enter');
  }
);

// NEW: Navigate to keyboard testing page from environment
Given(
  'I navigate to keyboard testing page from environment',
  { timeout: TIMEOUT_DURATION },
  async function () {
    const keyboardUrl = UrlManager.getUrl('keyboard');
    await global.page.goto(keyboardUrl);
    console.log(`Navigated to keyboard testing page: ${keyboardUrl}`);
  }
);

When('I press {string} key on the page', async function (keyName) {
  await global.page.keyboard.press(keyName);
});

When('I type {string} on the keyboard input field', async function (text) {
  // Assuming there's a default input field for keyboard testing
  await global.page.keyboard.type(text);
});
