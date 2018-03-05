'use strict';

(function () {
  var MIN_COST_BUNGALO = 0;
  var MIN_COST_FLAT = 1000;
  var MIN_COST_HOUSE = 5000;
  var MIN_COST_PALACE = 10000;

  var ROOMS_CAPACITY = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0']
  };

  var formElement = document.querySelector('.notice__form');
  var addressElement = document.querySelector('#address');
  var fieldSetsElement = formElement.querySelectorAll('fieldset');
  var btnResetElement = formElement.querySelector('.form__reset');

  // Заполнение поля адреса координатами стартовой позиции метки.
  addressElement.value = window.pin.getStartPositionAddress(); // Устанавливаем старовое положение метки в поле адреса.

  // Доступная и недоступная форма.
  var disableForm = function () {
    window.mapElement.classList.add('map--faded');

    formElement.reset(); // Сбрасываем поля до стартовых значений.
    window.card.hide(); // Скрываем карточку.
    window.pin.removeAll();
    fieldSetsElement.forEach(function (value) {
      value.setAttribute('disabled', true); // Сняли disabled у всех тегов fieldset.address.attributes.setNamedItem('disabled');
    });
    formElement.classList.add('notice__form--disabled');

    addressElement.value = window.pin.getStartPositionAddress(); // Возвращаем полю адреса значение стартовой позиции..
    window.pin.setOnStart();
    window.resetOutputs();
    window.filter.setDisabled(true);
  };

  window.enableForm = function () {

    // Условие, при котором ряд действий выполняется только, если карта скрыта.
    if (window.mapElement.classList.contains('map--faded')) {
      window.mapElement.classList.remove('map--faded'); // Сняли класс у активной карты.
      fieldSetsElement.forEach(function (value) {
        value.removeAttribute('disabled'); // Сняли disabled у всех тегов fieldset.address.attributes.setNamedItem('disabled');
      });
      formElement.classList.remove('notice__form--disabled'); // Сняли disabled у всей формы объявления.
    }

    // Устанавливаем координаты адреса, на конце метки.

    window.pin.removeAll();
    // Создаем новый массив домов и заполняем его данными с сервера.
    if (!window.newData) {
      window.backend.load(function (data) {
        window.newData = data;
        window.pin.renderAll();
      }, window.notification.showError);
    } else {
      window.pin.renderAll();
    }
  };

  // Зададим зависимость минимальной стоимости аренды от типа жилья.
  formElement.type.addEventListener('change', function () {
    var mySelect = formElement.type;
    switch (mySelect.value) {
      case 'flat':
        formElement.price.placeholder = 'От ' + MIN_COST_FLAT;
        formElement.price.setAttribute('min', MIN_COST_FLAT);
        break;
      case 'bungalo':
        formElement.price.placeholder = 'Любая';
        formElement.price.setAttribute('min', MIN_COST_BUNGALO);
        break;
      case 'house':
        formElement.price.placeholder = 'От ' + MIN_COST_HOUSE;
        formElement.price.setAttribute('min', MIN_COST_HOUSE);
        break;
      case 'palace':
        formElement.price.placeholder = 'От ' + MIN_COST_PALACE;
        formElement.price.setAttribute('min', MIN_COST_PALACE);
        break;
    }
  });

  // Зависимость время заезда и выезда.
  formElement.timein.addEventListener('change', function () {
    formElement.timeout.selectedIndex = formElement.timein.selectedIndex;
  });
  formElement.timeout.addEventListener('change', function () {
    formElement.timein.selectedIndex = formElement.timeout.selectedIndex;
  });

  var roomsElement = formElement.rooms;
  var capacityElement = formElement.capacity;

  // Задаёт синхронизацию поля количества комнать и поля колличества гостей.
  var onRoomChange = function () {
    if (capacityElement.options.length > 0) {
      [].forEach.call(capacityElement.options, function (item) {
        item.selected = (ROOMS_CAPACITY[roomsElement.value][0] === item.value) ? true : false;
        item.hidden = (ROOMS_CAPACITY[roomsElement.value].indexOf(item.value) >= 0) ? false : true;
      });
    }
  };

  roomsElement.addEventListener('change', onRoomChange);

  // Обработчик кнопки "Сбросить"
  btnResetElement.addEventListener('click', disableForm);

  // Создаем обработчик отправки формы на сервер.
  formElement.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(formElement);
    var ourAddress = addressElement.value;

    formData.append('address', ourAddress);
    window.backend.upload(formData, function (message) {
      disableForm();
      window.notification.showInfo(message);
      addressElement.value = window.pin.getStartPositionAddress(); // Поле адреса сбрасываться не должно при отправке формы.
    }, window.notification.showError);
  });
})();
