const { Given, When, Then } = require('@cucumber/cucumber');
const { Helper } = require('../../../src/utils/helper');
const helperObj = new Helper();

When(
  'I enter the data for the following fields from the excel file (string)',
  async function (excelFileData, dataTable) {
    const worksheet = await helperObj.getExcelWorkbook(excelFileData);
    const rows = dataTable.hashes();
    for (const column of rows) {
      const fieldName = column.FieldName;
      const pageClassName = column.PageName;
      const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = data[0];
      const rowIndex = data.findIndex(row => row.includes(excelFileRowID));
      const rowData = data[rowIndex];

      const fieldIndex = headers.indexOf(fieldName);
      const fieldValue = rowData[fieldIndex];

      const webElement = await helperObj.getWebElement(fieldName, pageClassName);
      await webElement.fill(fieldValue);
    }
  }
);
