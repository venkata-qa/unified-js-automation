const fs = require('fs-extra');
const path = require('path');
const csv = require('csv-parse');
const yaml = require('js-yaml');
const logger = require('./logger');

class TestDataManager {
  constructor() {
    this.dataCache = new Map();
    this.environment = process.env.NODE_ENV || 'dev';
  }

  async loadTestData(fileName, dataType = 'json') {
    const cacheKey = `${fileName}_${dataType}_${this.environment}`;

    if (this.dataCache.has(cacheKey)) {
      logger.debug(`Loading cached test data: ${fileName}`);
      return this.dataCache.get(cacheKey);
    }

    const envDataPath = path.join(
      __dirname,
      '../../test-data',
      this.getDataDirectory(dataType),
      this.environment
    );
    const defaultDataPath = path.join(
      __dirname,
      '../../test-data',
      this.getDataDirectory(dataType),
      'default'
    );

    let filePath = path.join(envDataPath, fileName);

    // Fallback to default if environment-specific file doesn't exist
    if (!(await fs.pathExists(filePath))) {
      filePath = path.join(defaultDataPath, fileName);
    }

    if (!(await fs.pathExists(filePath))) {
      throw new Error(`Test data file not found: ${fileName} in ${dataType} directory`);
    }

    let data;
    try {
      switch (dataType.toLowerCase()) {
        case 'json':
          data = await fs.readJson(filePath);
          break;
        case 'yaml':
        case 'yml':
          const yamlContent = await fs.readFile(filePath, 'utf8');
          data = yaml.load(yamlContent);
          break;
        case 'csv':
          data = await this.parseCsvFile(filePath);
          break;
        case 'txt':
          data = await fs.readFile(filePath, 'utf8');
          break;
        default:
          throw new Error(`Unsupported data type: ${dataType}`);
      }

      this.dataCache.set(cacheKey, data);
      logger.info(`Test data loaded successfully: ${fileName}`);
      return data;
    } catch (error) {
      logger.error(`Failed to load test data from ${filePath}: ${error.message}`);
      throw error;
    }
  }

  async parseCsvFile(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv({ columns: true, skip_empty_lines: true }))
        .on('data', data => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }

  getDataDirectory(dataType) {
    const directories = {
      json: 'apidata',
      yaml: 'uidata',
      yml: 'uidata',
      csv: 'csvdata',
      txt: 'textdata',
      sql: 'backenddata',
      excel: 'exceldata'
    };
    return directories[dataType.toLowerCase()] || 'miscdata';
  }

  async generateTestData(template, count = 1) {
    const faker = require('faker');
    const generatedData = [];

    for (let i = 0; i < count; i++) {
      const data = {};
      for (const [key, generator] of Object.entries(template)) {
        if (typeof generator === 'function') {
          data[key] = generator();
        } else if (typeof generator === 'string' && generator.includes('faker.')) {
          // Evaluate faker expressions
          data[key] = eval(generator);
        } else {
          data[key] = generator;
        }
      }
      generatedData.push(data);
    }

    logger.info(`Generated ${count} test data records`);
    return count === 1 ? generatedData[0] : generatedData;
  }

  async saveTestData(fileName, data, dataType = 'json') {
    const dataDir = path.join(
      __dirname,
      '../../test-data',
      this.getDataDirectory(dataType),
      this.environment
    );
    await fs.ensureDir(dataDir);

    const filePath = path.join(dataDir, fileName);

    try {
      switch (dataType.toLowerCase()) {
        case 'json':
          await fs.writeJson(filePath, data, { spaces: 2 });
          break;
        case 'yaml':
        case 'yml':
          const yamlContent = yaml.dump(data);
          await fs.writeFile(filePath, yamlContent, 'utf8');
          break;
        case 'csv':
          await this.writeCsvFile(filePath, data);
          break;
        case 'txt':
          await fs.writeFile(filePath, data, 'utf8');
          break;
        default:
          throw new Error(`Unsupported data type: ${dataType}`);
      }

      logger.info(`Test data saved successfully: ${fileName}`);
    } catch (error) {
      logger.error(`Failed to save test data to ${filePath}: ${error.message}`);
      throw error;
    }
  }

  async writeCsvFile(filePath, data) {
    const stringify = require('csv-stringify/sync');
    const csvContent = stringify(data, { header: true });
    await fs.writeFile(filePath, csvContent, 'utf8');
  }

  clearCache() {
    this.dataCache.clear();
    logger.debug('Test data cache cleared');
  }

  // Utility methods for data manipulation
  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  generateUniqueId(prefix = 'test') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  sanitizeData(data, fields = []) {
    const sanitized = { ...data };
    fields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***SANITIZED***';
      }
    });
    return sanitized;
  }

  validateDataStructure(data, schema) {
    const Ajv = require('ajv');
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid) {
      logger.error('Data validation failed:', validate.errors);
      throw new Error(`Data validation failed: ${JSON.stringify(validate.errors)}`);
    }

    return true;
  }
}

module.exports = { TestDataManager };
