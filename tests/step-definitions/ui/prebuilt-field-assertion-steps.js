const { Given, When, Then } = require('@cucumber/cucumber');
const { Helper } = require('../../../src/utils/helper');
const UrlManager = require('../../../src/utils/UrlManager');
const helperObj = new Helper();
const { expect } = require('chai');

Then(
  'I verify that the field {string} should be (visible|invisible) on the {string}',
  async function (elementName, assertionType, pageClassName) {
    const element = await helperObj.getWebElement(elementName, pageClassName);
    const isElementDisplayed = await element.isVisible();
    switch (assertionType) {
      case 'visible':
        expect(isElementDisplayed).toBeTruthy();
        break;
      case 'invisible':
        expect(isElementDisplayed).toBeFalsy();
        break;
      default:
        throw new Error(`Invalid assertion type: ${assertionType}`);
    }
  }
);

Then(
  'I verify that the following fields should be (visible|invisible) {string} on the {string}',
  async function (assertionType, pageClassName, elementNames) {
    for (const elementName of elementNames) {
      const element = await helperObj.getWebElement(elementName, pageClassName);
      const isElementDisplayed = await element.isVisible();
      switch (assertionType) {
        case 'visible':
          expect(isElementDisplayed).toBeTruthy();
          break;
        case 'invisible':
          expect(isElementDisplayed).toBeFalsy();
          break;
      }
    }
  }
);

Then(
  'I verify that the field {string} should be (enabled|disabled) on the {string}',
  async function (elementName, assertionType, pageClassName) {
    const element = await helperObj.getWebElement(elementName, pageClassName);
    const isElementEnabled = await element.isEnabled();
    switch (assertionType) {
      case 'enabled':
        expect(isElementEnabled).toBeTruthy();
        break;
      case 'disabled':
        expect(isElementEnabled).toBeFalsy();
        break;
      default:
        throw new Error(`Invalid assertion type: ${assertionType}`);
    }
  }
);

Then(
  'I verify that the following fields should be (enabled|disabled) {string} on the {string}',
  async function (assertionType, pageClassName, elementNames) {
    for (const elementName of elementNames) {
      const element = await helperObj.getWebElement(elementName, pageClassName);
      const isElementEnabled = await element.isEnabled();
      switch (assertionType) {
        case 'enabled':
          expect(isElementEnabled).toBeTruthy();
          break;
        case 'disabled':
          expect(isElementEnabled).toBeFalsy();
          break;
      }
    }
  }
);

Then(
  'I verify that the field {string} should be (checked|unchecked) on the {string}',
  async function (elementName, assertionType, pageClassName) {
    const element = await helperObj.getWebElement(elementName, pageClassName);
    const isElementChecked = await element.isChecked();
    switch (assertionType) {
      case 'checked':
        expect(isElementChecked).toBeTruthy();
        break;
      case 'unchecked':
        expect(isElementChecked).toBeFalsy();
        break;
    }
  }
);

When(
  'I verify the table {string} on the {string}',
  async function (elementName, pageClassName, dataTable) {
    const rows = dataTable.hashes();
    const webElements = await helperObj.getWebElements(elementName, pageClassName);
    expect(webElements.length).toBe(rows.length);
    for (let i = 0; i < rows.length; i++) {
      expect(await webElements[i].textContent()).toBe(rows[i].data);
    }
  }
);

Then(
  'I verify the field {string} having exact or greater than value {string} on the {string}',
  async function (elementName, expectedResult, pageClassName) {
    const elements = await helperObj.getWebElements(elementName, pageClassName);
    const expected = parseInt(expectedResult, 10);
    expect(elements.length).toBeGreaterThanOrEqual(expected);
  }
);

Then(
  'I verify the field {string} having exact value {string} on the {string}',
  async function (elementName, expectedResult, pageClassName) {
    const elements = await helperObj.getWebElements(elementName, pageClassName);
    const expected = parseInt(expectedResult, 10);
    expect(elements.length).toBe(expected);
  }
);

Then('I verify title {string} is displayed', async function (title) {
  console.log('verify success title');
  const pageTitle = await global.page.title();
  expect(pageTitle).to.equal(title);
});
