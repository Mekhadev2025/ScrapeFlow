const axios = require('axios');
const cheerio = require('cheerio');

const staticScraper = async (url, selector) => {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const results = [];

    // Extract data using the provided selector
    $(selector).each((index, element) => {
      results.push($(element).text().trim());
    });

    return { success: true, data: results };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = staticScraper;
