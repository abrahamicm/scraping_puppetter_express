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


function obtenerInformacionColores() {
  // Obtener todos los elementos del documento
  var allElements = document.querySelectorAll('*');

  // Inicializar un objeto para almacenar la información de colores
  var colorInfo = {};

  // Iterar sobre cada elemento y obtener la información de colores
  allElements.forEach(function (element) {
    var computedStyle = window.getComputedStyle(element);
    var color = computedStyle.color;

    // Agregar la información al objeto colorInfo
    if (color) {
      if (!colorInfo[color]) {
        colorInfo[color] = 0;
      }
      colorInfo[color]++;
    }
  });

  // Mostrar la información en la consola
  console.log('Información de colores utilizados:');
  console.log(colorInfo);

  // Devolver el objeto con la información
  return colorInfo;
}

// Llama a la función para obtener la información
obtenerInformacionColores();