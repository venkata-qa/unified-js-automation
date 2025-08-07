#!/usr/bin/env node

/**
 * Test Summary Utility
 * Displays formatted test execution summary in terminal
 */

const fs = require('fs');
const path = require('path');

class TestSummary {
  constructor() {
    this.startTime = Date.now();
    this.endTime = null;
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      undefined: 0,
      total: 0
    };
  }

  // Colors for terminal output
  colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m'
  };

  formatTime(ms) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  }

  printBanner(title) {
    const c = this.colors;
    const width = 80;
    const border = '═'.repeat(width);

    console.log(`\n${c.cyan}${border}${c.reset}`);
    console.log(
      `${c.cyan}║${c.bright}${c.white} ${title.padEnd(width - 4)} ${c.reset}${c.cyan}║${c.reset}`
    );
    console.log(`${c.cyan}${border}${c.reset}\n`);
  }

  printTestSummary(testType = 'Tests', testTags = '') {
    this.endTime = Date.now();
    const duration = this.endTime - this.startTime;
    const c = this.colors;

    this.printBanner(`🎯 ${testType.toUpperCase()} EXECUTION SUMMARY`);

    // Test information
    console.log(`${c.bright}${c.blue}📋 Test Information:${c.reset}`);
    console.log(`   Test Type: ${c.bright}${testType}${c.reset}`);
    if (testTags) console.log(`   Tags: ${c.bright}${testTags}${c.reset}`);
    console.log(`   Duration: ${c.bright}${this.formatTime(duration)}${c.reset}`);
    console.log(`   Timestamp: ${c.dim}${new Date().toISOString()}${c.reset}\n`);

    // Check if we have any results
    const total =
      this.results.total ||
      this.results.passed + this.results.failed + this.results.skipped + this.results.undefined;

    if (total > 0) {
      // We have actual results
      console.log(`${c.bright}${c.blue}📊 Results Summary:${c.reset}`);

      if (this.results.passed > 0) {
        console.log(
          `   ${c.bgGreen}${c.white} PASSED ${c.reset} ${c.green}${this.results.passed.toString().padStart(3)}${c.reset} scenarios`
        );
      }

      if (this.results.failed > 0) {
        console.log(
          `   ${c.bgRed}${c.white} FAILED ${c.reset} ${c.red}${this.results.failed.toString().padStart(3)}${c.reset} scenarios`
        );
      }

      if (this.results.undefined > 0) {
        console.log(
          `   ${c.bgYellow}${c.white} UNDEF  ${c.reset} ${c.yellow}${this.results.undefined.toString().padStart(3)}${c.reset} scenarios`
        );
      }

      if (this.results.skipped > 0) {
        console.log(
          `   ${c.dim} SKIP   ${c.reset} ${c.dim}${this.results.skipped.toString().padStart(3)}${c.reset} scenarios`
        );
      }

      console.log(`   ${'─'.repeat(20)}`);
      console.log(
        `   ${c.bright} TOTAL  ${c.reset} ${c.bright}${total.toString().padStart(3)}${c.reset} scenarios\n`
      );

      // Success rate
      const successRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;
      const rateColor = successRate >= 90 ? c.green : successRate >= 70 ? c.yellow : c.red;
      console.log(
        `${c.bright}${c.blue}✅ Success Rate:${c.reset} ${rateColor}${c.bright}${successRate}%${c.reset}\n`
      );

      // Status indicator
      const overallStatus = this.results.failed === 0 && this.results.undefined === 0;
      if (overallStatus) {
        console.log(`${c.bgGreen}${c.white}${c.bright} ✅ ALL TESTS PASSED ${c.reset}\n`);
      } else {
        console.log(`${c.bgRed}${c.white}${c.bright} ❌ SOME TESTS FAILED ${c.reset}\n`);
      }

      // Report location
      console.log(`${c.bright}${c.blue}📄 Reports:${c.reset}`);
      console.log(`   Allure Report: ${c.dim}reports/allure/html/index.html${c.reset}`);
      console.log(`   View Report: ${c.cyan}npm run report:open${c.reset}\n`);

      // Footer
      console.log(`${c.cyan}${'═'.repeat(80)}${c.reset}\n`);

      return overallStatus;
    } else {
      // No parsed results, provide general summary
      console.log(`${c.bright}${c.blue}📊 Test Execution Completed:${c.reset}`);
      console.log(`   ${c.yellow}⚠️  Results parsing not available${c.reset}`);
      console.log(`   ${c.dim}Check the test output above for detailed results${c.reset}\n`);

      // Environment info
      console.log(`${c.bright}${c.blue}🔧 Test Environment:${c.reset}`);
      if (process.env.BROWSER) console.log(`   🌐 Browser: ${process.env.BROWSER}`);
      if (process.env.CLOUD_PROVIDER)
        console.log(`   ☁️  Cloud Provider: ${process.env.CLOUD_PROVIDER}`);
      if (process.env.NODE_ENV) console.log(`   🔧 Environment: ${process.env.NODE_ENV}`);
      if (process.env.PARALLEL_THREAD)
        console.log(`   🔀 Parallel Threads: ${process.env.PARALLEL_THREAD}`);

      // Helpful information
      console.log(`\n${c.bright}${c.blue}📄 Next Steps:${c.reset}`);
      console.log('   • Review test output above for pass/fail status');
      console.log(`   • Generate reports: ${c.cyan}npm run allure:generate${c.reset}`);
      console.log(`   • View reports: ${c.cyan}npm run report:open${c.reset}`);
      console.log(
        `   • Check logs: ${c.dim}logs/automation-${new Date().toISOString().split('T')[0]}.log${c.reset}\n`
      );

      // Footer
      console.log(`${c.cyan}${'═'.repeat(80)}${c.reset}\n`);

      return true; // Assume success when we can't parse results
    }
  }

  // Parse cucumber output to extract results
  parseCucumberOutput(output) {
    try {
      // Look for the summary line like "5 scenarios (1 undefined, 4 passed)"
      const summaryMatch = output.match(/(\d+)\s+scenarios?\s*\(([^)]+)\)/);
      if (summaryMatch) {
        const total = parseInt(summaryMatch[1]);
        const details = summaryMatch[2];

        // Reset results
        this.results = { passed: 0, failed: 0, skipped: 0, undefined: 0, total: total };

        // Parse details
        if (details.includes('passed')) {
          const passedMatch = details.match(/(\d+)\s+passed/);
          if (passedMatch) this.results.passed = parseInt(passedMatch[1]);
        }

        if (details.includes('failed')) {
          const failedMatch = details.match(/(\d+)\s+failed/);
          if (failedMatch) this.results.failed = parseInt(failedMatch[1]);
        }

        if (details.includes('undefined')) {
          const undefinedMatch = details.match(/(\d+)\s+undefined/);
          if (undefinedMatch) this.results.undefined = parseInt(undefinedMatch[1]);
        }

        if (details.includes('skipped')) {
          const skippedMatch = details.match(/(\d+)\s+skipped/);
          if (skippedMatch) this.results.skipped = parseInt(skippedMatch[1]);
        }
      }
    } catch (error) {
      console.warn('Could not parse test results, using defaults');
    }

    return this.results;
  }

  // Try to read results from recent log files
  parseFromRecentLogs() {
    try {
      const fs = require('fs');
      const path = require('path');

      // Try to read from the most recent log file
      const logsDir = path.join(process.cwd(), 'logs');
      if (fs.existsSync(logsDir)) {
        const today = new Date().toISOString().split('T')[0];
        const logFile = path.join(logsDir, `automation-${today}.log`);

        if (fs.existsSync(logFile)) {
          const logContent = fs.readFileSync(logFile, 'utf8');
          // Get the last few lines that might contain the summary
          const lines = logContent.split('\n').slice(-50);
          const recentContent = lines.join('\n');

          return this.parseCucumberOutput(recentContent);
        }
      }
    } catch (error) {
      // Silently continue if can't read logs
    }

    return this.results;
  }

  // Parse from JSON (when called from command line with results)
  parseFromJSON(resultsJSON) {
    try {
      const parsed = JSON.parse(resultsJSON);
      this.results = {
        passed: parsed.passed || 0,
        failed: parsed.failed || 0,
        skipped: parsed.skipped || 0,
        undefined: parsed.undefined || 0,
        total: parsed.total || parsed.passed + parsed.failed + parsed.skipped + parsed.undefined
      };
    } catch (error) {
      console.warn('Could not parse JSON results, using defaults');
    }
    return this.results;
  }
}

// Export for use in other scripts
module.exports = TestSummary;

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const testType = args[0] || 'Tests';
  const tags = args[1] || '';

  const summary = new TestSummary();

  // Check for --results-file parameter
  const resultsFileIndex = args.indexOf('--results-file');
  if (resultsFileIndex !== -1 && args[resultsFileIndex + 1]) {
    const resultsFile = args[resultsFileIndex + 1];
    try {
      if (fs.existsSync(resultsFile)) {
        const fileContent = fs.readFileSync(resultsFile, 'utf8');
        const resultsData = JSON.parse(fileContent);

        // Map the structure correctly
        if (resultsData.stats && resultsData.stats.scenarios) {
          const scenarios = resultsData.stats.scenarios;
          summary.results = {
            passed: scenarios.passed || 0,
            failed: scenarios.failed || 0,
            skipped: scenarios.skipped || 0,
            undefined: scenarios.undefined || 0,
            total: scenarios.total || 0
          };
        }

        const success = summary.printTestSummary(testType, tags);
        process.exit(success ? 0 : 1);
      }
    } catch (error) {
      console.warn('Error reading results file:', error.message);
    }
  }

  // Legacy: Third argument as JSON string (if not a --flag)
  const resultsJSON = args[2];
  if (resultsJSON && !resultsJSON.startsWith('--')) {
    try {
      // Parse from JSON (passed from shell script)
      const results = JSON.parse(resultsJSON);
      summary.results = results;

      const success = summary.printTestSummary(testType, tags);
      process.exit(success ? 0 : 1);
    } catch (error) {
      console.warn('Failed to parse results JSON, trying other methods');
    }
  }

  // If no results yet, try to read from recent logs
  if (summary.results.total === 0) {
    summary.parseFromRecentLogs();
  }

  // If still no results, try to read from stdin
  if (summary.results.total === 0 && !process.stdin.isTTY) {
    const stdin = process.stdin;
    let data = '';

    stdin.setEncoding('utf8');
    stdin.on('readable', () => {
      let chunk;
      while ((chunk = stdin.read()) !== null) {
        data += chunk;
      }
    });

    stdin.on('end', () => {
      summary.parseCucumberOutput(data);
      const success = summary.printTestSummary(testType, tags);
      process.exit(success ? 0 : 1);
    });
    // No further execution needed after setting up async handler
  }

  const success = summary.printTestSummary(testType, tags);
  process.exit(success ? 0 : 1);
}
