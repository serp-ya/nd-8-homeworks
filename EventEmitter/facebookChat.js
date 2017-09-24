'use_strict';
const ChatApp = require('./chatApp');

const facebookChat =  new ChatApp('=========facebook');
facebookChat.on('message', chatOnMessage);

// Закрыть фейсбук
setTimeout( ()=> {
  console.log('Закрываю фейсбук, все внимание — вебинару!');
facebookChat.removeListener('message', chatOnMessage);
}, 15000 );

module.exports = facebookChat;