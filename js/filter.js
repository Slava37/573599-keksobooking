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

  // Коллбек для функции отрисовки пинов.
  var onFilterChangeExternal = null;

  // Найдем в DOM родительский элемент всех фильтров...
  var mapFilters = document.querySelector('.map__filters');

  // Фильтры должны быть доступны только после загрузке данных с сервера и отрисовки пинов.
  window.setFiltersDisabled = function (bool) {
    var selects = mapFilters.querySelectorAll('select');
    var fieldset = mapFilters.querySelector('fieldset');
    if (bool === true) {

      selects.forEach(function (value) {
        value.setAttribute('disabled', true);
      });
      fieldset.setAttribute('disabled', true);
    } else {
      selects.forEach(function (value) {
        value.removeAttribute('disabled', true);
      });
      fieldset.removeAttribute('disabled');
    }
  };
  function onFilter() {
    window.card.hideCard();
    window.pin.removePins();
    if (typeof onFilterChangeExternal === 'function') {
      window.callDebounce(onFilterChangeExternal);
    }
  }
  // ...и добавим им обработчик, используя делегирование.
  mapFilters.addEventListener('change', function (evt) {
    var target = evt.target;
    if (target !== mapFilters) {
      switch (target.id) {
        case 'housing-type':
          type = target.value;
          onFilter();
          break;
        case 'housing-price':
          price = target.value;
          onFilter();
          break;
        case 'housing-rooms':
          rooms = target.value;
          onFilter();
          break;
        case 'housing-guests':
          guests = target.value;
          onFilter();
          break;
        case 'filter-wifi':
          wifi = target.checked;
          onFilter();
          break;
        case 'filter-dishwasher':
          dishwasher = target.checked;
          onFilter();
          break;
        case 'filter-parking':
          parking = target.checked;
          onFilter();
          break;
        case 'filter-washer':
          washer = target.checked;
          onFilter();
          break;
        case 'filter-elevator':
          elevator = target.checked;
          onFilter();
          break;
        case 'filter-conditioner':
          conditioner = target.checked;
          onFilter();
          break;
      }
      target = target.parentNode;
    }
  });

  // Функция, возращающая результат фильтрации.
  function filterPins(houses) {
    return houses.filter(function (house) {
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
  }

  return {
    apply: filterPins,
    setCallback: function (fn) {
      onFilterChangeExternal = fn;
    }
  };
})();
