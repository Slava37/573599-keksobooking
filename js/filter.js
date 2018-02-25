'use strict';

window.filter = (function () {
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
    updatePins: updatePins
  };
})();
