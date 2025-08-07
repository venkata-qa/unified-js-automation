const fs = require('fs');
const yaml = require('js-yaml');

class TestDataUtils {
  async getData(data, type = null) {
    try {
      let yamlFileContent;
      if (process.env.NODE_ENV == 'test') {
        if (type == 'api') {
          yamlFileContent = await fs.readFileSync(
            './test-data/apidata/test_env_test_data.yml',
            'utf8'
          );
        } else {
          yamlFileContent = await fs.readFileSync(
            './test-data/uidata/test_env_test_data.yml',
            'utf8'
          );
        }
      } else if (process.env.NODE_ENV == 'dev') {
        if (type == 'api') {
          yamlFileContent = await fs.readFileSync(
            './test-data/apidata/dev_env_test_data.yml',
            'utf8'
          );
        } else {
          yamlFileContent = await fs.readFileSync(
            './test-data/uidata/dev_env_test_data.yml',
            'utf8'
          );
        }
      } else if (process.env.NODE_ENV == 'preprod') {
        if (type == 'api') {
          yamlFileContent = await fs.readFileSync(
            './test-data/apidata/preprod_env_test_data.yml',
            'utf8'
          );
        } else {
          yamlFileContent = await fs.readFileSync(
            './test-data/uidata/preprod_env_test_data.yml',
            'utf8'
          );
        }
      } else {
        // Default to prod environment
        if (type == 'api') {
          yamlFileContent = await fs.readFileSync(
            './test-data/apidata/prod_env_test_data.yml',
            'utf8'
          );
        } else {
          yamlFileContent = await fs.readFileSync(
            './test-data/uidata/prod_env_test_data.yml',
            'utf8'
          );
        }
      }

      const config = await yaml.load(yamlFileContent);

      return config[data];
    } catch (err) {
      console.error('Error reading or parsing the Data YAML file:', err);
    }
  }
}
module.exports = { TestDataUtils };
