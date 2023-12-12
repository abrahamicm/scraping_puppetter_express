const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <form action="/scrape" method="post">
      <label for="urls">URLs (separadas por salto de línea):</label>
      <textarea id="urls" name="urls" rows="4" cols="50"></textarea>
      <br>
      <label for="strategy">Estrategia:</label>
      <select id="strategy" name="strategy">
        <option value="selector">Capturar Selector</option>
        <!-- Puedes agregar más opciones de estrategias aquí -->
      </select>
      <br>
      <label for="selector">Nombre del Selector:</label>
      <input type="text" id="selector" name="selector">
      <br>
      <input type="submit" value="Scrapear">
    </form>
  `);
});

app.post('/scrape', async (req, res) => {
  const urls = req.body.urls.split('\n').map(url => url.trim());
  const strategy = req.body.strategy;
  const selector = req.body.selector;

  // Inicia Puppeteer
  const browser = await puppeteer.launch();
  const result = [];

  for (const url of urls) {
    const page = await browser.newPage();
    console.log(url)
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Aplica la estrategia correspondiente (en este caso, captura de selector)
    if (strategy === 'selector' && selector) {
      const elementHandle = await page.$(selector);
      if (elementHandle) {
        const screenshotPath = `screenshot_${Date.now()}.png`;
        await elementHandle.screenshot({ path: screenshotPath });
        result.push({ url, screenshotPath });
      }
    }

    await page.close();
  }

  await browser.close();

  res.send(`Resultados: ${JSON.stringify(result, null, 2)}`);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
