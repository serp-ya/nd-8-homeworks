module.exports = (server) => {
  server.get('/', (req, res) => {
    res.send('Hello, Express.js');
  });

  server.get('/hello', (req, res) => {
    res.send('Hello stranger!');
  });

  server.get('/hello/:someName', (req, res) => {
    res.send(`Hello, ${req.params.someName}!`);
  });

  server.all('/sub*', (req, res) => {
    const fullURL = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.send(`You requested URI: ${fullURL}`);
  });

  server.post('/post', (req, res) => {
    try {
      const postBody = req.body;

      if (!req.headers.key) {
        return res.sendStatus(401).end();
      }

      // Проверка на пустой объект
      if (Object.keys(postBody).length === 0 && postBody.constructor === Object) {
        return res.sendStatus(404).end();
      }

      res.send(`You requested URI: ${JSON.stringify(postBody)}`);
    } catch(err) {
      res.status(500);
      res.send('Internal server error').end();
      
      console.log(err);
    }
  });

};