const express = require('express');
const staticScraper = require('./scrapers/staticScraper');
const dynamicScraper = require('./scrapers/dynamicScraper');

const app = express();
const PORT = 3000;
// Set EJS as the template engine
app.set('view engine', 'ejs');

// Serve static files like CSS, JS, etc.
app.use(express.static('public'));


app.use(express.json());

// Static scraping endpoint
app.post('/scrape/static', async (req, res) => {
  const { url, selector } = req.body;

  if (!url || !selector) {
    return res.status(400).json({ success: false, error: 'URL and selector are required.' });
  }

  const result = await staticScraper(url, selector);
  res.json(result);
});

// Dynamic scraping endpoint
app.post('/scrape/dynamic', async (req, res) => {
  const { url, selector } = req.body;

  if (!url || !selector) {
    return res.status(400).json({ success: false, error: 'URL and selector are required.' });
  }

  const result = await dynamicScraper(url, selector);
  res.json(result);
});

// Server health check
app.get('/', (req, res) => {
    res.render('index', {
      title: "Web Scraping Microservice",
      message: "Your microservice is up and running. It's ready to scrape data from the web.",
      buttonText: "Explore More"
    });
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
