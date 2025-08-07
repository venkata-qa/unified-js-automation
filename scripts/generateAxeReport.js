const fs = require('fs');
const path = require('path');
const { createHtmlReport } = require('axe-html-reporter');

const reportsDir = path.join('reports/axe-reports/json_reports'); // Directory where JSON reports are saved
const outputDir = path.join('reports/axe-reports/html_reports'); // Directory for generated HTML reports

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Get all JSON files from the reports directory
const jsonFiles = fs.readdirSync(reportsDir).filter(file => file.endsWith('.json'));

if (jsonFiles.length === 0) {
  console.log('⚠️ No accessibility reports found in reports directory.');
  process.exit(1);
}

jsonFiles.forEach(jsonFile => {
  const jsonPath = path.join(reportsDir, jsonFile);

  try {
    const results = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // Generate HTML report
    const reportFileName = jsonFile.replace('.json', '.html');
    createHtmlReport({
      results,
      options: {
        outputDir: outputDir, // Ensure correct output directory
        reportFileName: reportFileName,
        title: `Accessibility Report - ${jsonFile}`
      }
    });

    console.log(`Report generated: ${path.join(outputDir, reportFileName)}`);
  } catch (error) {
    console.error(`Error generating report for ${jsonFile}:`, error.message);
  }
});
