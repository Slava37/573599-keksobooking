'use strict';

(function () {
  var TIME_OUT_MESSAGE = 5000;
  var INFO_HEIGHT = '40px';
  var ERROR_HEIGHT = '130px';

  var setMessageProperty = function (message, color, height) {
    // Если сообщение сущетвует, то оно удаляется, и создается новое при новом запросе.
    var currentNodeElement = document.querySelector('#notification');
    if (currentNodeElement !== null) {
      currentNodeElement.parentNode.removeChild(currentNodeElement);
    }
    var nodeElement = document.createElement('div');
    nodeElement.id = 'notification';
    nodeElement.style = 'border-radius: 8px; z-index: 10; padding-top: 5px; text-align: center; background-color: white; box-shadow: 10px 10px 0 rgba(0, 0, 0, .25);';
    nodeElement.style.position = 'fixed';
    nodeElement.style.fontSize = '28px';
    nodeElement.style.left = '10%';
    nodeElement.style.top = '2%';
    nodeElement.style.width = '150px';
    nodeElement.style.height = height;
    nodeElement.textContent = message;
    nodeElement.style.color = color;
    document.body.insertAdjacentElement('afterbegin', nodeElement);
    // Сообщение исчезает спустя время.
    setTimeout(function () {
      nodeElement.parentNode.removeChild(nodeElement);
    }, TIME_OUT_MESSAGE);
  };

  var showInfo = function (message) {
    setMessageProperty(message, 'green', INFO_HEIGHT);
  };

  var showError = function (message) {
    setMessageProperty(message, 'red', ERROR_HEIGHT);
  };
  window.notification = {
    showInfo: showInfo,
    showError: showError
  };
})();
