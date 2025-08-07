const parallelThreads = process.env.PARALLEL_THREAD || 1;

module.exports = {
  // Feature files location
  default: {
    paths: ['tests/features/**/*.feature'],
    require: [
      'tests/support/hooks.js',
      'tests/step-definitions/**/*-steps.js'
    ],
    format: [
      'progress-bar',
      'json:reports/cucumber/cucumber_report.json',
      'allure-cucumberjs/reporter'
    ],
    formatOptions: {
      'allure-cucumberjs': {
        resultsDir: 'allure-results'
      }
    },
    parallel: parseInt(parallelThreads),
    retry: 0,
    publishQuiet: true
  }
};
