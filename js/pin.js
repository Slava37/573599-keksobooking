'use strict';

window.pin = (function () {

  var WIDTH_PIN = 40; // position: absolute;
  var HEIGHT_PIN = 44; // top: 100%; left: 50%;
  var HEIGHT_TIP_OF_PIN = 18; // border-top-width: 22px - 4px

  var mainPin = document.querySelector('.map').querySelector('.map__pin--main');

  var START_POSITION_X = mainPin.offsetLeft;
  var START_POSITION_Y = mainPin.offsetTop - HEIGHT_PIN / 2;

  var AMOUNT_HOUSES = 8;
  var MAP_MAX_TOP = 150;
  var MAP_MAX_BOTTOM = 500;
  var MAP_WIDTH = document.querySelector('.map__pins').offsetWidth;

  var buttonTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapFilterContainer = document.querySelector('.map__filters-container');
  var userDialog = document.querySelector('.map');
  var pinImage = mainPin.querySelector('.main__pin--image');

  var position;

  // Реализация передвижения метки.
  pinImage.addEventListener('mousedown', function (evt) {
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


      if ((mainPin.offsetTop - shift.y) < MAP_MAX_BOTTOM && (mainPin.offsetTop - shift.y) > MAP_MAX_TOP) {
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      }
      if ((mainPin.offsetLeft - shift.x) < MAP_WIDTH && (mainPin.offsetLeft - shift.x) > 0) {
        mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      }
      position = (mainPin.offsetLeft - shift.x) + ', ' + (mainPin.offsetTop - shift.y);
      window.forms.address.value = ((mainPin.offsetLeft - shift.x) + ', ' + (mainPin.offsetTop + window.pin.getHeightTipOfPin() - shift.x));
      window.forms.address.value = position;
    }
    // Обработка отпускания кнопки мыши при перетаскивании, появляется активное окно.

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      upEvt.preventDefault();
      userDialog.classList.remove('map--faded'); // Сняли класс у активной карты.
      window.forms.form.querySelectorAll('fieldset').forEach(function (value) {
        value.removeAttribute('disabled'); // Сняли disabled у всех тегов fieldset.address.attributes.setNamedItem('disabled');
      });
      window.forms.form.classList.remove('notice__form--disabled'); // Сняли disabled у всей формы объявления.
      window.forms.address.setAttribute('disabled', true); // Поле адреса всегда недоступно.

      // Устанавливаем координаты адреса, на конце метки.
      window.forms.address.value = position;
      var newHouses = window.data.genHouses(AMOUNT_HOUSES); // Создали новый массив домов.
      window.pin.removePins(); // Удалили старые метки.
      userDialog.querySelector('.map__pins').appendChild(window.pin.makeFragmentPins(newHouses)); // Поставили метки обьявлений.

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

  });

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
      var newPin = createButtonsPin(houses[i]);
      fragment.appendChild(newPin);
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
