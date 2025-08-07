#!/usr/bin/env node

/**
 * Framework Setup Validation Script
 * Run this to validate your enhanced framework setup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Validating Enhanced Playwright Framework Setup...\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function checkPassed(message) {
  console.log(`✅ ${message}`);
  checks.passed++;
}

function checkFailed(message) {
  console.log(`❌ ${message}`);
  checks.failed++;
}

function checkWarning(message) {
  console.log(`⚠️  ${message}`);
  checks.warnings++;
}

// 1. Check Configuration Files
console.log('📁 Checking Configuration Files:');
const configFiles = [
  '.eslintrc.js',
  '.prettierrc',
  '.editorconfig',
  '.env.example',
  'Dockerfile',
  'docker-compose.yml'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    checkPassed(`${file} exists`);
  } else {
    checkFailed(`${file} is missing`);
  }
});

// 2. Check New Utility Files
console.log('\n🛠️  Checking New Utility Files:');
const utilityFiles = [
  'src/config/globalConfig.js',
  'src/utils/TestDataManager.js',
  'src/utils/ErrorHandler.js'
];

utilityFiles.forEach(file => {
  if (fs.existsSync(file)) {
    checkPassed(`${file} exists`);
  } else {
    checkFailed(`${file} is missing`);
  }
});

// 3. Check Script Files
console.log('\n📜 Checking Script Files:');
const scriptFiles = [
  'scripts/performanceTests.js',
  'scripts/healthCheck.js',
  'scripts/validate-commit-msg.js'
];

scriptFiles.forEach(file => {
  if (fs.existsSync(file)) {
    checkPassed(`${file} exists`);
    // Check if executable
    try {
      fs.accessSync(file, fs.constants.F_OK);
      const stats = fs.statSync(file);
      if (stats.mode & parseInt('111', 8)) {
        checkPassed(`${file} is executable`);
      } else {
        checkWarning(`${file} may need execute permissions`);
      }
    } catch (err) {
      checkWarning(`Cannot check permissions for ${file}`);
    }
  } else {
    checkFailed(`${file} is missing`);
  }
});

// 4. Check Dependencies
console.log('\n📦 Checking Dependencies:');
const requiredDeps = ['eslint', 'prettier', 'husky', 'faker', 'lighthouse', 'dotenv'];

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const allDeps = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {})
  };

  requiredDeps.forEach(dep => {
    if (allDeps[dep]) {
      checkPassed(`${dep} v${allDeps[dep]} installed`);
    } else {
      checkFailed(`${dep} is not installed`);
    }
  });

  // Check for additional recommended dependencies
  const recommendedDeps = ['lint-staged', 'web-vitals', 'csv-stringify'];
  recommendedDeps.forEach(dep => {
    if (allDeps[dep]) {
      checkPassed(`${dep} installed`);
    } else {
      checkWarning(`${dep} recommended but not installed`);
    }
  });
} catch (error) {
  checkFailed('Cannot read package.json');
}

// 5. Check Environment Setup
console.log('\n🌍 Checking Environment Setup:');
if (fs.existsSync('.env')) {
  checkPassed('.env file exists');
} else {
  checkWarning('.env file not found (copy from .env.example)');
}

// 6. Test Module Loading
console.log('\n🧪 Testing Module Loading:');
const modulesToTest = [
  './src/config/globalConfig',
  './src/utils/TestDataManager',
  './src/utils/ErrorHandler'
];

modulesToTest.forEach(modulePath => {
  try {
    require(path.resolve(modulePath));
    checkPassed(`${modulePath} loads successfully`);
  } catch (error) {
    checkFailed(`${modulePath} failed to load: ${error.message}`);
  }
});

// 7. Check Git Setup
console.log('\n🐙 Checking Git Setup:');
if (fs.existsSync('.husky')) {
  checkPassed('Husky hooks directory exists');

  if (fs.existsSync('.husky/pre-commit')) {
    checkPassed('Pre-commit hook configured');
  } else {
    checkWarning('Pre-commit hook not configured');
  }

  if (fs.existsSync('.husky/commit-msg')) {
    checkPassed('Commit message hook configured');
  } else {
    checkWarning('Commit message hook not configured');
  }
} else {
  checkWarning('Husky not initialized (run: npx husky install)');
}

// 8. Check CI/CD Files
console.log('\n🔄 Checking CI/CD Files:');
if (fs.existsSync('.github/workflows/test-pipeline.yml')) {
  checkPassed('GitHub Actions workflow exists');
} else {
  checkWarning('GitHub Actions workflow not found');
}

// Summary
console.log('\n📊 VALIDATION SUMMARY:');
console.log(`✅ Passed: ${checks.passed}`);
console.log(`⚠️  Warnings: ${checks.warnings}`);
console.log(`❌ Failed: ${checks.failed}`);

if (checks.failed > 0) {
  console.log('\n🚨 CRITICAL ISSUES FOUND:');
  console.log('Please fix the failed checks before proceeding.');
  console.log('Refer to the QUICK_START_GUIDE.md for solutions.');
  process.exit(1);
} else if (checks.warnings > 0) {
  console.log('\n⚠️  WARNINGS FOUND:');
  console.log('Your setup is functional but some optimizations are recommended.');
  console.log('See IMPLEMENTATION_ROADMAP.md for next steps.');
} else {
  console.log('\n🎉 SETUP VALIDATION COMPLETE!');
  console.log('Your enhanced framework is ready to use.');
}

// Next Steps Recommendations
console.log('\n🚀 IMMEDIATE NEXT STEPS:');

if (checks.warnings > 0 || checks.failed > 0) {
  console.log('1. Fix any failed checks above');
  console.log('2. Install missing dependencies:');
  console.log('   npm install --save-dev lint-staged web-vitals');
  console.log('   npm install --save csv-stringify');
  console.log('3. Initialize git hooks:');
  console.log('   npx husky install');
  console.log('   npx husky add .husky/pre-commit "npx lint-staged"');
  console.log('4. Setup environment: cp .env.example .env');
}

console.log('5. Test the framework:');
console.log('   npm run lint');
console.log('   npm run health:check');
console.log('   npm run test:performance');
console.log('6. Review IMPLEMENTATION_ROADMAP.md for detailed guidance');

console.log('\n✨ Happy testing with your enhanced framework!');
