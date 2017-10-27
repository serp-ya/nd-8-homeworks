// fieldsTranslation - переменная, импортируема из
// файла ./lang/en_ru.js, содержит русификацию некоторых слов
// для перевода полей, получаемых с сервера

// DOM elements
const preloaderBox = document.querySelector('.preloader-box');

//// Контейнеры отображения списка контактов и подробной информации
const contactsList = document.querySelector('.contacts-list');
const contactInfoBlock =  document.querySelector('.contact-info');

//// Элементы формы добавления контактов
const addUserForm = document.getElementById('addUserForm');
const phoneInput = document.getElementById('phoneInput');

// Элементы формы добавления информации
const addInfoForm = document.getElementById('addInfoForm');

//// Блоки вывода ошибок
const contactErrorInfo = document.querySelector('.contact-detail-info .error-info');
const addUserModalErrorInfo = document.querySelector('.add-user-modal .error-info');
const addInfoModalErrorInfo = document.querySelector('.add-info-modal .error-info');


// API
const apiContactsURL = './api/v1/contacts';


// События клиента
//// Загрузка данные при заходе на страницу
window.addEventListener('DOMContentLoaded', () => {
  fetch(apiContactsURL)
    .then(res => res.json())
    .then(dataJSON => {
      updateContactsList(dataJSON);
      preloaderBox.classList.add('hidden');
    })
    .catch(err => console.error(err));
});

//// Отправка добавленного пользователя
window.addEventListener('DOMContentLoaded', () => {
  addUserForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(addUserForm);

    fetch(apiContactsURL, {
      body: serializeFormData(formData),
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(res => {
        if (checkBadStatus(res.status)) {
          throw new Error(`Error: ${res.statusText}`);
        } else {
          return fetch(apiContactsURL);
        }
      })
      .then(res => res.json())
      .then(dataJSON => {
        clearChilds(contactsList);
        updateContactsList(dataJSON);

        addUserModalErrorInfo.textContent = 'Контакт добавлен в список!';
        addUserModalErrorInfo.style.color = 'green';
        asyncClearText(addUserModalErrorInfo);

        const thatFormInputs = addUserForm.querySelectorAll('input');
        Array.from(thatFormInputs).forEach(input => input.value = null);
      })
      .catch(err => {
        addUserModalErrorInfo.textContent = 'Ошибка! Контакт не добавлен!';
        addUserModalErrorInfo.style.color = 'red';
        asyncClearText(addUserModalErrorInfo);
        console.log('error: ', err)
      });
  })
});

//// Отправка добавленной информации
window.addEventListener('DOMContentLoaded', () => {
  addInfoForm.addEventListener('submit', event => {
    event.preventDefault();
    const nameField = addInfoForm.querySelector('input[name="name"]');
    const valueField = addInfoForm.querySelector('input[name="value"]');
    const currentContactID = contactInfoBlock.dataset.contactId;
    const requestUrl = apiContactsURL + `/${currentContactID}?${nameField.value}=${valueField.value}`;

    fetch(requestUrl, {method: 'PUT'})
      .then(res => {
        if (checkBadStatus(res.status)) {
          throw new Error(`Error: ${res.statusText}`);
        }
        nameField.value = null;
        valueField.value = null;

        const singleCrutch = {contactId: currentContactID};
        clearChilds(contactInfoBlock);
        showContactInfo(singleCrutch);
        $('.add-info-modal').modal('hide');
      })
      .catch(err => {
        addInfoModalErrorInfo.textContent = 'Ошибка! Данные не были добавлены';
        addInfoModalErrorInfo.style.color = 'red';
        asyncClearText(addInfoModalErrorInfo);
        console.error(err);
      });
  });
});

//// Валидация ввода номера телефона
window.addEventListener('DOMContentLoaded', () => {
  phoneInput.addEventListener('input', event => {
    phoneInput.value = safeOnlyNumbers(phoneInput.value);
  })
});


// Дополнительные функции
//// Обновляем список контактов в левом стоблце
function updateContactsList(contactsJSON) {
  const contactsFragment = document.createDocumentFragment();
  const boldNode = document.createElement('b');
  const listItem = document.createElement('li');
  listItem.classList.add('contact');

  contactsJSON.forEach(contact => {
    // Создаём список контактов
    const contactItem = listItem.cloneNode();
    const contactSurename = boldNode.cloneNode();

    contactItem.dataset.contactId = contact.id;
    contactItem.textContent = contact.firstname + ' ';
    contactSurename.textContent = contact.surename;

    contactItem.addEventListener('click', showContactInfo);
    contactItem.appendChild(contactSurename);
    contactsFragment.appendChild(contactItem);
  });

  contactsList.appendChild(contactsFragment);
}

//// Отображаем информацию о выбранном контакте в поле подробного описания
function showContactInfo(event) {
  const contactId = event.contactId || event.currentTarget.dataset.contactId;
  clearChilds(contactInfoBlock);

  fetch(apiContactsURL + `/${contactId}`)
    .then(res => res.json())
    .then(contactInfo => {
      // Создаём блок с подробностями о контакте
      const infoFragment = document.createDocumentFragment();

      // Элементы таблицы для данных
      const table = document.createElement('table');
      const tableRow = document.createElement('tr');
      const tableData = document.createElement('td');

      // Контейнер для заголовка и кнопки "удалить"
      const div = document.createElement('div');
      const headerRow = div.cloneNode();
      headerRow.classList.add('row');

      // Заголовок
      const headerContainer = div.cloneNode();
      const header = document.createElement('h4');

      headerContainer.classList.add('col-lg-6');
      header.classList.add('contact-name');
      header.textContent = `${contactInfo.firstname} ${contactInfo.surename}`;
      headerContainer.appendChild(header);

      // Кнопка "удалить"
      const deleteBtnContainer = div.cloneNode();
      const deleteBtn = document.createElement('span');

      deleteBtnContainer.classList.add('col-lg-6', 'text-right');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.textContent = 'Удалить';
      deleteBtn.addEventListener('click', deleteContact);
      deleteBtnContainer.appendChild(deleteBtn);

      // Убираем полученные элементы в общий контейнер headerRow
      [headerContainer, deleteBtnContainer].forEach(el => headerRow.appendChild(el));

      // Кнопка "Добавить информации"
      const btn = document.createElement('button');
      btn.classList.add('btn', 'btn-primary', 'add-info-btn');
      btn.textContent = 'Добавить информации';
      btn.dataset.toggle = 'modal';
      btn.dataset.target = '.add-info-modal';

      Object.keys(contactInfo).forEach(infoKey => {
        // Не показываем пользователю ID контакта
        if (infoKey !== 'id') {
          // Создаем каркас html-элементов
          const infoRow = tableRow.cloneNode();
          const dataName = tableData.cloneNode();
          const dataValue = tableData.cloneNode();

          dataName.classList.add('data-name');
          dataValue.classList.add('data-value');
          infoRow.classList.add('info-row');

          // Сохраняем название поля из базы в data-атрибутах и назначаем событие для изменения поля
          infoRow.dataset.fieldName = infoKey;
          infoRow.addEventListener('click', changeData);

          // Переводим название ключа на русский
          const translatedKey = fieldsTranslation[infoKey];
          dataName.textContent = (translatedKey) ? `${translatedKey}: ` : `${infoKey}: `;

          // Если поле - телефон, то приводим значение к привычному формату +7 (ххх) ххх-хх-хх
          if (infoKey === 'phone') {
            dataValue.textContent = phoneRusFormated(contactInfo[infoKey]);
          } else {
            dataValue.textContent = contactInfo[infoKey];
          }

          [dataName, dataValue].forEach(el => infoRow.appendChild(el));
          table.appendChild(infoRow);
        }
      });

      // Сохраняем ID выбранного пользователя для UPDATE/DELETE операций
      contactInfoBlock.dataset.contactId = contactId;
      [headerRow, table, btn].forEach(el => infoFragment.appendChild(el));
      contactInfoBlock.appendChild(infoFragment);
    })
    .catch(err => {
      contactErrorInfo.textContent = 'Произошла ошибка! Свяжитесь с администратором.';
      asyncClearText(contactErrorInfo);
      console.error(err);
    });
}

//// При изменении контента, очищаем потомков в указанных блоках
function clearChilds(node) {
  const nodeChilds = node.children;

  Array.from(nodeChilds).forEach(el => el.remove());
}

//// Столкнулся с проблемой при пересылке x-www-form-urlencoded данных
//// на сервер, не смог нагуглить или понять, как избавиться от разделителей
//// нашёл только такое решение - переворматировать данные
function serializeFormData(formData) {
  let reqBody = '';
  let count = 0;

  for (const [key, value] of formData) {
    if (!count) {
      reqBody += `${key}=${encodeURIComponent(value)}`;
    } else {
      reqBody += `&${key}=${encodeURIComponent(value)}`;
    }
    count++;
  }

  return reqBody;
}

//// Придание номеру телефона привычного формата
function phoneRusFormated(phone) {
  let formatedPhone = [...phone];
  formatedPhone.splice(9, 0, '-');
  formatedPhone.splice(7, 0, '-');
  formatedPhone.splice(4, 0, ') ');
  formatedPhone.splice(1, 0, ' (');
  return `+${formatedPhone.join('')}`
}

//// Удаление контакта
function deleteContact(event) {
  const contactId = contactInfoBlock.dataset.contactId;
  fetch(apiContactsURL + `/${contactId}`, { method: 'DELETE'})
    .then(res => {
      if (checkBadStatus(res.status)) {
        throw new Error(`Error: ${res.statusText}`);
      }
      clearChilds(contactInfoBlock);
      contactErrorInfo.textContent = 'Пользователь удалён';
      contactErrorInfo.style.color = 'green';
      asyncClearText(contactErrorInfo);

      return fetch(apiContactsURL);
    })
    .then(res => res.json())
    .then(dataJSON => {
      clearChilds(contactsList);
      updateContactsList(dataJSON);
    })
    .catch(err => {
      contactErrorInfo.textContent = 'Ошибка! Свяжитесь с администратором';
      contactErrorInfo.style.color = 'red';
      asyncClearText(contactErrorInfo);
    });
}

//// Чтобы скрывать уведомления об ошибках/успехах через время
function asyncClearText(textNode, time = 3000) {
  setTimeout(() => {
    textNode.textContent = '';
  }, time);
}

//// Обновляем уже существующие данные
function changeData(event) {
  event.currentTarget.removeEventListener('click', changeData);

  const contactID = contactInfoBlock.dataset.contactId;
  const infoRow = event.currentTarget;
  const rowName = event.currentTarget.dataset.fieldName;
  const oldValue = event.currentTarget.querySelector('.data-value').textContent;
  const isItPhone = rowName === 'phone';

  const input = document.createElement('input');
  input.classList.add('data-value');
  input.value = oldValue;

  // if (isItPhone) {
    // input.addEventListener('input', () => {
    //   input.value = safeOnlyNumbers(input.value);
    // })
  // }

  input.addEventListener('blur', () => {
    const newValue = input.value;
    const oldNode = document.createElement('td');
    oldNode.classList.add('data-value');

    if (isItPhone) {
      const phoneNumbers = safeOnlyNumbers(newValue);
      oldNode.textContent = phoneRusFormated(phoneNumbers);
    } else {
      oldNode.textContent = newValue;
    }

    const fullRequest = apiContactsURL + `/${contactID}?${rowName}=${isItPhone ? safeOnlyNumbers(newValue) : newValue}`;

    fetch(fullRequest, {method: 'PUT'})
      .then(res => {
        if (checkBadStatus(res.status)) {
          throw new Error(`Error: ${res.statusText}`);
        }
        infoRow.appendChild(oldNode);
      })
      .catch(err => {
        oldNode.textContent = oldValue;
        infoRow.appendChild(oldNode);

        contactErrorInfo.textContent = 'Ошибка! Данные обновить не удалось';
        contactErrorInfo.style.color = 'red';
        asyncClearText(contactErrorInfo);
        console.error(err);
      });
    input.remove();
    infoRow.addEventListener('click', changeData);
  });

  event.currentTarget.querySelector('td.data-value').remove();
  event.currentTarget.appendChild(input);
  event.currentTarget.querySelector('input.data-value').focus();

  jQuery(function($){
    $('.info-row[data-field-name="phone"] input.data-value').mask('+7 (999) 999-9999');
  });
}

//// Очистка строки от символов, кроме цифр
function safeOnlyNumbers(data) {
  return String(data).replace(/\D+/g, '');
}

//// Проверка статуса ответа
function checkBadStatus(status) {
  return (status < 200 || status > 299);
}