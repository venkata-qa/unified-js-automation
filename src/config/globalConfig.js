require('dotenv').config();

// Environment validation
const requiredEnvVars = ['NODE_ENV'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Configuration constants
const CONFIG = {
  // Environment settings
  NODE_ENV: process.env.NODE_ENV || 'dev',
  CI: process.env.CI === 'true',
  DEBUG: process.env.DEBUG === 'true',

  // Test execution settings
  PARALLEL_THREADS: parseInt(process.env.PARALLEL_THREAD) || 1,
  BROWSER: process.env.BROWSER || 'chromium',
  HEADLESS: process.env.HEADLESS !== 'false',
  RECORD_VIDEO: process.env.RECORD_VIDEO === 'true',
  SLOW_MO: parseInt(process.env.SLOW_MO) || 0,

  // Timeout settings
  TIMEOUT_DURATION: parseInt(process.env.TIMEOUT_DURATION) || 30000,
  NAVIGATION_TIMEOUT: parseInt(process.env.NAVIGATION_TIMEOUT) || 30000,
  ASSERTION_TIMEOUT: parseInt(process.env.ASSERTION_TIMEOUT) || 5000,

  // Retry settings
  TEST_RETRIES: parseInt(process.env.TEST_RETRIES) || (process.env.CI ? 2 : 0),
  SCREENSHOT_MODE: process.env.SCREENSHOT_MODE || 'only-on-failure',
  TRACE_MODE: process.env.TRACE_MODE || 'on-first-retry',

  // Reporting settings
  ALLURE_RESULTS_DIR: process.env.ALLURE_RESULTS_DIR || 'reports/allure/results',
  REPORT_PORTAL_ENDPOINT: process.env.REPORT_PORTAL_ENDPOINT,
  REPORT_PORTAL_TOKEN: process.env.REPORT_PORTAL_TOKEN,
  REPORT_PORTAL_PROJECT: process.env.REPORT_PORTAL_PROJECT,

  // Security settings
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,

  // Cloud testing settings
  BROWSERSTACK_USERNAME: process.env.BROWSERSTACK_USERNAME,
  BROWSERSTACK_ACCESS_KEY: process.env.BROWSERSTACK_ACCESS_KEY,
  SAUCE_USERNAME: process.env.SAUCE_USERNAME,
  SAUCE_ACCESS_KEY: process.env.SAUCE_ACCESS_KEY,

  // Database settings
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT) || 3306,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,

  // Azure DevOps settings
  AZURE_ORG: process.env.AZURE_ORG,
  AZURE_PROJECT: process.env.AZURE_PROJECT,
  AZURE_PAT: process.env.AZURE_PAT,

  // Notification settings
  SLACK_WEBHOOK: process.env.SLACK_WEBHOOK,
  TEAMS_WEBHOOK: process.env.TEAMS_WEBHOOK,
  EMAIL_RECIPIENTS: process.env.EMAIL_RECIPIENTS,

  // Performance testing
  PERFORMANCE_BUDGET: {
    FCP: parseInt(process.env.FCP_BUDGET) || 2000,
    LCP: parseInt(process.env.LCP_BUDGET) || 4000,
    FID: parseInt(process.env.FID_BUDGET) || 300,
    CLS: parseFloat(process.env.CLS_BUDGET) || 0.1
  }
};

module.exports = CONFIG;
