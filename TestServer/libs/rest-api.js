module.exports = function (server, usersList) {
  const apiV1Path = '/rest/v1/users/';
  
  server.post(apiV1Path, (req, res) => {
    try {
      const newUserName = req.body.name;
      const newUserScore = req.body.score;

      if (!newUserName || !newUserScore) {
        res.statusCode = 400;
        res.send('Invalid request values'); // Если не переданы name или score, ошибка
        return;
      }

      const highestUsersId = usersList.reduce((highestId, currentUser) => {
        return (highestId < currentUser.id) ? currentUser.id : highestId;
      }, 0);

      const newUser = {
        id: 1 + highestUsersId,
        name: newUserName,
        score: newUserScore
      };

      usersList.push(newUser);
      res.send(newUser);

    } catch(e) {
      console.error(e);
      res.statusCode = 500;
      res.send('Internal server error');
    }
  });

  server.get(apiV1Path, (req, res) => {
    try {
      res.send(usersList);

    } catch(e) {
      console.error(e);
      res.statusCode = 500;
      res.send('Internal server error');
    }
  });

  server.get(apiV1Path + ':id', (req, res) => {
    try {
      const requestUserId = Number(req.params.id);

      if (!requestUserId) {
        res.statusCode = 400;
        res.send('Uncorrect user\'s ID'); // Если requestUserId не число, ошибка
        return;
      }

      const currentUser = usersList.find(user => user.id === requestUserId);

      if (!currentUser) {
        res.statusCode = 404;
        res.send('User not found'); // Если user не найден по ID, ошибка
        return;
      }

      res.send(currentUser);

    } catch(e) {
      console.error(e);
      res.statusCode = 500;
      res.send('Internal server error');
    }
  });

  server.get(apiV1Path + ':id' + '/:prop', (req, res) => {
    try {
      const requestUserId = Number(req.params.id);
      const requestUserProp = req.params.prop;

      if (!requestUserId) {
        res.statusCode = 400;
        res.send('Uncorrect user\'s ID'); // Если requestUserId не число, ошибка
        return;
      }

      const currentUser = usersList.find(user => user.id === requestUserId);

      if (!currentUser) {
        res.statusCode = 404;
        res.send('User not found'); // Если user не найден по ID, ошибка
        return;
      }

      const userProperty = currentUser[requestUserProp];

      if (!userProperty) {
        res.statusCode = 400;
        res.send('Undefined property'); // Если значение из URL не найден по user, ошибка
        return;
      }

      res.send(String(userProperty));

    } catch(e) {
      console.error(e);
      res.statusCode = 500;
      res.send('Internal server error');
    }
  });

  server.put(apiV1Path + ':id', (req, res) => {
    try {
      const requestUserId = Number(req.params.id);
      const newParams = req.body;

      if (!requestUserId) {
        res.statusCode = 400;
        res.send('Uncorrect user\'s ID'); // Если requestUserId не число, ошибка
        return;
      }

      if (Object.keys(newParams).length === 0 && newParams.constructor === Object) {
        res.statusCode = 400;
        res.send('Empty parameters'); // Если newParams не переданы, ошибка
        return;
      }

      const currentUser = usersList.find(user => user.id === requestUserId);

      if (!currentUser) {
        res.statusCode = 404;
        res.send('User not found'); // Если user не найден по ID, ошибка
        return;
      }

      for (const param in newParams) {
        currentUser[param] = newParams[param];
      }
      res.send(currentUser);

    } catch(e) {
      console.error(e);
      res.statusCode = 500;
      res.send('Internal server error');
    }
  });

  server.delete(apiV1Path + ':id', (req, res) => {
    try {
      const requestUserId = Number(req.params.id);

      if (!requestUserId) {
        res.statusCode = 400;
        res.send('Uncorrect user\'s ID'); // Если requestUserId не число, ошибка
        return;
      }

      const currentUser = usersList.find(user => user.id === requestUserId);
      const currentUserIndex = usersList.indexOf(currentUser);

      if (!currentUser) {
        res.statusCode = 404;
        res.send('User not found'); // Если user не найден по ID, ошибка
        return;
      }

      usersList.splice(currentUserIndex, 1);
      res.send(`User with ID${requestUserId} deleted`);

    } catch(e) {
      console.error(e);
      res.statusCode = 500;
      res.send('Internal server error');
    }
  });
}