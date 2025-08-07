const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const logger = require('./logger');

const env = process.env.NODE_ENV || 'dev';
const basePath = path.resolve(__dirname, `../../test-data/backenddata/${env.toUpperCase()}`);

function readFileRecords(fileName) {
  const filePath = path.join(basePath, fileName);
  logger.info(`Reading records from file: ${filePath}`);
  const lines = fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .filter(line => line.trim() !== '');

  const records = lines.map(line => {
    const rowArr = line.split(',').map(val => val.trim());
    return normalizeRow(rowArr);
  });

  logger.debug(`Total records read from CSV (normalized): ${records.length}`);
  return records;
}

function readCSVWithHeader(fileName) {
  const filePath = path.join(basePath, fileName);
  logger.info(`Reading CSV with header: ${filePath}`);
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const parsed = rawData
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => line.split(',').map(val => val.trim()));

  logger.debug(`Header: ${parsed[0]}`);
  return parsed;
}

// Used for full record match (Scenario 1)
async function readCSVWithoutHeader(fileName) {
  const filePath = path.join(basePath, fileName);
  logger.info(`Reading CSV without header: ${filePath}`);

  const fileContent = await fs.promises.readFile(filePath, 'utf-8');

  return new Promise((resolve, reject) => {
    const records = [];
    parse(fileContent, {
      trim: true,
      skip_empty_lines: true
    })
      .on('readable', function () {
        let record;
        while ((record = this.read())) {
          records.push(record);
        }
      })
      .on('end', () => {
        logger.debug(`Total rows parsed from ${fileName}: ${records.length}`);
        resolve(records);
      })
      .on('error', err => {
        logger.error(`Error parsing CSV file: ${fileName} - ${err.message}`);
        reject(err);
      });
  });
}

// Used for count validation (Scenario 2)
async function readCSVAndCountRows(fileName) {
  const filePath = path.join(basePath, fileName);
  logger.info(`Counting rows in CSV file: ${filePath}`);

  const fileContent = await fs.promises.readFile(filePath, 'utf-8');

  return new Promise((resolve, reject) => {
    let count = 0;
    parse(fileContent, {
      trim: true,
      skip_empty_lines: true
    })
      .on('readable', function () {
        while (this.read()) count++;
      })
      .on('end', () => {
        logger.info(`Row count in ${fileName}: ${count}`);
        resolve(count);
      })
      .on('error', err => {
        logger.error(`Error reading CSV row count: ${fileName} - ${err.message}`);
        reject(err);
      });
  });
}

function getColumnIndex(csvData, columnName) {
  const header = csvData[0];
  const index = header.findIndex(
    col => col.trim().toLowerCase() === columnName.trim().toLowerCase()
  );
  logger.debug(`Column index for "${columnName}": ${index}`);
  return index;
}

function findRowByFilter(csvData, filterKey, filterValue) {
  const colIndex = getColumnIndex(csvData, filterKey);
  if (colIndex === -1) {
    const msg = `Column "${filterKey}" not found in CSV`;
    logger.error(msg);
    throw new Error(msg);
  }

  const dataRows = csvData.slice(1);
  const matchingRow = dataRows.find(row => row[colIndex]?.trim() === filterValue.trim());

  if (!matchingRow) {
    const msg = `No matching row found for ${filterKey} = ${filterValue}`;
    logger.warn(msg);
    throw new Error(msg);
  }

  logger.info(`Matching row found for ${filterKey}=${filterValue}`);
  return matchingRow;
}

function getFilteredNormalizedRow(fileName, filterKey, filterValue) {
  logger.info(
    `Fetching filtered normalized row for file: ${fileName}, filter: ${filterKey}=${filterValue}`
  );
  const csvData = readCSVWithHeader(fileName);
  const colIndex = getColumnIndex(csvData, filterKey);

  if (colIndex === -1) {
    const msg = `Column '${filterKey}' not found in file ${fileName}`;
    logger.error(msg);
    throw new Error(msg);
  }

  const matchedRow = csvData.slice(1).find(row => row[colIndex] === filterValue);
  if (!matchedRow) {
    const msg = `No matching row found for ${filterKey} = ${filterValue}`;
    logger.warn(msg);
    throw new Error(msg);
  }

  const normalized = normalizeRow(matchedRow);
  logger.debug(`Normalized matched row: ${normalized}`);
  return normalized;
}

function normalizeRow(rowArr) {
  const normalized = rowArr
    .map(val => {
      const maybeDate = new Date(val);
      if (!isNaN(maybeDate) && val.includes(':')) {
        return maybeDate.toISOString().slice(0, 19).replace('T', ' ');
      }
      return val.trim().toLowerCase();
    })
    .join(',');

  logger.debug(`Normalized row: ${normalized}`);
  return normalized;
}

function getSpecificColData(fileName, columnIndex) {
  const filePath = path.join(basePath, fileName);
  logger.info(`Fetching column index ${columnIndex} from file: ${fileName}`);

  const lines = fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .filter(line => line.trim() !== '');

  const values = lines
    .map(line => {
      const cols = line.split(',');
      return cols[columnIndex]?.trim();
    })
    .filter(val => val !== undefined);

  logger.debug(`Extracted ${values.length} values from column index ${columnIndex}`);
  return values;
}

module.exports = {
  getSpecificColData,
  normalizeRow,
  getFilteredNormalizedRow,
  getColumnIndex,
  readCSVAndCountRows,
  readCSVWithHeader,
  readCSVWithoutHeader,
  readFileRecords,
  findRowByFilter
};
