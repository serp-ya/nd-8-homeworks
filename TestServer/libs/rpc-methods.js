const RPCMethods = {};

// Возвращаем json ошибки
RPCMethods.error = (error, currentId) => {
  if (!error) {
    console.error('Empty \'Error\' argument');
    return;
  } else if (!error.code) {
    console.error('Empty \'Error code\' argument');
    return;
  } else if (!error.message) {
    console.error('Empty \'Error message\' argument');
    return;
  }

  return {
    jsonrpc: 2.0,
    error: {code: error.code, message: error.message},
    id: currentId
  }
}

// Фабрика объектов ошибки
RPCMethods.errorInstance = (message, code) => {
  const error = new Error(message);
  error.code = code;
  return error;
}

// Возвращаем json корректного ответа
RPCMethods.goodRequest = (result, currentId) => {
  return {
    jsonrpc: 2.0,
    result: result,
    id: currentId
  }
}

RPCMethods.create = (params, essence, callback) => {
  if (!params.name) {
    callback(RPCMethods.errorInstance('Property \'name\' is undefined', 400));
    return;
  } else if (!params.score) {
    callback(RPCMethods.errorInstance('Property \'score\' is undefined', 400));
    return;
  }

  const highestUsersId = essence.reduce((highestId, currentUser) => {
    return (highestId < currentUser.id) ? currentUser.id : highestId;
  }, 0);

  const newUser = {
    id: 1 + highestUsersId,
    name: params.name,
    score: params.score
  };

  essence.push(newUser);
  callback(null, {message: 'User succesfully created', user: newUser});
};

RPCMethods.read = (params, essence, callback) => {
  if (!params.id) {
    callback(null, {message: 'Show all users', users: essence});
    return;
  }

  const currentUser = essence.find(user => user.id === Number(params.id));

  if (!currentUser) {
    callback(RPCMethods.errorInstance('User not found', 404));
    return;
  }

  callback(null, {message: `User ID${params.id}`, user: currentUser});
};

RPCMethods.update = (params, essence, callback) => {
  if (!params.id) {
    callback(RPCMethods.errorInstance('Property \'id\' is undefined', 400));
    return;
  } else if (Object.keys(params).length <= 1) {
    callback(RPCMethods.errorInstance('Have no propeties to update', 400));
    return;
  }

  const currentUser = essence.find(user => user.id === Number(params.id));

  for (const property in params) {
    currentUser[property] = params[property]
  }

  callback(null, {message: 'User succesfully updated', user: currentUser});
};

RPCMethods.delete = (params, essence, callback) => {
  if (!params.id) {
    callback(RPCMethods.errorInstance('Property \'id\' is undefined', 400));
    return;
  }

  const currentUser = essence.find(user => user.id === Number(params.id));
  const currentUserIndex = essence.indexOf(currentUser);


  if (!currentUser) {
    callback(RPCMethods.errorInstance('User not found', 404));
    return;
  }

  essence.splice(currentUserIndex, 1);

  callback(null, {message: `User with ID${params.id} deleted`, user: currentUser});
};

module.exports = RPCMethods;