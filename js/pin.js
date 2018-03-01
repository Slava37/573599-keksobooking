'use strict';

window.pin = (function () {

  var WIDTH_PIN = 40;
  var HEIGHT_TIP_OF_PIN = 18;
  var MAP_MAX_TOP = 150;
  var MAP_MAX_BOTTOM = 500;
  var MAP_WIDTH = 1200;
  var START_POSITION_X = 600;
  var START_POSITION_Y = 353;
  var MAX_HOUSES = 5;

  var mainPinElement = window.mapElement.querySelector('.map__pin--main');
  var addressElement = document.getElementById('address');
  var pinImageElement = mainPinElement.querySelector('.main__pin--image');
  var buttonTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinsElement = window.mapElement.querySelector('.map__pins');

  var position = getStartPositionPinAddress();

  // Реализация передвижения метки.
  pinImageElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if ((mainPinElement.offsetTop - shift.y) < MAP_MAX_BOTTOM && (mainPinElement.offsetTop - shift.y) > MAP_MAX_TOP) {
        mainPinElement.style.top = (mainPinElement.offsetTop - shift.y) + 'px';
      }
      if ((mainPinElement.offsetLeft - shift.x) < MAP_WIDTH && (mainPinElement.offsetLeft - shift.x) > 0) {
        mainPinElement.style.left = (mainPinElement.offsetLeft - shift.x) + 'px';
      }
      position = (mainPinElement.offsetLeft - shift.x) + ', ' + (mainPinElement.offsetTop - shift.y);
      addressElement.value = ((mainPinElement.offsetLeft - shift.x) + ', ' + (mainPinElement.offsetTop + HEIGHT_TIP_OF_PIN - shift.x));
    }

    // Обработка отпускания кнопки мыши при перетаскивании, появляется активное окно.
    function onMouseUp() {
      window.enableForm();
      addressElement.value = position;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

  });

  var setMainPinOnStart = function () {
    mainPinElement.style.left = START_POSITION_X + 'px'; // ставим метку на стартовую позицию.
    mainPinElement.style.top = START_POSITION_Y + 'px';
  };

  function getStartPositionPinAddress() {
    return START_POSITION_X + ', ' + START_POSITION_Y;
  }

  // Удаляет метки.
  function removePins() {
    var currentPinsElement = document.querySelector('.map__pins').getElementsByTagName('button');
    var pinsArrLength = currentPinsElement.length;
    for (var i = 1; i < pinsArrLength; i++) {
      currentPinsElement[0].parentNode.removeChild(currentPinsElement[1]); // Удаляем метки, кроме главной.
    }
  }

  // Возаращает новую метку, созданный на основе данных параметра (объекта).
  function createButtonsPin(house) {
    var pinElement = buttonTemplate.cloneNode(true);
    pinElement.querySelector('img').src = house.author.avatar;

    pinElement.style.left = house.location.x + 'px';

    pinElement.style.top = (house.location.y - WIDTH_PIN) + 'px';
    pinElement.classList.add('fragments');

    // Добавляем обработчик и создание карточки для дома.
    pinElement.addEventListener('click', function () {
      window.showCard(house);
    });
    return pinElement;
  }

  // Возвращает фрагмент, созданный из массива меток.
  function makeFragmentPins(houses) {
    var lengthArr = MAX_HOUSES < houses.length ? MAX_HOUSES : houses.length;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < lengthArr; i++) {
      var newPin = createButtonsPin(houses[i]);
      fragment.appendChild(newPin);
    }
    return fragment;
  }
  // При успешном загрузке данных с сервера мы экспортируем экземпляр данных.
  window.renderPins = function () {
    var data = window.newData.slice();
    pinsElement.appendChild(makeFragmentPins(window.filter.apply(data))); // Поставили метки обьявлений.

    window.setFiltersDisabled(false);

    // Передаем функцию отрисовки пинов в модуль filter.js чере коллбек.
    window.filter.setCallback(function () {
      pinsElement.appendChild(makeFragmentPins(window.filter.apply(data)));
    });
  };
  return {
    getStartPositionPinAddress: getStartPositionPinAddress,
    removePins: removePins,
    setMainPinOnStart: setMainPinOnStart
  };
})();
