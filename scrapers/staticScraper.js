const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { SocksProxyAgent } = require('socks-proxy-agent');

// Load the proxy list from the JSON file
const proxies = JSON.parse(fs.readFileSync('proxies.json', 'utf-8')); 

// Function to randomly pick a proxy from the list
const getRandomProxy = () => {
  const randomIndex = Math.floor(Math.random() * proxies.length);
  return proxies[randomIndex];
};

// Function to fetch data with a proxy
const fetchDataWithProxy = async (url, proxy) => {
  const { ip, port, protocols } = proxy;
  const proxyUrl = `${protocols[0]}://${ip}:${port}`;
  const agent = new SocksProxyAgent(proxyUrl);

  try {
    const { data: html } = await axios.get(url, { httpsAgent: agent });
    return html;
  } catch (error) {
    throw new Error(`Proxy connection failed: ${error.message}`);
  }
};

// Function to fetch data without a proxy (using your own IP address)
const fetchDataWithoutProxy = async (url) => {
  try {
    const { data: html } = await axios.get(url);
    return html;
  } catch (error) {
    throw new Error(`Failed to fetch data without proxy: ${error.message}`);
  }
};

// Static scraper function that implements proxy rotation with fallback to own IP address
const staticScraper = async (url, selectors) => {
  let html;
  let attempt = 0;
  
  // Try fetching data with multiple proxies
  while (attempt < proxies.length) {
    const proxy = getRandomProxy();
    try {
      html = await fetchDataWithProxy(url, proxy);
      break;  // If we successfully get the data, exit the loop
    } catch (error) {
      console.log(`Attempt ${attempt + 1} failed using proxy ${proxy.ip}: ${error.message}`);
      attempt++;
      if (attempt === 3) {
        console.log('3 proxy attempts failed, switching to own IP address...');
        try {
          html = await fetchDataWithoutProxy(url);
          break;  // Successfully fetched data using your own IP
        } catch (error) {
          throw new Error('Failed to fetch data without proxy after 10 attempts');
        }
      }
    }
  }

  // Load HTML into Cheerio to parse it
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
};

// Exporting the staticScraper function to be used elsewhere
module.exports = staticScraper;
