const express = require('express');
const app = express();
const server = require('http').createServer(app);

// client side
app.use(express.static('pages'));

module.exports = server;