'use_strict';
const ChatApp = require('./chatApp');

const webinarChat =  new ChatApp('webinar');
webinarChat.on('message', chatOnMessage);

module.exports = webinarChat;