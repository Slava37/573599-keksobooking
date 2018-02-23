'use strict';

window.pin = (function () {

  var WIDTH_PIN = 40;
  var HEIGHT_PIN = 44;
  var HEIGHT_TIP_OF_PIN = 18;
  var MAP_MAX_TOP = 150;
  var MAP_MAX_BOTTOM = 500;
  var MAP_WIDTH = document.querySelector('.map__pins').offsetWidth;
  var START_POSITION_X = document.querySelector('.map').querySelector('.map__pin--main').offsetLeft;
  var START_POSITION_Y = document.querySelector('.map').querySelector('.map__pin--main').offsetTop - HEIGHT_PIN / 2;
  var MAX_HOUSES = 5;

  var mainPin = document.querySelector('.map').querySelector('.map__pin--main');
  var pinImage = mainPin.querySelector('.main__pin--image');
  var buttonTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapFilterContainer = document.querySelector('.map__filters-container');

  var position = getStartPositionPinAddress();

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

    function onMouseUp() {
      window.forms.enableForm();
      window.forms.address.value = position;
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
      window.card.closeButtonCard();
    });
    return pinElement;
  }
  /*
   * Возвращает фрагмент, созданный из массива меток.
   */

  function makeFragmentPins(houses) {
    var lengthArr = MAX_HOUSES < houses.length ? MAX_HOUSES : houses.length;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < lengthArr; i++) {
      var newPin = createButtonsPin(houses[i]);
      fragment.appendChild(newPin);
    }
    return fragment;
  }

  function onSuccess(data) {
    removePins();
    document.querySelector('.map').querySelector('.map__pins').appendChild(makeFragmentPins(updatePins(data))); // Cтавит на карту метки обьявлений.
  }
  // Объявим необходимые для фильтрации переменные.
  var type = 'any';
  var price = 'any';
  var rooms = 'any';
  var guests = 'any';

  var wifi = false;
  var dishwasher = false;
  var parking = false;
  var washer = false;
  var elevator = false;
  var conditioner = false;

  // Найдем в DOM все элементы формы фильтрации...
  var typeFilter = document.getElementById('housing-type');
  var priceFilter = document.getElementById('housing-price');
  var roomsFilter = document.getElementById('housing-rooms');
  var guestsFilter = document.getElementById('housing-guests');
  var featuresFilter = document.querySelector('.map__filters').features;

  function onFilter() {
    window.card.hideCard();
    window.debounce.setValue(window.backend.load(onSuccess, window.backend.onErrorMessage));
  }
  // ...и добавим им обработчики.
  typeFilter.addEventListener('change', function (evt) {
    type = evt.target.value;
    onFilter();
  });
  priceFilter.addEventListener('change', function (evt) {
    price = evt.target.value;
    onFilter();
  });
  roomsFilter.addEventListener('change', function (evt) {
    rooms = evt.target.value;
    onFilter();
  });
  guestsFilter.addEventListener('change', function (evt) {
    guests = evt.target.value;
    onFilter();
  });
  featuresFilter.forEach(function (value) {
    value.addEventListener('change', function (evt) {
      var feature = evt.target;
      switch (feature.value) {
        case 'wifi': wifi = feature.checked;
          break;
        case 'dishwasher': dishwasher = feature.checked;
          break;
        case 'parking': parking = feature.checked;
          break;
        case 'washer': washer = feature.checked;
          break;
        case 'elevator': elevator = feature.checked;
          break;
        case 'conditioner': conditioner = feature.checked;
          break;
      }
      onFilter();
    });
  });

  // Функция, возращающая результат фильтрации.
  function updatePins(houses) {
    var sameType;
    if (type === 'any') {
      sameType = houses;
    } else {
      sameType = houses.filter(function (house) { // Так как нам нужно компоновать фильтры, то мы будет пробегать каждый раз по меньшему массиву.
        return house.offer.type === type;
      });
    }

    // Сдесь вместо возврата, тужно взять sameType и также прогнать через фильтр, и так со всеми полями.
    var samePrice;
    if (price === 'any') {
      samePrice = sameType;
    } else {
      samePrice = sameType.filter(function (house) { // Так как нам нужно компоновать фильтры, то мы будет пробегать каждый раз по меньшему массиву.
        var bool;
        switch (price) {
          case 'low':
            bool = house.offer.price < 10000;
            break;
          case 'middle':
            bool = house.offer.price >= 10000 && house.offer.price < 50000;
            break;
          case 'high':
            bool = house.offer.price >= 50000;
            break;
        }
        return bool;
      });
    }
    var sameRooms;
    if (rooms === 'any') {
      sameRooms = samePrice;
    } else {
      sameRooms = samePrice.filter(function (house) { // Так как нам нужно компоновать фильтры, то мы будет пробегать каждый раз по меньшему массиву.
        return house.offer.rooms === Number(rooms);
      });
    }
    var sameGuests;
    if (guests === 'any') {
      sameGuests = sameRooms;
    } else {
      sameGuests = sameRooms.filter(function (house) {
        return house.offer.guests === Number(guests);
      });
    }

    var sameFeatures = sameGuests.slice(); // При фильтрации необходимо пройти по всем элементам, поэтому создаем новый массив sameFeatures. Он и будет изменяться.

    // Функция берет за параметры фичу, и фильтрует массив sameFeatures.
    function filterFeatures(variable, feature) {
      if (variable === true) {
        sameFeatures = sameFeatures.filter(function (house) {
          return house.offer.features.join(' ').includes(feature);
        });
      }
    }

    if (sameFeatures.length !== 0) {
      filterFeatures(wifi, 'wifi');
      filterFeatures(dishwasher, 'dishwasher');
      filterFeatures(parking, 'parking');
      filterFeatures(washer, 'washer');
      filterFeatures(elevator, 'elevator');
      filterFeatures(conditioner, 'conditioner');
    }
    return sameFeatures;
  }

  return {
    getHeightPin: getHeightPin,
    getWidthPin: getWidthPin,
    getHeightTipOfPin: getHeightTipOfPin,
    onSuccess: onSuccess,
    getStartPositionPinAddress: getStartPositionPinAddress,
    removePins: removePins,
    setMainPinOnStart: setMainPinOnStart,
    mainPin: mainPin
  };
})();
