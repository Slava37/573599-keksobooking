'use strict';

window.backend = (function () {

  var TIME_OUT_SERVER = 10000;
  var SUCCESS_STATUS = 200;

  // Реализация запроса к серверу в зависимости от типа запроса.
  function makeRequest(type, url, data, onLoad, onMessage) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case SUCCESS_STATUS:
          if (type === 'POST') {
            onLoad();
            onMessage('Успешно!\nОтвет сервера: ' + xhr.status + ' ' + xhr.statusText);
          } else {
            onLoad(xhr.response);
          }
          break;
        default:
          onMessage('Oшибка!\nОтвет сервера: ' + xhr.status + ' ' + xhr.statusText);
      }

    });

    xhr.addEventListener('error', function () {
      onMessage('Произошла ошибка соединения');

    });
    xhr.addEventListener('timeout', function () {
      onMessage('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIME_OUT_SERVER; // 10s

    xhr.open(type, url);

    if (type === 'POST') {
      xhr.send(data);
    } else if (type === 'GET') {
      xhr.send();
    }
  }
  // Функция загрузки данных формы на сервер Академии.
  function upload(data, onLoad, onMessage) {
    makeRequest('POST', 'https://js.dump.academy/keksobooking', data, onLoad, onMessage);
  }

  // Функция загрузки данных с сервера Академии.
  function load(onLoad, onMessage) {
    makeRequest('GET', 'https://js.dump.academy/keksobooking/data', null, onLoad, onMessage);
  }
  // Создаем новый массив домов и заполняем его данными с сервера.
  load(window.notification.onSuccess, window.notification.onMessage);

  return {
    upload: upload,
    load: load
  };
})();
