'use_strict';
const EventEmitter = require('events');

class ChatApp extends EventEmitter {
  /**
   * @param {String} title
   */
  constructor(title) {
    super();

    this.title = title;

    // Посылать каждую секунду сообщение
    setInterval(() => {
      this.emit('message', `${this.title}: ping-pong`);
  }, 1000);
  }

  // Part 2 task
  close() {
    this.emit('close');
    this.removeAllListeners('message'); // В задании не требовалось, но это логично
  }
}

const chatOnMessage = (message) => {
  console.log(message);
};

global.chatOnMessage = chatOnMessage;

module.exports = ChatApp;