const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const server = require('http').createServer(app);

// client side
app.use(express.static('app'));

server.listen(port, () => {
  console.log(`The server is runing on port ${port}`);
});