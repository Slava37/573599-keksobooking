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
  // Функция, возращающая результат фильтрации.
  var getPins = function (houses) {

    var priceProperty = function (currentPrice, house) {
      var prices = {
        'any': true,
        'low': house.offer.price < LOWER_COST_ROOM,
        'middle': house.offer.price >= LOWER_COST_ROOM && house.offer.price < HIGHTER_COST_ROOM,
        'high': house.offer.price >= HIGHTER_COST_ROOM
      };
      return prices[currentPrice];
    };

    var filterProperties = function (property, value, house) {
      if (property === properties['housing-type']) {
        return properties['housing-type'] === 'any' || house.offer.type === properties['housing-type'];
      } else if (property === properties['housing-rooms']) {
        return properties['housing-rooms'] === 'any' || house.offer.rooms === Number(properties['housing-rooms']);
      } else if (property === properties['housing-guests']) {
        return properties['housing-guests'] === 'any' || house.offer.rooms === Number(properties['housing-guests']);
      } else {
        return property === false || house.offer.features.join(' ').includes(value);
      }
    };

    return houses.filter(function (house) {
      return priceProperty(properties['housing-price'], house)
        && filterProperties(properties['housing-type'], null, house)
        && filterProperties(properties['housing-rooms'], null, house)
        && filterProperties(properties['housing-guests'], null, house)
        && filterProperties(properties['filter-wifi'], 'wifi', house)
        && filterProperties(properties['filter-dishwasher'], 'dishwasher', house)
        && filterProperties(properties['filter-parking'], 'parking', house)
        && filterProperties(properties['filter-washer'], 'washer', house)
        && filterProperties(properties['filter-elevator'], 'elevator', house)
        && filterProperties(properties['filter-conditioner'], 'conditioner', house);
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
