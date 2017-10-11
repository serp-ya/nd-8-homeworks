const RPCMethods = require('./rpc-methods');

// Набор тестовых запросов для проверки
// Create user
// { "jsonrpc": 2.0, "method": "create", "params": { "name": "Valera Evgenievich", "score": 24 }, "id": 31 }

// Read all users
// { "jsonrpc": 2.0, "method": "read", "params": "", "id": 31 }

// Read user ID12
// { "jsonrpc": 2.0, "method": "read", "params": { "id": 12 }, "id": 31 }

// Update user ID12
// { "jsonrpc": 2.0, "method": "update", "params": { "id": 12, "age": 87, "planet": "Neptun" }, "id": 31 }

// Delete user ID12
// { "jsonrpc": 2.0, "method": "delete", "params": { "id": 12, "age": 87, "planet": "Neptun" }, "id": 31 }

module.exports = function (server, usersList) {
  server.post('/rpc/v1/users/', (req, res) => {
    try {
      const method = RPCMethods[req.body.method];

      // Проверка на ошибку в переданном методе
      if (!method) {
        const errorMessage = RPCMethods.errorInstance('Bad request: method', 400);
        const errorResponse = RPCMethods.error(errorMessage, req.body.id);
        res.statusCode = 400;
        res.json(errorResponse);
        return;
      }

      method(req.body.params, usersList, (err, result) => {
        if (err) {
          res.json(RPCMethods.error(err));
          return;
        }

        res.json(RPCMethods.goodRequest(result, req.body.id));
      });

    } catch(e) {
      console.error(e);
      const errorMessage = RPCMethods.errorInstance('Internal server error', 500);
      const errorResponse = RPCMethods.error(errorMessage, req.body.id);
      res.statusCode = 500;
      res.json(errorResponse);
    }
  });
};