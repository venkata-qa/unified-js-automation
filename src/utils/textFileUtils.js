const path = require('path');
const fs = require('fs');
const { normalizeRow } = require('./Normalizer');
const logger = require('./logger');

const env = process.env.NODE_ENV || 'dev';
const basePath = path.join(__dirname, `../../test-data/backenddata/${env.toUpperCase()}`);

function readFileData(fileName) {
  try {
    const filePath = path.join(basePath, fileName);
    logger.info(`Reading all data from file: ${filePath}`);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return rawData
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => line.split(',').map(val => val.trim()));
  } catch (err) {
    logger.error(`Failed to read file data for ${fileName}: ${err.message}`);
    throw err;
  }
}

function getSpecificColData(fileName, columnIndex) {
  try {
    const filePath = path.join(basePath, fileName);
    logger.info(`Reading column index ${columnIndex} from file: ${filePath}`);
    const lines = fs.readFileSync(filePath, 'utf-8')
      .split('\n')
      .filter(line => line.trim() !== '');

    return lines.map(line => {
      const cols = line.split(',');
      return cols[columnIndex]?.trim();
    }).filter(val => val !== undefined);
  } catch (err) {
    logger.error(`Failed to read specific column data from ${fileName}: ${err.message}`);
    throw err;
  }
}

function getFileRecordCount(fileName) {
  try {
    const filePath = path.join(basePath, fileName);
    logger.info(`Counting records in file: ${filePath}`);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const count = rawData.split('\n').filter(line => line.trim() !== '').length;
    logger.info(`Total records in ${fileName}: ${count}`);
    return count;
  } catch (err) {
    logger.error(`Failed to count records in ${fileName}: ${err.message}`);
    throw err;
  }
}

function readFileRecords(fileName) {
  try {
    const filePath = path.join(basePath, fileName);
    logger.info(`Reading and normalizing data from file: ${filePath}`);
    return fs.readFileSync(filePath, 'utf-8')
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const rowArr = line.split(',').map(val => val.trim());
        return normalizeRow(rowArr);
      });
  } catch (err) {
    logger.error(`Failed to read and normalize records from ${fileName}: ${err.message}`);
    throw err;
  }
}

function getColumnNamesFromFile(fileName) {
  try {
    const filePath = path.join(basePath, fileName);
    logger.info(`Reading column headers from file: ${filePath}`);
    const firstLine = fs.readFileSync(filePath, 'utf-8').split('\n')[0];
    return firstLine.split(',').map(col => col.trim().toLowerCase());
  } catch (err) {
    logger.error(`Failed to read column names from ${fileName}: ${err.message}`);
    throw err;
  }
}

module.exports = {
  readFileData,
  getSpecificColData,
  getFileRecordCount,
  readFileRecords,
  getColumnNamesFromFile
};
