const puppeteer = require('puppeteer');

const paginas = [
 'https://www.w3schools.com/php/php_ref_simplexml.asp',
 'https://www.w3schools.com/php/php_ref_string.asp',
 'https://www.w3schools.com/php/php_ref_xml.asp',
 'https://www.w3schools.com/php/php_ref_zip.asp',
 'https://www.w3schools.com/php/php_ref_timezones.asp',
];

(async () => {
  const browser = await puppeteer.launch();

  for (let i = 0; i < paginas.length; i++) {
    const page = await browser.newPage();
    const url = paginas[i];

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Selecciona el elemento que deseas capturar (puedes ajustar el selector según tu necesidad)
    const selector = '#main';  // Reemplaza con tu selector
    const elementHandle = await page.$(selector);

    // Captura el área del elemento y guarda la imagen con el índice como nombre
    await elementHandle.screenshot({ path: `${i}_captura.png` });

    await page.close();
  }

  await browser.close();
})();
