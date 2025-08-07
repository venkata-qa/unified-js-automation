const CHROME = 'chrome';
const FIREFOX = 'firefox';
const WEBKIT = 'webkit';
const MSEDGE = 'msedge';
const EDGE = 'edge';
const CHROMIUM = 'chromium';
const BLANK = '';

class BrowserConstants {
  constructor() {
    const FIREFOX = 'firefox';
    this.FIREFOX = FIREFOX;
    const WEBKIT = 'webkit';
    this.WEBKIT = WEBKIT;
  }

  getFirefox() {
    return this.FIREFOX;
  }

  getWebkit() {
    return this.WEBKIT;
  }
}

module.exports = { BrowserConstants };
