const { chromium } = require('playwright');
const path = require('path');

const extensionPath = '/Users/macbook/Documents/SIH_Extract/sih-web-repo/extension';
const userDataDir = '/tmp/govshield-dev-profile';

(async () => {
  const browserContext = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });

  const page = await browserContext.newPage();
  await page.goto('http://localhost:3000');
})();
