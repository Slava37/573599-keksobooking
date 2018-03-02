'use strict';

(function () {

  var TIME_OUT_SERVER = 10000;
  var SUCCESS_STATUS = 200;
  // Будет часто использоваться в других модулях, для удобства определим для глобальной области видимости.
  window.mapElement = document.querySelector('.map');

  // Реализация запроса к серверу в зависимости от типа запроса.
  var makeRequest = function (type, url, data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case SUCCESS_STATUS:
          if (type === 'POST') {
            onLoad('Успешно!');
          } else {
            window.newData = xhr.response;
            window.pin.renderAll();
          }
          break;
        default:
          onError('Oшибка!\nОтвет сервера: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = TIME_OUT_SERVER; // 10s
    xhr.open(type, url);

    if (type === 'POST') {
      xhr.send(data);
    } else if (type === 'GET') {
      xhr.send();
    }
  };
  // Функция загрузки данных формы на сервер Академии.
  var upload = function (data, onLoad, onError) {
    makeRequest('POST', 'https://js.dump.academy/keksobooking', data, onLoad, onError);
  };

  // Функция загрузки данных с сервера Академии.
  var load = function (onError) {
    makeRequest('GET', 'https://js.dump.academy/keksobooking/data', null, null, onError);
  };
  window.backend = {
    load: load,
    upload: upload
  };
})();
