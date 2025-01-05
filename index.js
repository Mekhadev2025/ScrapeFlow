const express = require('express');
const staticScraper = require('./scrapers/staticScraper');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Serve static files like CSS, JS, etc.
app.use(express.static('public'));
app.use(cors());

app.use(express.json());

// Static scraping endpoint
app.post('/scrape/static', async (req, res) => {
  const { url, selector, fileFormat } = req.body; // Updated to use "selectors" (array)
  console.log(fileFormat);

  // Validate input
  console.log("Url",url)
  console.log("selectors",selector)
  if (!url || !selector ) {
    return res.status(400).json({
      success: false,
      error: 'URL and  selectors are required.',
    });
  }
  const selectors = selector.split(',').map(s => s.trim()); // Split by ',' and remove whitespace

  try {
    // Call staticScraper with the URL and array of selectors
    const result = await staticScraper(url, selectors);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error scraping the website:', error.message);
    res.status(500).json({
      success: false,
      error: `Error scraping the website: ${error.message}`,
    });
  }
});

// Server health check
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Web Scraping Microservice',
    message: "Your microservice is up and running. It's ready to scrape data from the web.",
    buttonText: 'Explore More',
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
