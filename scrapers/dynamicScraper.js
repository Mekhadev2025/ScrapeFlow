const puppeteer = require('puppeteer');

const dynamicScraper = async (url, selector) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the selector to appear
    await page.waitForSelector(selector);

    // Scrape the data
    const results = await page.$$eval(selector, (elements) =>
      elements.map((el) => el.textContent.trim())
    );

    return { success: true, data: results };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = dynamicScraper;
