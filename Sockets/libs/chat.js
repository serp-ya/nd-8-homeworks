const server = require('./server');
const chat = require('socket.io')(server);

// Список, создание комнат и имя главной комнаты
const rooms = {};
const mainRoomName = 'main room';
makeRoom('Основная комната', mainRoomName);

function makeRoom(title = 'Без названия', roomName) {
  if (!roomName) {
    throw new Error('Room Name is undefined!');
    return;
  }

  const room = {
    title: title,
    usersCounter: 0
  };
  rooms[roomName] = room;
  return roomName;
}

chat.on('connection', (socket) => {
  let userAddedFlag = false;
  let currentRoom = mainRoomName; // При входе, добавлять пользователя в главную комнату

  // Добавление пользователя
  socket.on('add user', ({username, avatarSrc}) => {
    if (userAddedFlag) return;

    socket.username = username;
    socket.avatarSrc = avatarSrc;
    userAddedFlag = true;

    joinRoom(currentRoom);
    socket.emit('update rooms', {
      roomsList: makeRoomsMap(rooms),
      currentRoom: currentRoom
    });
  });

  // Получение сообщений и отправка его всем, кроме отправителя
  // Собственное сообщение добавляется клиентом
  socket.on('new message', message => {
    const messageData = {
      text: message,
      userName: socket.username,
      userAvatarSrc: socket.avatarSrc
    };

    socket.broadcast.to(currentRoom).emit('take message', messageData);
  });

  // Созданние новой комнаты на сервере и на клиенте у всех пользователей
  // Автоматический вход в новую комнату создателем
  socket.on('make new room', roomTitle => {
    leaveRoom(currentRoom);

    const newRoomName = `room-${Object.keys(rooms).length}`;
    currentRoom = makeRoom(roomTitle, newRoomName);

    // Обновляем список комнат у всех, кроме создателя
    // Используя флаг notSelfFlag, запрещаем менять выбранную
    // комнату в списке
    socket.broadcast.emit('update rooms', {
      roomsList: makeRoomsMap(rooms),
      currentRoom: currentRoom,
      notSelfFlag: true
    });

    // Обновляем список комнат у данного пользователя
    socket.emit('update rooms', {
      roomsList: makeRoomsMap(rooms),
      currentRoom: currentRoom
    });

    joinRoom(currentRoom);
  });

  // Событие смены комнаты при клике по пунктам списка слева
  socket.on('change room', roomName => {
    leaveRoom(currentRoom);
    currentRoom = roomName;

    joinRoom(currentRoom);
    socket.emit('update rooms', {
      roomsList: makeRoomsMap(rooms),
      currentRoom: currentRoom
    });
  });

  // Событие выхода или перезагрузки страницы
  socket.on('disconnect', () => {
    if (userAddedFlag) {
      leaveRoom(currentRoom);
    }
  });

  function joinRoom(roomName) {
    const usersInRoom = ++rooms[roomName].usersCounter;
    socket.join(roomName);

    socket.broadcast.to(roomName).emit('user joined', socket.username);
    chat.to(roomName).emit('login', usersInRoom);
  }

  function leaveRoom(roomName) {
    const usersInRoom = --rooms[roomName].usersCounter;
    socket.leave(roomName);

    chat.to(roomName).emit('logout', {
      usersCount: usersInRoom,
      userName: socket.username
    });
  }
});

// Форматирование списка комнат для отправки на клиент
// При отправке сущности Map, приходил пустой объект, не смог понять, почему...
function makeRoomsMap(roomsList) {
  const roomMap = {};
  const roomNames = Object.keys(roomsList);
  roomNames.forEach(name => {
    roomMap[name] = roomsList[name].title;
  });

  return roomMap;
}

module.exports = chat;