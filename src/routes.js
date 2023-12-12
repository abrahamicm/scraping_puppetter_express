const express = require('express');
const router = express.Router();
const scraping = require('./scraping');

router.get('/', (req, res) => {
  res.render('form');
});

router.post('/scrape', scraping.scrapeHandler);

module.exports = router;
