const { Given, When, Then } = require('@cucumber/cucumber');
const { Helper } = require('../../../src/utils/helper');
const { TIMEOUT_DURATION } = require('../../../src/utils/config');

const helperObj = new Helper();

When(
  'I select the {string} option type with value {string} from the {string} dropdown menu on the {string}',
  { timeout: TIMEOUT_DURATION },
  async function (optionType, optionValue, elementName, pageName) {
    const webElement = await helperObj.getWebElement(elementName, pageName);
    switch (optionType.toLowerCase()) {
      case 'label':
        await webElement.selectOption({ label: optionValue });
        break;
      case 'value':
        await webElement.selectOption({ value: optionValue });
        break;
      case 'index':
        await webElement.selectOption({ index: parseInt(optionValue) });
        break;
      default:
        throw new Error(`Unsupported option type: ${optionType}`);
    }
  }
);
