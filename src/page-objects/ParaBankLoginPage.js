class ParaBankLoginPage {
  constructor(page) {
    this.page = page;
    this.usernameElement = page.locator('input[name="username"]');
    this.passwordElement = page.locator('input[name="password"]');
    this.loginElement = page.locator('input[type="submit"]');
  }
}

module.exports = { ParaBankLoginPage };
