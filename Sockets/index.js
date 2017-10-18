const server = require('./libs/server');
const chat = require('./libs/chat'); // Procedure style
const port = process.env.PORT || 3000;

server.listen(port);