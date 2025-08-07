const mysql = require('mysql2/promise');
const logger = require('./logger');

const env = process.env.NODE_ENV || 'dev';

const dbEnvironments = {
  dev: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Aish@123',
    database: 'mysql'
  },
  test: {
    host: 'test-db-host',
    port: 3306,
    user: 'test_user',
    password: 'test_pass',
    database: 'test_db'
  },
  preprod: {
    host: 'preprod-db-host',
    port: 3306,
    user: 'preprod_user',
    password: 'preprod_pass',
    database: 'preprod_db'
  },
  prod: {
    host: 'prod-db-host',
    port: 3306,
    user: 'prod_user',
    password: 'prod_pass',
    database: 'prod_db'
  }
};

const dbConfig = dbEnvironments[env.toLowerCase()];
if (!dbConfig) {
  logger.error(`Invalid NODE_ENV provided: ${env}`);
  throw new Error(`Invalid NODE_ENV provided: ${env}`);
}

logger.info(`DB configuration loaded for environment: ${env}`);

// Execute any query and return records
async function fetchDataFromDB(query) {
  let connection;
  try {
    logger.info(`Executing query: ${query}`);
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(query);
    return rows.map(row => Object.values(row).map(val => String(val).trim()));
  } catch (error) {
    logger.error(`Error executing query: ${query} - ${error.message}`);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

// Get values from a specific column
async function getColumnDataFromDB(tableName, columnName) {
  let connection;
  try {
    const query = `SELECT ${columnName} FROM ${tableName}`;
    logger.info(`Fetching column '${columnName}' from table '${tableName}'`);
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(query);
    return rows.map(row => String(row[columnName]).trim());
  } catch (error) {
    logger.error(`Error fetching column '${columnName}' from table '${tableName}': ${error.message}`);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

// Count total records
async function getDBRecordCount(tableName) {
  let connection;
  try {
    const query = `SELECT COUNT(*) as count FROM ${tableName}`;
    logger.info(`Counting records in table '${tableName}'`);
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(query);
    logger.info(`Total records in '${tableName}': ${rows[0].count}`);
    return parseInt(rows[0].count);
  } catch (error) {
    logger.error(`Error counting records in table '${tableName}': ${error.message}`);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

// Fetch all DB records and normalize for comparison
async function fetchDBRecords(tableName) {
  let connection;
  try {
    const query = `SELECT * FROM ${tableName}`;
    logger.info(`Fetching all normalized records from table '${tableName}'`);
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(query);

    return rows.map(row =>
      Object.values(row).map(val => {
        const maybeDate = new Date(val);
        if (!isNaN(maybeDate) && val.toString().includes(':')) {
          return maybeDate.toISOString().slice(0, 19).replace('T', ' ');
        }
        return String(val).trim().toLowerCase();
      }).join(',')
    );
  } catch (error) {
    logger.error(`Error fetching records from table '${tableName}': ${error.message}`);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

// Get all column names from DB table
async function getColumnNamesFromDB(tableName) {
  let connection;
  try {
    const query = `SHOW COLUMNS FROM ${tableName}`;
    logger.info(`Fetching column names from table '${tableName}'`);
    connection = await mysql.createConnection(dbConfig);
    const [columns] = await connection.execute(query);
    return columns.map(col => col.Field.trim().toLowerCase());
  } catch (error) {
    logger.error(`Error fetching column names from table '${tableName}': ${error.message}`);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

module.exports = {
  fetchDataFromDB,
  getColumnDataFromDB,
  getDBRecordCount,
  fetchDBRecords,
  getColumnNamesFromDB,
  dbConfig
};
