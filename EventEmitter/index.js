'use_strict';
const webinarChat  = require('./webinarChat');
const facebookChat = require('./facebookChat');
const vkChat       = require('./vkChat');

// Part 1
// Использовал метод prependListener, т.к. иначе
// сообщение о подготовке ответа будет появляться
// после надписи ping-pong
webinarChat.prependListener('message', sayPrepare);
vkChat.prependListener('message', sayPrepare);

vkChat.setMaxListeners(2);

function sayPrepare() {
  console.log('Готовлюсь к ответу');
}

// Part 2
vkChat.on('close', () => console.log('Чат вконтакте закрылся :('));
vkChat.close();

// Additional part
setTimeout(() => {
  webinarChat.removeListener('message', chatOnMessage);
}, 1000 * 1);