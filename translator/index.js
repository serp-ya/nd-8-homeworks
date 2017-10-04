const translator = require('./translator');
const fs = require('fs');

const http = require('http');
const port = process.env.PORT || 3000;
const server = http.createServer(showForm);

server.on('error', err => console.error(err));
server.on('request', handler);

server.listen(port);

function showForm(req, res) {
  if (req.method === 'GET') {
    res.writeHead(200, 'OK', {
      'Content-Type': 'text/html; charset=utf-8'
    });

    fs.readFile(__dirname + '/form.html', (err, data) => {
      if (err) {
        return console.error(err);
      }
      res.end(data);
    });
  }
}

function handler(req, res) {
  if (req.method === 'POST') {
    let requestText = '';
    req.on('data', chunk => {
      requestText += chunk;
    });

    req.on('end', () => {
      translator(requestText)
      .then(data => {
        res.write(data);
        res.end();
      })
      .catch(console.error);
    });
  }
}