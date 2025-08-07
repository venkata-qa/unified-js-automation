const http = require('http');
const path = require('path');

let logger;
try {
  logger = require('../src/utils/logger');
} catch (error) {
  // Fallback logger if main logger fails
  logger = {
    info: console.log,
    error: console.error,
    warn: console.warn
  };
}

const healthCheck = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  uptime: Math.round(process.uptime()),
  environment: process.env.NODE_ENV || 'development',
  version: require('../package.json').version,
  node_version: process.version,
  dependencies: {},
  warnings: [],
  errors: []
};

async function checkDependencies() {
  // Reset status for fresh check
  healthCheck.status = 'healthy';
  healthCheck.dependencies = {};
  healthCheck.warnings = [];
  healthCheck.errors = [];
  healthCheck.timestamp = new Date().toISOString();

  // Check Playwright - Essential for testing framework
  await checkPlaywright();

  // Check filesystem access - Essential
  await checkFilesystem();

  // Check environment-specific dependencies
  if (shouldCheckDatabase()) {
    await checkDatabase();
  }

  // Check optional dependencies
  await checkOptionalDependencies();

  // Set final status
  if (healthCheck.errors.length > 0) {
    healthCheck.status = 'unhealthy';
  } else if (healthCheck.warnings.length > 0) {
    healthCheck.status = 'degraded';
  }
}

async function checkPlaywright() {
  try {
    const { chromium } = require('playwright');
    const browser = await chromium.launch({ headless: true });
    await browser.close();
    healthCheck.dependencies.playwright = {
      status: 'OK',
      message: 'Playwright browsers available'
    };
  } catch (error) {
    const errorMsg = `Playwright not available: ${error.message}`;
    healthCheck.dependencies.playwright = {
      status: 'ERROR',
      message: errorMsg
    };
    healthCheck.errors.push(errorMsg);
  }
}

async function checkDatabase() {
  try {
    const { dbConfig } = require('../src/utils/dbUtils');
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(dbConfig);
    await connection.ping();
    await connection.end();
    healthCheck.dependencies.database = {
      status: 'OK',
      message: 'Database connection successful'
    };
  } catch (error) {
    const warningMsg = `Database connection failed: ${error.message}`;
    healthCheck.dependencies.database = {
      status: 'WARNING',
      message: warningMsg
    };
    healthCheck.warnings.push(warningMsg);
  }
}

async function checkFilesystem() {
  try {
    const fs = require('fs-extra');
    const requiredDirs = ['./reports', './logs', './test-data'];

    for (const dir of requiredDirs) {
      await fs.ensureDir(dir);
    }

    // Test write permissions
    const testFile = './logs/.health-check-test';
    await fs.writeFile(testFile, 'test');
    await fs.remove(testFile);

    healthCheck.dependencies.filesystem = {
      status: 'OK',
      message: 'All required directories accessible'
    };
  } catch (error) {
    const errorMsg = `Filesystem access failed: ${error.message}`;
    healthCheck.dependencies.filesystem = {
      status: 'ERROR',
      message: errorMsg
    };
    healthCheck.errors.push(errorMsg);
  }
}

async function checkOptionalDependencies() {
  // Check if environment configuration is available
  try {
    require('../src/utils/UrlManager');
    healthCheck.dependencies.environment_config = {
      status: 'OK',
      message: 'Environment configuration loaded'
    };
  } catch (error) {
    const warningMsg = `Environment config warning: ${error.message}`;
    healthCheck.dependencies.environment_config = {
      status: 'WARNING',
      message: warningMsg
    };
    healthCheck.warnings.push(warningMsg);
  }

  // Check if error handler is available
  try {
    require('../src/utils/ErrorHandler');
    healthCheck.dependencies.error_handler = {
      status: 'OK',
      message: 'Error handling system available'
    };
  } catch (error) {
    const warningMsg = `Error handler not available: ${error.message}`;
    healthCheck.dependencies.error_handler = {
      status: 'WARNING',
      message: warningMsg
    };
    healthCheck.warnings.push(warningMsg);
  }
}

function shouldCheckDatabase() {
  // Only check database in environments where it's expected
  const env = process.env.NODE_ENV || 'development';
  const checkDbEnvs = ['test', 'staging', 'production'];

  // Also check if database tests are being run
  const isDbTest =
    process.env.RUN_DB_TESTS === 'true' ||
    process.argv.includes('--db') ||
    process.argv.includes('database');

  return checkDbEnvs.includes(env) || isDbTest;
}

function formatHealthCheckOutput() {
  const statusEmoji = {
    healthy: '✅',
    degraded: '⚠️',
    unhealthy: '❌'
  };

  console.log(`\n${statusEmoji[healthCheck.status]} HEALTH CHECK REPORT`);
  console.log('='.repeat(50));
  console.log(`📊 Status: ${healthCheck.status.toUpperCase()}`);
  console.log(`🕐 Timestamp: ${healthCheck.timestamp}`);
  console.log(`⏱️  Uptime: ${healthCheck.uptime}s`);
  console.log(`🌍 Environment: ${healthCheck.environment}`);
  console.log(`📦 Version: ${healthCheck.version}`);
  console.log(`🟢 Node.js: ${healthCheck.node_version}`);

  console.log('\n🔧 DEPENDENCIES');
  console.log('-'.repeat(30));

  Object.entries(healthCheck.dependencies).forEach(([name, info]) => {
    const emoji = info.status === 'OK' ? '✅' : info.status === 'WARNING' ? '⚠️' : '❌';
    console.log(`${emoji} ${name}: ${info.message}`);
  });

  if (healthCheck.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS');
    console.log('-'.repeat(30));
    healthCheck.warnings.forEach(warning => console.log(`⚠️  ${warning}`));
  }

  if (healthCheck.errors.length > 0) {
    console.log('\n❌ ERRORS');
    console.log('-'.repeat(30));
    healthCheck.errors.forEach(error => console.log(`❌ ${error}`));
  }

  console.log('\n' + '='.repeat(50));
}

// Create health check endpoint server
const server = http.createServer(async (req, res) => {
  if (req.url === '/health') {
    await checkDependencies();

    const statusCode =
      healthCheck.status === 'healthy' ? 200 : healthCheck.status === 'degraded' ? 200 : 503;

    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    res.end(
      JSON.stringify(
        {
          ...healthCheck,
          uptime: `${healthCheck.uptime}s`
        },
        null,
        2
      )
    );
  } else if (req.url === '/health/simple') {
    await checkDependencies();
    res.writeHead(healthCheck.status === 'healthy' ? 200 : 503, {
      'Content-Type': 'text/plain'
    });
    res.end(healthCheck.status);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({ error: 'Not Found', available_endpoints: ['/health', '/health/simple'] })
    );
  }
});

if (require.main === module) {
  // Command line health check with improved formatting
  checkDependencies()
    .then(() => {
      if (process.argv.includes('--json')) {
        console.log(JSON.stringify(healthCheck, null, 2));
      } else {
        formatHealthCheckOutput();
      }
      process.exit(
        healthCheck.status === 'healthy' ? 0 : healthCheck.status === 'degraded' ? 0 : 1
      );
    })
    .catch(error => {
      console.error('❌ Health check failed:', error.message);
      process.exit(1);
    });
} else {
  // Start health check server
  const port = process.env.HEALTH_CHECK_PORT || 3000;
  server.listen(port, () => {
    logger.info(`🏥 Health check server running on http://localhost:${port}/health`);
    logger.info(`📊 Simple endpoint available at http://localhost:${port}/health/simple`);
  });
}

module.exports = { healthCheck, server, checkDependencies };
