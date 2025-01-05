const axios = require('axios');
const cheerio = require('cheerio');

const staticScraper = async (url, selectors) => {
  try {
    // Fetch HTML from the URL
    const { data: html } = await axios.get(url);

    // Load HTML into Cheerio
    const $ = cheerio.load(html);

    // Iterate over selectors and extract data
    const results = selectors.map(selector => {
      const elements = $(selector).toArray();
      return {
        selector,
        elements: elements.map(el => $(el).text().trim()),
      };
    });

    return results; // Return the array of scraped data
  } catch (error) {
    throw new Error(`Failed to scrape the website: ${error.message}`);
  }
};

module.exports = staticScraper;
