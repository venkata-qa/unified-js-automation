const { Given, When, Then } = require('@cucumber/cucumber');
const { Helper } = require('../../../src/utils/helper');
const { TIMEOUT_DURATION } = require('../../../src/utils/config');

const helperObj = new Helper();

When(
  'I print all the values of {string} on the {string} page',
  async function (elementName, pageName) {
    const webElements = await helperObj.getWebElements(elementName, pageClassName); // implement this utility
    const count = await webElements.count();
    for (let i = 0; i < count; i++) {
      const text = await webElements.nth(i).innerText();
      console.log(`Element Value is ${text}`);
    }
  }
);
