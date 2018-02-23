'use strict';

window.backend = (function () {

  var TIME_OUT_SERVER = 10000;
  var TIME_OUT_MESSAGE = 5000;
  var SUCCESS_STATUS = 200;
  // Реализация запроса к серверу в зависимости от типа запроса.
  function workXMLHttpRequest(type, url, data, onLoad, onMessage) {
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
      xhr.addEventListener('error', function () {
        onMessage('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onMessage('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = TIME_OUT_SERVER; // 10s
    });
    xhr.open(type, url);

    if (type === 'POST') {
      xhr.send(data);
    } else if (type === 'GET') {
      xhr.send();
    }
  }
  // Функция загрузки данных формы на сервер Академии.
  function upload(data, onLoad, onMessage) {
    workXMLHttpRequest('POST', 'https://js.dump.academy/keksobooking', data, onLoad, onMessage);
  }

  // Функция загрузки данных с сервера Академии.
  function load(onLoad, onMessage) {
    workXMLHttpRequest('GET', 'https://js.dump.academy/keksobooking/data', null, onLoad, onMessage);
  }

  var onErrorMessage = function (message) {
    // Если сообщение сущетвует, то оно удаляется, и создается новое при новом запросе.
    var currentNode = document.getElementById('notification');
    if (currentNode !== null) {
      currentNode.parentNode.removeChild(currentNode);
    }
    var node = document.createElement('div');
    node.id = 'notification';
    node.style = 'border-radius: 8px; z-index: 10; padding-top: 5px; text-align: center; background-color: white; box-shadow: 10px 10px 0 rgba(0, 0, 0, .25);';
    node.style.position = 'fixed';
    node.style.fontSize = '28px';
    node.style.left = '10%';
    node.style.top = '2%';
    node.style.width = '150px';
    node.style.height = '130px';

    node.textContent = message;
    document.body.insertAdjacentElement('afterbegin', node);
    // Cooбщение исчезает спустя время после появления.
    setTimeout(function () {
      node.parentNode.removeChild(node);
    }, TIME_OUT_MESSAGE);
  };
  return {
    upload: upload,
    onErrorMessage: onErrorMessage,
    load: load
  };
})();
