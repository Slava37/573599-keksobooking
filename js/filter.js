'use strict';

(function () {
  var LOWER_COST_ROOM = 10000;
  var HIGHTER_COST_ROOM = 50000;

  // Коллбек для функции отрисовки пинов.
  var onFilterChangeExternal = null;

  // Найдем в DOM родительский элемент всех фильтров...
  var mapFilters = document.querySelector('.map__filters');

  // Фильтры должны быть доступны только после загрузке данных с сервера и отрисовки пинов.
  var setDisabled = function (bool) {

    var selects = mapFilters.querySelectorAll('select');
    var fieldset = mapFilters.querySelector('fieldset');
    if (bool === true) {

      selects.forEach(function (value) {
        value.setAttribute('disabled', true);
      });
      fieldset.setAttribute('disabled', true);
      mapFilters.reset();
    } else {
      selects.forEach(function (value) {
        value.removeAttribute('disabled', true);
      });
      fieldset.removeAttribute('disabled');
    }
  };
  var onFilter = function () {
    window.card.hide();
    window.pin.removeAll();
    if (typeof onFilterChangeExternal === 'function') {
      window.callDebounce(onFilterChangeExternal);
    }
  };

  var properties = {
    'housing-type': 'any',
    'housing-price': 'any',
    'housing-rooms': 'any',
    'housing-guests': 'any',
    'filter-wifi': false,
    'filter-dishwasher': false,
    'filter-parking': false,
    'filter-washer': false,
    'filter-elevator': false,
    'filter-conditioner': false
  };
  // ...и добавим им обработчик, используя делегирование.
  mapFilters.addEventListener('change', function (evt) {
    var target = evt.target;
    if (target !== mapFilters) {
      if (typeof target.checked === 'boolean') {
        properties[target.id] = target.checked;
      } else {
        properties[target.id] = target.value;
      }
      onFilter();
    }
  });

  var getSelectPrice = function (currentPrice, house) {
    var prices = {
      'any': true,
      'low': house.offer.price < LOWER_COST_ROOM,
      'middle': house.offer.price >= LOWER_COST_ROOM && house.offer.price < HIGHTER_COST_ROOM,
      'high': house.offer.price >= HIGHTER_COST_ROOM
    };
    return prices[currentPrice];
  };
  var getSelectType = function (house) {
    return properties['housing-type'] === 'any' || house.offer.type === properties['housing-type'];
  };
  var getSelectRoomsOfGuests = function (property, roomsOrGuests) {
    return property === 'any' || roomsOrGuests === Number(property);
  };
  var getCheckbox = function (property, feature, house) {
    return property === false || house.offer.features.join(' ').includes(feature);
  };

  // Функция, возращающая результат фильтрации.
  var getPins = function (houses) {

    return houses.filter(function (house) {

      return getSelectType(house)
        && getSelectPrice(properties['housing-price'], house)

        && getSelectRoomsOfGuests(properties['housing-rooms'], house.offer.rooms)
        && getSelectRoomsOfGuests(properties['housing-guests'], house.offer.guests)

        && getCheckbox(properties['filter-wifi'], 'wifi', house)
        && getCheckbox(properties['filter-dishwasher'], 'dishwasher', house)
        && getCheckbox(properties['filter-parking'], 'parking', house)
        && getCheckbox(properties['filter-washer'], 'washer', house)
        && getCheckbox(properties['filter-elevator'], 'elevator', house)
        && getCheckbox(properties['filter-conditioner'], 'conditioner', house);
    });
  };

  window.filter = {
    setCallback: function (fn) {
      onFilterChangeExternal = fn;
    },
    getPins: getPins,
    setDisabled: setDisabled
  };

})();
