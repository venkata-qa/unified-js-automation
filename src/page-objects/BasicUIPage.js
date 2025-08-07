class BasicUIPage {
  constructor(page) {
    this.page = page;
    this.usernameElement = page.locator('input[name="username"]');
    this.passwordElement = page.locator('input[name="password"]');
    this.commentsElement = page.locator('//textarea[@name="comments"]');
    this.checkbox1 = this.page.locator('//input[@name="checkboxes[]" and @value="cb1"]');
    this.selectElement = this.page.locator('//select[@multiple="multiple"]');
    this.dropdownElement = this.page.locator('//select[@name="dropdown"]');
    this.loginElement = page.locator('//input[@type="submit" and @name="submitbutton"]');
    this.alertButton = page.locator('//input[@id="alertexamples"]');
    this.sourceElement = '//div[@id="draggable1"]';
    this.destinationElement = '//div[@id="droppable1"]';
  }
}

module.exports = { BasicUIPage };
