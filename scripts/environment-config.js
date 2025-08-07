#!/usr/bin/env node

/**
 * Environment-aware Test Runner
 * Automatically detects and sets appropriate environment for tests
 */

const { spawn } = require('child_process');

// Default environment configurations
const environmentDefaults = {
  development: {
    NODE_ENV: 'development',
    HEADLESS: 'false',
    RECORD_VIDEO: 'true',
    PARALLEL_THREAD: '1',
    TIMEOUT_DURATION: '30000'
  },
  test: {
    NODE_ENV: 'test',
    HEADLESS: 'true',
    RECORD_VIDEO: 'false',
    PARALLEL_THREAD: '2',
    TIMEOUT_DURATION: '15000'
  },
  staging: {
    NODE_ENV: 'staging',
    HEADLESS: 'true',
    RECORD_VIDEO: 'false',
    PARALLEL_THREAD: '1',
    TIMEOUT_DURATION: '45000'
  },
  production: {
    NODE_ENV: 'production',
    HEADLESS: 'true',
    RECORD_VIDEO: 'false',
    PARALLEL_THREAD: '1',
    TIMEOUT_DURATION: '60000'
  }
};

function detectEnvironment() {
  // Check for explicit environment setting
  if (process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }

  // Check for CI/CD environment
  if (process.env.CI === 'true' || process.env.GITHUB_ACTIONS || process.env.JENKINS_URL) {
    return 'test';
  }

  // Check for common staging indicators
  if (process.env.ENVIRONMENT === 'staging' || process.env.STAGE === 'staging') {
    return 'staging';
  }

  // Check for production indicators
  if (process.env.ENVIRONMENT === 'production' || process.env.NODE_ENV === 'prod') {
    return 'production';
  }

  // Default to development
  return 'development';
}

function getEnvironmentConfig(targetEnv = null) {
  const env = targetEnv || detectEnvironment();
  const config = environmentDefaults[env] || environmentDefaults.development;

  // Merge with existing environment variables (existing takes precedence)
  const finalConfig = { ...config };
  Object.keys(config).forEach(key => {
    if (process.env[key]) {
      finalConfig[key] = process.env[key];
    }
  });

  return { environment: env, config: finalConfig };
}

function runWithEnvironment(command, targetEnv = null) {
  const { environment, config } = getEnvironmentConfig(targetEnv);

  console.log(`🌍 Running in ${environment.toUpperCase()} environment`);
  console.log(`⚙️  Configuration: ${JSON.stringify(config, null, 2)}\n`);

  const [cmd, ...args] = command.split(' ');
  const child = spawn(cmd, args, {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ...config }
  });

  child.on('close', code => {
    process.exit(code);
  });

  child.on('error', error => {
    console.error(`❌ Error executing command: ${error.message}`);
    process.exit(1);
  });
}

// If run directly, show environment info
if (require.main === module) {
  const targetEnv = process.argv[2];
  const { environment, config } = getEnvironmentConfig(targetEnv);

  console.log('ENVIRONMENT CONFIGURATION');
  console.log('='.repeat(40));
  console.log(`Current Environment: ${environment.toUpperCase()}`);
  console.log('Configuration:');
  Object.entries(config).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
  console.log('\nAvailable Environments: development, test, staging, production');
  console.log('Usage: NODE_ENV=staging npm run test:api');
}

module.exports = {
  detectEnvironment,
  getEnvironmentConfig,
  runWithEnvironment,
  environmentDefaults
};
