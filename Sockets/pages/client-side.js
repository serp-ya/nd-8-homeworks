const socket = io();

// DOM-elements
const mainContainer = document.querySelector('.container.bootstrap.snippet');

//// Login form elements
const loginWrapper = document.querySelector('.login-wrapper');
const usernameInput = document.querySelector('input.username-input');
const avatars = document.querySelectorAll('.avatar-block img');
const submitUsernameBtn = document.querySelector('.submit-login');
const loginFormErrorBox = document.querySelector('.login-wrapper .error-box');

//// Chat elements
const chatBox = document.querySelector('ul.chat');
const chatMessagesBox = document.querySelector('.chat-message');
const textInput = document.querySelector('.input-group input');
const submitMessageBtn = document.querySelector('button.btn-success');
const informMessage = document.createElement('li');
informMessage.classList.add('inform');

//// Rooms elements
const roomsListBox = document.querySelector('.rooms-list');
const addRoomBtn = document.querySelector('.add-room-btn');
const createRoomModal = document.querySelector('.create-new-room');
const createRoomErrorBox = document.querySelector('.create-new-room .error-box');
const createRoomInput = document.querySelector('.room-name-input');
const createRoomBtn = document.querySelector('.submit-room-name');

//// Sound Elements
const notificationSound = document.getElementById('meow');
const soundOff = document.querySelector('.sound-off');
const soundOn = document.querySelector('.sound-on');


// События сокета
//// Уведомления о добавлении конкретного пользователя
socket.on('user joined', newUserName => {
  const messageElement = informMessage.cloneNode();
  messageElement.textContent = `В комнату добавлен пользователь: ${newUserName}`;
  chatBox.appendChild(messageElement);
  scrollMessagesBox();
});

//// Уведомление о количестве пользователей
socket.on('login', usersCounter => {
  const messageElement = informMessage.cloneNode();
  messageElement.textContent = `Пользователей в комнате: ${usersCounter}`;
  chatBox.appendChild(messageElement);
  scrollMessagesBox();
});

//// Уведомление о выходе конкретного пользователя
socket.on('logout', ({usersCount, userName}) => {
  const userNameMessage = informMessage.cloneNode();
  const usersCountMessage = informMessage.cloneNode();
  userNameMessage.textContent = `Пользователь ${userName} покинул комнату`;
  usersCountMessage.textContent = `Пользователей в комнате: ${usersCount}`;

  [userNameMessage, usersCountMessage].forEach(node => chatBox.appendChild(node));
  scrollMessagesBox();
});

//// Принимаем сообщение
socket.on('take message', ({text, userName, userAvatarSrc}) => {
  const incomingMessage = fetch('./blocks/another-user-msg.json');
  incomingMessage
    .then(res => res.json())
    .then(res => {
      const data = {
        username: userName,
        avatarSrc: userAvatarSrc,
        text: text
      };

      const message = createMessage(res, data);
      chatBox.appendChild(message);
      scrollMessagesBox();
    })
    .catch(console.error);
    meow.play();
});

//// Обновляем список доступных комнат
socket.on('update rooms', ({roomsList, currentRoom, notSelfFlag}) => {
  // notSelfFlag ипользуется когда кто-то другой добавляет комнату
  // и запрещает менять у других пользователей выбранную комнату в списке
  if (notSelfFlag) {
    currentRoom = document.querySelector('.bounceInDown.active').dataset.roomName;
  }

  // Очистить список комнат
  Array.from(roomsListBox.children).forEach(child => child.remove());

  // Заполнить список комнат
  Object.keys(roomsList).forEach(roomName => {
    const roomTitle = roomsList[roomName];
    const roomTemplate = fetch('./blocks/room.json');
    roomTemplate
      .then(res => res.json())
      .then(res => {
        const roomNode = JSONTemplateEngine(res);
        const roomLabel = roomNode.querySelector('.room-name strong');

        if (roomName === currentRoom) {
          roomNode.classList.add('active');
          roomNode.addEventListener('click', e => e.preventDefault())
        } else {
          roomNode.addEventListener('click', changeRoom);
        }

        roomNode.dataset.roomName = roomName;
        roomLabel.textContent = roomTitle;
        roomsListBox.appendChild(roomNode);
      })
      .catch(console.error)
  });
});


// Браузерные события
//// Выбор аватара
window.addEventListener('DOMContentLoaded', () => {
  avatars.forEach(avatar => avatar.addEventListener('click', event => {
    const selectedAvatar = document.querySelector('.avatar-block img.selected');
    if (selectedAvatar) {
      selectedAvatar.classList.remove('selected');
    }
    event.currentTarget.classList.add('selected');
  }));
});

//// Отправка username на сервер и сохранение данных пользователя на клиенте
window.addEventListener('DOMContentLoaded', () => {
  submitUsernameBtn.addEventListener('click', event => {
    event.preventDefault();
    const username = usernameInput.value;
    const avatar = document.querySelector('.avatar-block img.selected');

    if (!username) {
      loginFormErrorBox.textContent = 'Ошибка! Введите логин';
      window.scrollTo(0,0);
      return;
    }

    if (!avatar) {
      loginFormErrorBox.textContent = 'Ошибка! Выберите аватар';
      window.scrollTo(0,0);
      return;
    }
    // Сохранение данных о самом себе в локальном хранилище
    localStorage.username = username;
    localStorage.avatarSrc = avatar.src;

    const userData = {
      username: username,
      avatarSrc: avatar.src
    };

    socket.emit('add user', userData);
    loginWrapper.classList.add('hidden');
    mainContainer.classList.remove('hidden');
  })
});

//// Отправка сообщения из строки ввода
window.addEventListener('DOMContentLoaded', () => {
  // Отправка по кнопке
  submitMessageBtn.addEventListener('click', (event) => {
    event.preventDefault();
    sendMessage();
  });

  // Отправка при нажатии Enter
  window.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });

  // Функция отправки на сервер и добавлении в свой чат
  function sendMessage() {
    const messageText = textInput.value;

    if (messageText) {
      appendSelfMessage(messageText);

      socket.emit('new message', messageText);
      textInput.value = "";
    }
  }

  // Добавление своего сообщения себе в чат
  function appendSelfMessage(text) {
    const outgoingMessage = fetch('./blocks/current-user-msg.json');
    outgoingMessage
      .then(res => res.json())
      .then(res => {
        const data = {
          username: localStorage.username,
          avatarSrc: localStorage.avatarSrc,
          text: text
        };

        const message = createMessage(res, data);
        chatBox.appendChild(message);
        scrollMessagesBox();
      })
      .catch(console.error);
  }
});

//// Модальное окно "Создать новую комнату"
window.addEventListener('DOMContentLoaded', () => {
  addRoomBtn.addEventListener('click', event => {
    event.preventDefault();
    openModal();
  });

  createRoomModal.addEventListener('click', event => {
    if (event.target === createRoomModal) {
      closeModal();
    }
  })
});

//// Создание новой комнаты
window.addEventListener('DOMContentLoaded', () => {
  createRoomBtn.addEventListener('click', event => {
    event.preventDefault();
    const newRoomName = createRoomInput.value;

    if (newRoomName) {
      cleanMessages();
      closeModal();
      socket.emit('make new room', newRoomName);
    } else {
      createRoomErrorBox.textContent = 'Введите название новой комнаты';
    }
  });
});

//// Управление звуком уведомлений
window.addEventListener('DOMContentLoaded', () => {
  soundOn.addEventListener('click', () => {
    notificationSound.volume = 0.1;
    soundOn.classList.add('hidden');
    soundOff.classList.remove('hidden');
  });

  soundOff.addEventListener('click', () => {
    notificationSound.volume = 0.0;
    soundOff.classList.add('hidden');
    soundOn.classList.remove('hidden');
  });


});


// Создание HTML тела сообщения
function createMessage(template, data) {
  const messageNode = JSONTemplateEngine(template);
  const avatarNode = messageNode.querySelector('.chat-img img');
  const userNameNode = messageNode.querySelector('.header strong');
  const messageBoxNode = messageNode.querySelector('.chat-body p');

  avatarNode.src = data.avatarSrc;
  userNameNode.textContent = data.username;
  messageBoxNode.textContent = data.text;

  return messageNode;
}

// Прокрутка сообщений к последнему
function scrollMessagesBox() {
  const toScrollPoint = chatMessagesBox.scrollHeight;
  chatMessagesBox.scrollTo(0, toScrollPoint);
}

// Обработка нажатия на кнопку кномнаты
function changeRoom(event) {
  event.preventDefault();
  cleanMessages();
  const targetRoomName = event.currentTarget.dataset.roomName;

  socket.emit('change room', targetRoomName);
}

// Работа модального окна
function openModal() {
  document.body.classList.add('modal-open');
  createRoomModal.classList.add('active');
}

function closeModal() {
  document.body.classList.remove('modal-open');
  createRoomModal.classList.remove('active');
}

// Очистить чат от сообщений
function cleanMessages() {
  Array.from(chatBox.children).forEach(child => child.remove())
}

// Шаблонизатор
function JSONTemplateEngine(data) {
  if (typeof data === 'string') {
    return document.createTextNode(data);
  } else {
    if (typeof data !== 'object') return;
  }

  var tagName = data.tagName;
  var className = data.className;
  var id = data.id;
  var attributes = data.attributes;
  var content = data.content;
  var element = document.createElement(tagName);

  if (id) {
    element.id = id;
  }

  if (Array.isArray(className)) {
    className.forEach(currentClass => {
      element.classList.add(currentClass);
    })

  } else if (typeof className === 'string') {
    element.classList.add(className);
  }

  if (typeof attributes === 'object') {
    Object.keys(attributes).forEach(function(key) {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (typeof content === 'string') {
    element.innerHTML = content;

  } else if (Array.isArray(content)) {
    content.forEach(function(item) {
      var node = JSONTemplateEngine(item);
      element.appendChild(node);
    });

  } else if (typeof content === 'object') {
    element.appendChild(JSONTemplateEngine(content));
  }

  return element;
}