const { Given, When, Then } = require('@cucumber/cucumber');
const { Helper } = require('../../../src/utils/helper');
const { expect } = require('chai');
const { TIMEOUT_DURATION } = require('../../../src/utils/config');
const UrlManager = require('../../../src/utils/UrlManager');

const helperObj = new Helper();

Given('I click on {string} from {string}', async function (elementName, pageName) {
  const element = await helperObj.getWebElement(elementName, pageName);
  await element.click();
});

Given(
  'I click the following {string} on the {string}',
  async function (element, pageName, dataTable) {
    const optionsArray = [];

    dataTable.rawTable.slice(1).forEach(([key, value]) => {
      optionsArray.push(value);
    });
    const parentWebElement = await helperObj.getWebElement(element, pageName);
    await parentWebElement.selectOption(optionsArray.map(opt => opt.trim()));
  }
);

Given('I double click the {string} on the {string}', async function (elementName, pageName) {
  const element = await helperObj.getWebElement(elementName, pageName);
  await element.dblclick();
});
