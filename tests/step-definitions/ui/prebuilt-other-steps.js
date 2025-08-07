const { Given, When, Then } = require('@cucumber/cucumber');
const { Helper } = require('../../../src/utils/helper');
const { TIMEOUT_DURATION } = require('../../../src/utils/config');
const { randomAlphabetic } = require('randomstring');
const helperObj = new Helper();

When('I click on created element {string} on the {string}', async function (elementName, pageName) {
  const elements = await helperObj.getWebElements(elementName, pageName);
  for (const element of elements) {
    const textContent = await element.textContent();
    if (textContent.includes(this.textToEnter)) {
      await element.click();
      break;
    }
  }
});

When(
  'I verify the created element option {string} on the {string}',
  async function (elementName, pageName) {
    const element = await helperObj.getWebElement(elementName, pageName);
    await element.click();
    const textToEnter = randomAlphabetic(10);
    const createdElement = await global.page.locator(`xpath=.//*[text()='${textToEnter}']`);
    await expect(createdElement).toBeVisible();
  }
);

When('I enter the value in {string} on the {string}', async function (elementName, pageName) {
  const element = await helperObj.getWebElement(elementName, pageName);
  const textToEnter = randomAlphabetic(10);
  await element.fill(textToEnter);
});
