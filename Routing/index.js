const express = require('express');
const bodyParser = require('body-parser');
const routsInit = require('./route-list'); // Роуты вынесены в отдельный модуль
const port = process.env.PORT || process.env.LOCAL_SERVER_PORT || 3000;

const app = express();

app.enable('strict routing');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));

routsInit(app);
app.listen(port);