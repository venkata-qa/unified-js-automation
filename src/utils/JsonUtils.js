const fs = require('fs');
const path = require('path');

class JsonUtils {
  readJsonFile(fileName, dirPath) {
    // Get the project root directory (two levels up from src/utils)
    const projectRoot = path.resolve(__dirname, '../../');
    const filePath = path.join(projectRoot, dirPath, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  }

  getValueFromPath(obj, pathStr) {
    const keys = pathStr.split('.');
    let value = obj;
    for (const key of keys) {
      if (key.includes('[')) {
        const [arrayKey, index] = key.split(/\[|\]/).filter(Boolean);
        value = value?.[arrayKey]?.[parseInt(index)];
      } else {
        value = value?.[key];
      }
    }
    return value;
  }

  findItemByField(array, field, value) {
    return array.find(item => item[field] === value);
  }

  matchObjectFields(item, dataTableRows) {
    for (const [fieldPath, expectedValue] of dataTableRows) {
      const actual = this.getValueFromPath(item, fieldPath);
      if (actual?.toString() !== expectedValue) {
        return false;
      }
    }
    return true;
  }
}

module.exports = { JsonUtils };
