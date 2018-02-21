'use strict';

window.backend = (function () {

  // Функция загрузки данных формы на сервер Академии.
  function upload(data, onLoad, onError) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onLoad();
          break;
        default:
          onError('Ответ сервера: ' + xhr.status + ' ' + xhr.statusText);
      }
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 10000; // 10s
    });
    xhr.open('POST', 'https://js.dump.academy/keksobooking');

    xhr.send(data);
  }


  // Функция загрузки данных с сервера Академии.
  function load(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        default:
          onError('Ответ сервера: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
    xhr.send();
  }

  var onErrorMessage = function (message) {
    var node = document.createElement('div');
    node.style = 'z-index: 10; padding-top: 5px; text-align: center; background-color: white; box-shadow: 10px 10px 0 rgba(0, 0, 0, .25);';
    node.style.position = 'absolute';
    node.style.fontSize = '28px';
    node.style.left = '10%';
    node.style.top = '2%';
    node.style.width = '150px';
    node.style.height = '100px';

    node.textContent = message;
    document.body.insertAdjacentElement('afterbegin', node);

  };
  return {
    upload: upload,
    onErrorMessage: onErrorMessage,
    load: load
  };
})();
