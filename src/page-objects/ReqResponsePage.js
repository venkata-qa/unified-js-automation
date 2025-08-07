class ReqResponsePage {
  constructor(page) {
    this.page = page;
    this.getElementButton = page.locator('//li[@data-id="users"]');
    this.responseCodeElement = page.locator('//span[@class="response-code"]');
    this.responseBodyElement = page.locator('//pre[@data-key="output-response"]');
  }
}

module.exports = { ReqResponsePage };
