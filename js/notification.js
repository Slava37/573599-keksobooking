'use strict';

(function () {

  var TIME_OUT_MESSAGE = 5000;

  var setMessageProperty = function (message, color, height) {
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
    node.style.height = height;
    node.textContent = message;
    node.style.color = color;
    document.body.insertAdjacentElement('afterbegin', node);
    // Сообщение исчезает спустя время.
    setTimeout(function () {
      node.parentNode.removeChild(node);
    }, TIME_OUT_MESSAGE);
  };

  window.showInfo = function (message) {
    setMessageProperty(message, 'green', '40px');
  };

  window.showError = function (message) {
    setMessageProperty(message, 'red', '130px');
  };
})();
