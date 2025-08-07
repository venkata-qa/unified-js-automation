const { Given, When, Then } = require('@cucumber/cucumber');
const { Helper } = require('../../../src/utils/helper');
const { expect } = require('chai');
const { TIMEOUT_DURATION } = require('../../../src/utils/config');

const helperObj = new Helper();

Given(
  'I zoom out page till I see element {string} on {string}',
  async function (elementName, pageName) {
    const element = await helperObj.getWebElement(elementName, pageName);
    let isVisible = await element.isVisible();
    let zoomLevel = 1.0;
    while (!isVisible && zoomLevel > 0.3) {
      zoomLevel -= 0.1;
      // Zoom out using JavaScript
      await this.page.evaluate(zoom => {
        document.body.style.zoom = zoom;
      }, zoomLevel.toFixed(2));

      await this.page.waitForTimeout(300); // small wait for layout reflow
      isVisible = await element.isVisible();
    }

    if (!isVisible) {
      throw new Error(`Element "${elementName}" not visible even after zooming out`);
    }
  }
);
