const usersList = require('./data/users.json');
const server = require('./libs/server');
const port = process.env.PORT || process.env.LOCAL_SERVER_PORT || 3000;

const restApiInit = require('./libs/rest-api');
const rpcApiInit = require('./libs/rpc-api');
const superTask = require('./libs/super-task');

restApiInit(server, usersList); // usersList используется, как замыкание,
rpcApiInit(server, usersList); // чтобы сохранять промежуточный результат
superTask(server, usersList);

server.listen(port);