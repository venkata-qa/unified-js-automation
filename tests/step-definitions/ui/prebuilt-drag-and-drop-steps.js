const { Given, When, Then } = require('@cucumber/cucumber');
const { Helper } = require('../../../src/utils/helper');
const { TIMEOUT_DURATION } = require('../../../src/utils/config');
const UrlManager = require('../../../src/utils/UrlManager');
const helperObj = new Helper();

// NEW: Navigate to drag and drop testing page from environment
Given(
  'I navigate to drag and drop testing page from environment',
  { timeout: TIMEOUT_DURATION },
  async function () {
    const dragDropUrl = UrlManager.getUrl('dragDrop');
    await global.page.goto(dragDropUrl);
    console.log(`Navigated to drag and drop testing page: ${dragDropUrl}`);
  }
);

Then(
  'Perform drag {string} and drop {string} on {string} page',
  { timeout: TIMEOUT_DURATION },
  async function (sourceElement, targetElement, pageClassName) {
    const sourceSelector = await helperObj.getSelector(sourceElement, pageClassName);
    const targetSelector = await helperObj.getSelector(targetElement, pageClassName);
    await global.page.dragAndDrop(sourceSelector, targetSelector);
  }
);
