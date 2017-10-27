const MongoClient    = require('mongodb').MongoClient;
const express        = require('express');
const bodyParser     = require('body-parser');
const app            = express();

// Конфигурации сервера и базы данных
const dbUrl          = require('./config/db').url;
const serverPort     = require('./config/server').port;

// Middleware для обработки тела запросов
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));

// WEB-интерфейс
app.use(express.static('public'));

// Подключение базы данных
MongoClient.connect(dbUrl)
  .then(db => {
    // Подключаем роуты приложения в процедурном стиле
    require('./app/routes')(app, db);

    app.listen(serverPort, () => {
      console.log(`The server is running on port ${serverPort}`);
    });
  })
  .catch(console.error);