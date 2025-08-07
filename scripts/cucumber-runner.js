#!/usr/bin/env node

/**
 * Cucumber Test Runner with Summary
 * Executes cucumber commands and displays formatted summary
 */

const { spawn } = require('child_process');
const TestSummary = require('./test-summary');

function runCucumberWithSummary(command, args, testType, tags) {
  const summary = new TestSummary();
  let output = '';
  let exitCode = 0;

  console.log(`\nStarting ${testType} execution...`);
  console.log(`Command: ${command} ${args.join(' ')}`);
  console.log(`Tags: ${tags || 'No specific tags'}\n`);

  return new Promise(resolve => {
    const child = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      env: { ...process.env, FORCE_COLOR: '1' }
    });

    child.stdout.on('data', data => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
    });

    child.stderr.on('data', data => {
      const text = data.toString();
      output += text;
      process.stderr.write(text);
    });

    child.on('error', error => {
      console.error(`Error executing command: ${error.message}`);
      exitCode = 1;
    });

    child.on('close', code => {
      exitCode = code || 0;

      // Parse results from captured output
      summary.parseCucumberOutput(output);

      // Display formatted summary
      const success = summary.printTestSummary(testType, tags);

      // Show environment details
      console.log('\nTest Environment Details:');
      if (process.env.BROWSER) console.log(`Browser: ${process.env.BROWSER}`);
      if (process.env.CLOUD_PROVIDER)
        console.log(`Cloud Provider: ${process.env.CLOUD_PROVIDER}`);
      if (process.env.NODE_ENV) console.log(`   🔧 Environment: ${process.env.NODE_ENV}`);
      if (process.env.PARALLEL_THREAD)
        console.log(`Parallel Threads: ${process.env.PARALLEL_THREAD}`);

      resolve({ success: success && exitCode === 0, exitCode });
    });
  });
}

// CLI usage
if (require.main === module) {
  const testType = process.argv[2] || 'Tests';
  const tags = process.argv[3] || '';
  const command = process.argv[4] || 'npx';
  const args = process.argv.slice(5);

  if (args.length === 0) {
    console.error('Usage: node cucumber-runner.js "TestType" "Tags" command [args...]');
    console.error(
      'Example: node cucumber-runner.js "API Tests" "@api" npx cucumber-js --tags "@api"'
    );
    process.exit(1);
  }

  runCucumberWithSummary(command, args, testType, tags).then(({ success, exitCode }) => {
    process.exit(exitCode);
  });
}

module.exports = { runCucumberWithSummary };
