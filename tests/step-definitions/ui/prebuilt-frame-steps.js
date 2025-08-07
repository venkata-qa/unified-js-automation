const { Given, When, Then } = require('@cucumber/cucumber');
const { Helper } = require('../../../src/utils/helper');
const helperObj = new Helper();

Given('I switch to parent frame', async function () {
  await global.page.frameLocator('..').frame(); // switch to parent frame
});

Given(
  'I switch to the {string} frame on the {string}',
  async function (elementName, pageClassName) {
    const frameElement = await helperObj.getWebElement(elementName, pageClassName);
    const frame = await frameElement.contentFrame();
    if (frame) {
      await frame.goto();
    } else {
      throw new Error(`Frame '${elementName}' not found on the page '${pageClassName}'`);
    }
  }
);

Given('I switch to main content of the page', async function () {
  await page.mainFrame();
});
