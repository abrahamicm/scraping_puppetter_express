const puppeteer = require('puppeteer');

async function scrapeHandler(req, res) {
  const urls = req.body.urls.split('\n').map(url => url.trim());
  const strategy = req.body.strategy;
  const selector = req.body.selector;
  const hideSelector = req.body.hideSelector;

  const result = await scrapeUrls(urls, strategy, selector, hideSelector);

  res.send(`Resultados: ${JSON.stringify(result, null, 2)}`);
}

async function scrapeUrls(urls, strategy, selector, hideSelector = null) {
  const browser = await puppeteer.launch();
  const result = [];

  for (const url of urls) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    let elementHandles;

    if (strategy === 'selector' && selector) {
      elementHandles = await page.$$(selector);

      if (hideSelector) {
        // Ejecuta código JavaScript en la página para eliminar elementos
        await page.evaluate((hideSel) => {
          const elements = document.querySelectorAll(hideSel);
          for (const element of elements) {
            element.parentNode.removeChild(element);
          }
        }, hideSelector);

        // Agrega un tiempo de espera (ajusta según sea necesario)
        await page.waitForTimeout(1000);
      }

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
