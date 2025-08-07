const { Given, When, Then } = require('@cucumber/cucumber');
const { Helper } = require('../../../src/utils/helper');
const { expect } = require('chai');
const { TIMEOUT_DURATION } = require('../../../src/utils/config');
const UrlManager = require('../../../src/utils/UrlManager');
const helperObj = new Helper();
let url = '';

Given('I am in App site {string}', async function (pageName) {
  const helperObj = new Helper();
  url = await helperObj.getNavigatePageObjectPath(pageName);
});

Given(
  'I navigate to application {string}',
  { timeout: TIMEOUT_DURATION },
  async function (pageObject) {
    const url = await helperObj.getNavigatePageObjectPath(pageObject);
    await global.page.goto(url);
  }
);

// NEW: Navigate using environment variables
Given(
  'I navigate to {string} application from environment',
  { timeout: TIMEOUT_DURATION },
  async function (appName) {
    const url = UrlManager.getUrl(appName);
    await global.page.goto(url);
    console.log(`Navigated to ${appName} application: ${url}`);
  }
);

Given('I navigate forward on the browser', async function () {
  await global.page.goForward();
});

Given('I navigate back on the browser', async function () {
  await global.page.goBack();
});

Given('I refresh the current web page', { timeout: TIMEOUT_DURATION }, async function () {
  await global.page.reload();
});

Given('I switch to new window', async function () {
  const [newPage] = await Promise.all([
    global.context.waitForEvent('page'),
    global.page.evaluate(() => window.open())
  ]);
  global.page = newPage;
  await newPage.bringToFront();
});

Given('I switch to previous window', async function () {
  const pages = global.context.pages();
  if (pages.length > 1) {
    global.page = pages[pages.length - 2];
    await global.page.bringToFront();
  }
});

Given('I maximize the windows', async function () {
  const { width, height } = await global.page.evaluate(() => ({
    width: window.screen.availWidth,
    height: window.screen.availHeight
  }));
  await global.page.setViewportSize({ width, height });
});

// NEW: Validate URL configuration step
Then('the URL configuration should be valid', function () {
  const validation = UrlManager.validateUrls();
  if (!validation.valid) {
    throw new Error(`Missing URL configurations: ${validation.missing.join(', ')}`);
  }
  console.log(`URL configuration is valid. Available URLs: ${validation.configured.join(', ')}`);
});

Given('I open new tab with URL {string}', async function (newUrl) {
  const [newPage] = await Promise.all([
    global.context.waitForEvent('page'),
    global.page.evaluate(url => window.open(url), newUrl)
  ]);
  global.page = newPage;
  await newPage.bringToFront();
});
