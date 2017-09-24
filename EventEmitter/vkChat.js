'use_strict';
const ChatApp = require('./chatApp');

const vkChat =  new ChatApp('---------vk');
vkChat.on('message', chatOnMessage);

// Закрыть вконтакте
setTimeout( ()=> {
  console.log('Закрываю вконтакте...');
vkChat.removeListener('message', chatOnMessage);
}, 10000 );

module.exports = vkChat;