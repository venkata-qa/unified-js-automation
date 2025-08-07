module.exports = {
  // Allure results directory
  resultsDir: 'reports/allure/results',
  
  // Allure report output directory
  reportDir: 'reports/allure/html',
  
  // Environment properties
  environment: {
    'Test Framework': 'Cucumber.js + Playwright',
    'Node Version': process.version,
    'Platform': process.platform,
    'Environment': process.env.NODE_ENV || 'dev',
    'Browser': process.env.BROWSER || 'chromium'
  },
  
  // Report configuration
  report: {
    reportName: 'Playwright BDD Test Report',
    reportTitle: 'Test Automation Results',
    reportLogo: null, // You can add a logo URL here
    reportLanguage: 'en'
  },
  
  // Categories for test classification
  categories: [
    {
      name: 'Ignored tests',
      matchedStatuses: ['skipped']
    },
    {
      name: 'Infrastructure problems',
      matchedStatuses: ['broken', 'failed'],
      messageRegex: '.*timeout.*|.*connection.*|.*network.*'
    },
    {
      name: 'Outdated tests',
      matchedStatuses: ['broken'],
      traceRegex: '.*FileNotFoundException.*'
    },
    {
      name: 'Product defects',
      matchedStatuses: ['failed']
    },
    {
      name: 'Test defects',
      matchedStatuses: ['broken']
    }
  ]
};
