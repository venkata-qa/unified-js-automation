const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const { TIMEOUT_DURATION } = require('../../../src/utils/config');
const { Helper } = require('../../../src/utils/helper');

const helperObj = new Helper();

Given('I select checkbox on {string} from {string}', async function (element, pageName) {
  const webElement = await helperObj.getWebElement(element, pageName);
  try {
    const isChecked = await webElement.isChecked();
    if (!isChecked) {
      await webElement.click();
    }
  } catch {
    console.log('checkbox is already selected');
  }
});

Given(
  'I select multiple checkbox on {string} from {string}',
  async function (options, element, pageName) {
    const optionsArray = options.split(',');
    const parentWebElement = await helperObj.getWebElement(element, pageName);
    for (const option of optionsArray) {
      const optionElement = await parent.$(`option[value="${option.trim()}"]`);
      if (optionElement) {
        await optionElement.select();
      } else {
        throw new Error(`Option with value "${option.trim()}" not found.`);
      }
    }
  }
);

Given(
  'I verify checkbox selected state {string} for {string} on {string}',
  { timeout: TIMEOUT_DURATION },
  async function (expectedState, element, pageName) {
    const webElement = await helperObj.getWebElement(element, pageName);
    const isChecked = await webElement.isChecked();
    const expectedCheckedState = expectedState.toLowerCase() === 'selected';
    expect(isChecked).to.equal(
      expectedCheckedState,
      `Expected checkbox state to be ${expectedState}, but it was ${isChecked ? 'selected' : 'not selected'}`
    );
  }
);
