const puppeteer = require('puppeteer');

async function scrapeHandler(req, res) {
  const urls = req.body.urls.split('\n').map(url => url.trim());
  const strategy = req.body.strategy;
  const selector = req.body.selector;

  const result = await scrapeUrls(urls, strategy, selector);

  res.send(`Resultados: ${JSON.stringify(result, null, 2)}`);
}

async function scrapeUrls(urls, strategy, selector) {
  const browser = await puppeteer.launch();
  const result = [];

  for (const url of urls) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    if (strategy === 'selector' && selector) {
      // Usa page.$$ para obtener todos los elementos que coinciden con el selector
      const elementHandles = await page.$$(selector);

      // Itera sobre cada elemento y captura la pantalla
      for (let i = 0; i < elementHandles.length; i++) {
        const screenshotPath = `screenshot_${Date.now()}_${i}.png`;
        await elementHandles[i].screenshot({ path: screenshotPath });
        result.push({ url, screenshotPath });
      }
    }

    await page.close();
  }

  await browser.close();

  return result;
}

module.exports = {
  scrapeHandler,
  scrapeUrls,
};
