const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

class SchemaUtils {
  validateSchema(schemaFileName, dirPath, responseData) {
    // Get the project root directory (two levels up from src/utils)
    const projectRoot = path.resolve(__dirname, '../../');
    const schemaPath = path.join(projectRoot, dirPath, schemaFileName);
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    const validate = ajv.compile(schema);
    const valid = validate(responseData);
    return { valid, errors: validate.errors };
  }
}

module.exports = { SchemaUtils };
