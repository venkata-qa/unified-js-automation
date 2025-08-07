const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const allureConfig = require('../allure.config.js');

class AllureReportGenerator {
  constructor() {
    this.resultsDir = allureConfig.resultsDir;
    this.reportDir = allureConfig.reportDir;
    this.config = allureConfig;
  }

  // Clean previous results
  cleanResults() {
    console.log('🧹 Cleaning previous Allure results...');

    // Clean organized results directory
    if (fs.existsSync(this.resultsDir)) {
      fs.rmSync(this.resultsDir, { recursive: true, force: true });
    }
    if (fs.existsSync(this.reportDir)) {
      fs.rmSync(this.reportDir, { recursive: true, force: true });
    }

    // Also clean root allure-results if it exists
    const rootResultsDir = 'allure-results';
    if (fs.existsSync(rootResultsDir)) {
      fs.rmSync(rootResultsDir, { recursive: true, force: true });
    }

    fs.mkdirSync(this.resultsDir, { recursive: true });
  }

  // Generate environment properties file
  generateEnvironmentFile() {
    console.log('Generating environment properties...');
    const envFilePath = path.join(this.resultsDir, 'environment.properties');
    const envContent = Object.entries(this.config.environment)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync(envFilePath, envContent);
  }

  // Generate categories.json for test classification
  generateCategoriesFile() {
    console.log('Generating test categories...');
    const categoriesFilePath = path.join(this.resultsDir, 'categories.json');
    fs.writeFileSync(categoriesFilePath, JSON.stringify(this.config.categories, null, 2));
  }

  // Generate Allure report
  generateReport() {
    try {
      console.log('Generating Allure report...');

      // Check if results exist in root directory and move them
      const rootResultsDir = 'allure-results';
      if (fs.existsSync(rootResultsDir) && fs.readdirSync(rootResultsDir).length > 0) {
        console.log('Moving results from root directory to organized structure...');
        if (!fs.existsSync(this.resultsDir)) {
          fs.mkdirSync(this.resultsDir, { recursive: true });
        }

        // Move all files from root allure-results to organized location
        const files = fs.readdirSync(rootResultsDir);
        files.forEach(file => {
          const src = path.join(rootResultsDir, file);
          const dest = path.join(this.resultsDir, file);
          fs.renameSync(src, dest);
        });

        // Remove empty root directory
        fs.rmSync(rootResultsDir, { recursive: true, force: true });
      }

      execSync(`allure generate ${this.resultsDir} --clean -o ${this.reportDir}`, {
        stdio: 'inherit'
      });
      console.log('Allure report generated successfully!');
      console.log(`Report location: ${path.resolve(this.reportDir)}`);
    } catch (error) {
      console.error('Error generating Allure report:', error.message);
      throw error;
    }
  }

  // Open Allure report in browser
  openReport() {
    try {
      console.log('Opening Allure report in browser...');
      execSync(`allure open ${this.reportDir}`, { stdio: 'inherit' });
    } catch (error) {
      console.error('Error opening Allure report:', error.message);
      console.log(`💡 You can manually open: ${path.resolve(this.reportDir, 'index.html')}`);
    }
  }

  // Serve Allure report on local server
  serveReport(port = 4040) {
    try {
      console.log(`Starting Allure report server on port ${port}...`);
      execSync(`allure serve ${this.resultsDir} -p ${port}`, { stdio: 'inherit' });
    } catch (error) {
      console.error('Error serving Allure report:', error.message);
      throw error;
    }
  }

  // Check if allure command is available
  checkAllureInstallation() {
    try {
      execSync('allure --version', { stdio: 'pipe' });
      return true;
    } catch (error) {
      console.error('Allure CLI not found!');
      console.log('Install Allure CLI:');
      console.log('   npm install -g allure-commandline');
      console.log('   or');
      console.log('   brew install allure (on macOS)');
      return false;
    }
  }

  // Full report generation process
  async generateFullReport() {
    if (!this.checkAllureInstallation()) {
      throw new Error('Allure CLI not installed');
    }

    console.log('Starting Allure report generation process...');

    // Only clean if no results exist yet
    if (!fs.existsSync(path.join(this.resultsDir, 'environment.properties'))) {
      this.generateEnvironmentFile();
      this.generateCategoriesFile();
    }

    this.generateReport();

    console.log('Allure report generation completed!');
    console.log('Report features:');
    console.log('   ✓ Test execution overview');
    console.log('   ✓ Test categories and trends');
    console.log('   ✓ Detailed test steps');
    console.log('   ✓ Screenshots and attachments');
    console.log('   ✓ Environment information');
    console.log('   ✓ Historical trends');

    return path.resolve(this.reportDir);
  }
}

// CLI usage
if (require.main === module) {
  const generator = new AllureReportGenerator();
  const command = process.argv[2];

  switch (command) {
  case 'clean':
    generator.cleanResults();
    break;
  case 'generate':
    generator.generateFullReport().catch(console.error);
    break;
  case 'open':
    generator.openReport();
    break;
  case 'serve':
    const port = process.argv[3] || 4040;
    generator.serveReport(port);
    break;
  default:
    generator.generateFullReport().catch(console.error);
  }
}

module.exports = AllureReportGenerator;
