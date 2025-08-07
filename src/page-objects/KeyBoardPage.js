class KeyBoardPage {
  constructor(page) {
    this.page = page;
    this.textBox = page.locator('input[id="target"]');
  }
}

module.exports = { KeyBoardPage };
