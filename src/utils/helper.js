const { TestDataUtils } = require('./TestDataUtils');
const path = require('path');
const testDataUtils = new TestDataUtils();
const xlsx = require('xlsx');
const fs = require('fs');
const logger = require('./logger');
const { BrowserUtils } = require('./BrowserUtils');
const browserUtils = new BrowserUtils();

let excelData = null;

class Helper {
  async getNavigatePageObjectPath(pathKey) {
    let url = '';
    try {
      const data = await testDataUtils.getData(pathKey);
      url = String(data);
      logger.info(`Navigation URL fetched: ${url}`);
    } catch (err) {
      logger.error(`Invalid navigation path for key "${pathKey}": ${err.message}`);
    }
    return url;
  }

  async getWebElement(elementName, pageName) {
    try {
      const pageClassPath = await this.getPageClasspath(pageName);
      const pageModule = require(pageClassPath);
      const PageClass = pageModule[pageName];

      if (!PageClass || typeof PageClass !== 'function') {
        throw new Error(`Class '${pageName}' not found in module ${pageClassPath}`);
      }

      const pageObject = new PageClass(global.page);
      const element = pageObject[elementName];

      if (!element || typeof element.click !== 'function') {
        throw new Error(`Element '${elementName}' not found or not clickable in ${pageName}`);
      }

      logger.info(`WebElement '${elementName}' retrieved from page: ${pageName}`);
      await browserUtils.highlightElement(global.page, element);
      return element;
    } catch (err) {
      logger.error(
        `Error getting web element '${elementName}' from page '${pageName}': ${err.message}`
      );
      throw err;
    }
  }

  async getWebElements(elementName, pageName) {
    try {
      const pageClassPath = await this.getPageClasspath(pageName);
      const pageModule = require(pageClassPath);
      const PageClass = pageModule[pageName];

      if (!PageClass || typeof PageClass !== 'function') {
        throw new Error(`Class '${pageName}' not found in module ${pageClassPath}`);
      }

      const pageObject = new PageClass(global.page);
      const elements = await pageObject[elementName];

      if (!elements || !Array.isArray(elements)) {
        throw new Error(`Elements '${elementName}' not found or not an array in ${pageName}`);
      }

      logger.info(`WebElements '${elementName}' retrieved from page: ${pageName}`);
      return elements;
    } catch (err) {
      logger.error(
        `Error getting web elements '${elementName}' from page '${pageName}': ${err.message}`
      );
      throw err;
    }
  }

  async getPageClasspath(pageName) {
    try {
      const basePath = path.resolve(__dirname, '../page-objects');
      const pageClassPath = path.join(basePath, `${pageName}.js`);
      logger.debug(`Resolved page class path: ${pageClassPath}`);
      return pageClassPath;
    } catch (error) {
      logger.error(`Error constructing page class path for '${pageName}': ${error.message}`);
      throw error;
    }
  }

  async getHost(hostName) {
    let host = '';
    try {
      const data = await testDataUtils.getData(hostName, 'api');
      host = String(data);
      logger.info(`Host fetched for key '${hostName}': ${host}`);
    } catch (err) {
      logger.error(`Invalid host path for key "${hostName}": ${err.message}`);
    }
    return host;
  }

  async getExcelWorkbook(excelFileData) {
    try {
      const projectWorkingDirectory = process.cwd();
      const fileDataPath = path.join(
        projectWorkingDirectory,
        'src',
        'test',
        'resources',
        'excel_data'
      );
      const parts = excelFileData.split(':');
      const excelFileName = parts[0];
      const filePath = path.join(fileDataPath, `${excelFileName}.xlsx`);
      logger.info(`Reading Excel workbook from: ${filePath}`);
      const workbook = xlsx.readFile(filePath);
      return workbook;
    } catch (err) {
      logger.error(`Error reading Excel file '${excelFileData}': ${err.message}`);
      throw err;
    }
  }

  async saveBrowserInfo(browser) {
    try {
      const browserName = browser._name || 'unknown';
      const version = browser.version();

      const data = {
        name: browserName,
        version: version
      };

      fs.writeFileSync('reports/browser-info.json', JSON.stringify(data, null, 2));
      logger.info(`Browser info saved: ${JSON.stringify(data)}`);
    } catch (err) {
      logger.error(`Failed to save browser info: ${err.message}`);
    }
  }

  async compareJSONObjects(obj1, obj2) {
    const result = JSON.stringify(obj1) === JSON.stringify(obj2);
    logger.debug(`Comparing JSON objects - Match: ${result}`);
    return result;
  }
  async compareJSONObjects(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  async readExcelFile(filePath) {
    try {
      logger.info(`Reading Excel file: ${filePath}`);
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);
      excelData = jsonData;
      logger.info(`Excel data successfully parsed from: ${filePath}`);
    } catch (err) {
      logger.error(`Error reading Excel file at ${filePath}: ${err.message}`);
      throw err;
    }
  }

  async getExcelData() {
    try {
      logger.debug('Returning previously parsed Excel data');
      return excelData;
    } catch (err) {
      logger.error(`Error retrieving stored Excel data: ${err.message}`);
    }
  }
  async readExcelFile(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    excelData = jsonData;
  }

  async getExcelData() {
    try {
      return excelData;
    } catch {
      console.lof('Getting error');
    }
  }

  async getSelector(elementName, pageName) {
    const pageClassPath = await this.getPageClasspath(pageName);
    const pageModule = require(pageClassPath);
    const PageClass = pageModule[pageName]; // Access by dynamic key
    const pageObject = new PageClass(global.page);
    const element = pageObject[elementName];
    return element;
  }
}

module.exports = { Helper };
