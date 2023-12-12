const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes');
const path = require('path');


const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
