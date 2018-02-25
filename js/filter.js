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
    window.debounce.setValue(window.backend.load(window.notification.onSuccess, window.backend.onErrorMessage));
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
  function filterPins(houses) {

    var afterFilter = houses.filter(function (house) {
      var boolPrice;
      switch (price) {
        case 'any':
          boolPrice = true;
          break;
        case 'low':
          boolPrice = house.offer.price < 10000;
          break;
        case 'middle':
          boolPrice = house.offer.price >= 10000 && house.offer.price < 50000;
          break;
        case 'high':
          boolPrice = house.offer.price >= 50000;
          break;
      }
      var boolType = type === 'any' ? true : house.offer.type === type;
      var boolRooms = rooms === 'any' ? true : house.offer.rooms === Number(rooms);
      var boolGuests = guests === 'any' ? true : house.offer.guests === Number(guests);
      var boolWifi = wifi === false ? true : house.offer.features.join(' ').includes('wifi');
      var boolDishwasher = dishwasher === false ? true : house.offer.features.join(' ').includes('dishwasher');
      var boolParking = parking === false ? true : house.offer.features.join(' ').includes('parking');
      var boolWasher = washer === false ? true : house.offer.features.join(' ').includes('washer');
      var boolElevator = elevator === false ? true : house.offer.features.join(' ').includes('elevator');
      var boolConditioner = conditioner === false ? true : house.offer.features.join(' ').includes('conditioner');

      return boolPrice && boolType && boolRooms && boolGuests && boolWifi && boolDishwasher && boolParking && boolWasher && boolElevator && boolConditioner;
    });
    return afterFilter;
  }

  return {
    filterPins: filterPins
  };
})();
