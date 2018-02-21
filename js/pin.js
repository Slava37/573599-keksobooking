'use strict';

window.pin = (function () {

  var buttonTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapFilterContainer = document.querySelector('.map__filters-container');

  var WIDTH_PIN = 40; // position: absolute;
  var HEIGHT_PIN = 44; // top: 100%; left: 50%;
  var HEIGHT_TIP_OF_PIN = 18; // border-top-width: 22px - 4px

  var mainPin = document.querySelector('.map').querySelector('.map__pin--main');

  var START_POSITION_X = mainPin.offsetLeft;
  var START_POSITION_Y = mainPin.offsetTop - HEIGHT_PIN / 2;

  var setMainPinOnStart = function () {
    mainPin.style.left = START_POSITION_X + 'px'; // ставим метку на стартовую позицию.
    mainPin.style.top = START_POSITION_Y + 'px';
  };

  function getHeightPin() {
    return HEIGHT_PIN;
  }
  function getWidthPin() {
    return WIDTH_PIN;
  }
  function getHeightTipOfPin() {
    return HEIGHT_TIP_OF_PIN;
  }
  function getStartPositionPinAddress() {
    return START_POSITION_X + ', ' + START_POSITION_Y;
  }

  // Удаляет метки.
  function removePins() {
    var pins = document.querySelector('.map__pins').getElementsByTagName('button');
    var pinsArrLength = pins.length;
    for (var i = 1; i < pinsArrLength; i++) {
      pins[0].parentNode.removeChild(pins[1]); // Удаляем метки, кроме главной.
    }
  }
  /*
 * Возаращает новую метку, созданный на основе данных параметра (объекта).
 */
  function createButtonsPin(house) {
    var pinElement = buttonTemplate.cloneNode(true);
    pinElement.querySelector('img').src = house.author.avatar;

    pinElement.style.left = house.location.x + 'px';

    pinElement.style.top = (house.location.y - WIDTH_PIN) + 'px';
    pinElement.classList.add('fragments');

    // Добавляем обработчик и создание карточки для дома.
    pinElement.addEventListener('click', function () {
      var fragmentCard = document.createDocumentFragment();
      fragmentCard.appendChild(window.card.createMapCard(house));
      var popup = document.getElementById('new_card');
      if (popup !== null) {
        popup.parentNode.removeChild(popup);
      }
      document.querySelector('.map').insertBefore(fragmentCard, mapFilterContainer);
    });
    return pinElement;
  }
  /*
   * Возвращает фрагмент, созданный из массива меток.
   */
  function makeFragmentPins(houses) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < houses.length; i++) {
      var pin = createButtonsPin(houses[i]);
      fragment.appendChild(pin);
    }
    return fragment;
  }

  return {
    getHeightPin: getHeightPin,
    getWidthPin: getWidthPin,
    getHeightTipOfPin: getHeightTipOfPin,
    makeFragmentPins: makeFragmentPins,
    getStartPositionPinAddress: getStartPositionPinAddress,
    removePins: removePins,
    setMainPinOnStart: setMainPinOnStart,
    mainPin: mainPin
  };
})();
