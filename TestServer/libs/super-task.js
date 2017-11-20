module.exports = function (server, usersList) {
  const apiV1Path = '/supertask/v1/users/';

  server.post(apiV1Path, (req, res) => {
    try {
      const params = req.body;

      if (Object.keys(params).length === 0 && params.constructor === Object) {
        res.statusCode = 400;
        res.send('Empty parameters'); // Если newParams не переданы, ошибка
        return;
      }

      let transformedUsersList = usersList.slice();

      if (params.fields) {
        transformedUsersList = filterUsersByFields(params.fields, transformedUsersList);
      }

      if (params.offset) {
        transformedUsersList = transformedUsersList.slice(params.offset);
      }

      if (params.limit) {
        transformedUsersList = transformedUsersList.slice(0, params.limit);
      }

      res.send(transformedUsersList);

      function filterUsersByFields(fields, users) {
        fields = fields.split(',');
        fields.forEach((element, i, array) => array[i] = element.trim()); // Дополнительная очистка пробелов

        const filteredUsersList = users.map(user => {
          const result = {};
          fields.forEach(prop => {
            if (user.hasOwnProperty(prop)) {
              result[prop] = user[prop]
            }
          });

          return result;
        }).filter(user => Object.keys(user).length !== 0); // Очистка пустых объектов

        return filteredUsersList;
      }

    } catch(e) {
      console.error(e);
      res.statusCode = 500;
      res.send('Internal server error');
    }
  });

  server.delete(apiV1Path, () => {
    try {
      usersList.splice(0);
      res.send(`Deleted all users`);

    } catch(e) {
      console.error(e);
      res.statusCode = 500;
      res.send('Internal server error');
    }
  });
}