const { Given, When, Then } = require('@cucumber/cucumber');
const { Helper } = require('../../../src/utils/helper');
const { TIMEOUT_DURATION } = require('../../../src/utils/config');

const helperObj = new Helper();

Given('I scroll to {string} of page', async function (to) {
  const page = global.page;
  if (to === 'top') {
    await page.evaluate(() => window.scrollTo(0, 0));
  } else if (to === 'end') {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  } else {
    throw new Error(`Invalid scroll direction: ${to}`);
  }
});

Given('I scroll to element (string) on (string)', async function (elementName, pageName) {
  const webElement = await helperObj.getWebElement(elementName, pageName);
  await element.scrollIntoViewIfNeeded();
});
