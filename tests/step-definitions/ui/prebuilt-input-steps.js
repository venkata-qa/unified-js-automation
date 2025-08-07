const { Given, When, Then } = require('@cucumber/cucumber');
const { Helper } = require('../../../src/utils/helper');
const { expect } = require('chai');
const { TIMEOUT_DURATION } = require('../../../src/utils/config');
const UrlManager = require('../../../src/utils/UrlManager');
const path = require('path');
const env = process.env.NODE_ENV || 'DEV';
const dirPath = `../../../test-data/exceldata/${env}/`;
let filePath = '';
let userData = null;
const helperObj = new Helper();
//I enter value {string} in field {string} on {string}
Given(
  'I enter value {string} in field {string} on {string}',
  async function (value, elementName, pageName) {
    const element = await helperObj.getWebElement(elementName, pageName);
    await element.type(value);
  }
);

Given(
  'I enter the value {string} in field {string} on the {string}',
  async function (value, elementName, pageName) {
    const element = await helperObj.getWebElement(elementName, pageName);
    await element.type(value);
  }
);

Given(
  'I press the {string} key into the {string} on the {string}',
  async function (value, elementName, pageName) {
    const element = await helperObj.getWebElement(elementName, pageName);
    await element.press(value);
  }
);

Given('I clear the text {string} on the {string}', async function (value, elementName, pageName) {
  const element = await helperObj.getWebElement(elementName, pageName);
  await element.clear(value);
});

Given('I have a excel file {string}', async function (fileName) {
  filePath = path.join(__dirname, dirPath, fileName);
});

When('I read the data from excel', async function () {
  await helperObj.readExcelFile(filePath);
});

When(
  'I enter value on {string} and click {string}',
  { timeout: TIMEOUT_DURATION },
  async function (pageName, loginButtonElement) {
    userData = await helperObj.getExcelData();
    for (const row of userData) {
      for (const [elementName, value] of Object.entries(row)) {
        const element = await helperObj.getWebElement(elementName, pageName);
        await element.fill('');
        await element.type(value.toString());
      }
      const loginButton = await helperObj.getWebElement(loginButtonElement, pageName); // if needed
      if (loginButton) {
        await loginButton.click();
      }
    }
  }
);
