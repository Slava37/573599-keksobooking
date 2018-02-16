'use strict';

var forms = (function () {

  var form = document.querySelector('.notice__form');
  var btnReset = form.querySelector('.form__reset');
  var address = document.getElementById('address');

  // Заполнение поля адреса координатами стартовой позиции метки.

  address.value = window.pin.getStartPositionPinAddress(); // Устанавливаем старовое положение метки в поле адреса.
  address.setAttribute('disabled', true);

  // Обработчик кнопки "Сбросить"

  btnReset.addEventListener('click', function () {

    var currentCard = document.querySelector('article.map__card');

    document.querySelector('.map').classList.add('map--faded');
    form.reset(); // Сбрасываем поля до стартовых значений.
    if (currentCard !== null) {
      currentCard.style.display = 'none'; // Скрываем карточку.
    }
    window.pin.removePins();
    form.querySelectorAll('fieldset').forEach(function (value) {
      value.setAttribute('disabled', true); // Сняли disabled у всех тегов fieldset.address.attributes.setNamedItem('disabled');
    });
    form.classList.add('notice__form--disabled');
    //
    address.value = window.pin.getStartPositionPinAddress(); // Возвращаем полю адреса значение стартовой позиции..
    window.pin.setMainPinOnStart();
  });

  // Зададим зависимость минимальной стоимости аренды от типа жилья.

  form.price.addEventListener('focus', function (evt) {
    var mySelect = form.type;
    for (var i = 0; i < mySelect.length; i++) {
      if (mySelect.options[i].selected) {
        switch (mySelect.options[i].value) {
          case 'flat':
            evt.currentTarget.setAttribute('min', 1000);
            break;
          case 'bungalo':
            evt.currentTarget.setAttribute('min', 0);
            break;
          case 'house':
            evt.currentTarget.setAttribute('min', 5000);
            break;
          case 'palace':
            evt.currentTarget.setAttribute('min', 10000);
            break;
        }
      }
    }
  });

  // Зависимость время заезда и выезда.

  form.timein.addEventListener('click', function () {
    form.timeout.selectedIndex = form.timein.selectedIndex;
  });
  form.timeout.addEventListener('click', function () {
    form.timein.selectedIndex = form.timeout.selectedIndex;
  });


  // Удаляет пустой <option>

  var rooms = form.rooms;
  var capacity = form.capacity;

  function onRemoveHollowOption(evt) {
    for (var i = 0; i < evt.target.length; ++i) {
      if (evt.target.options[i].value === '') {
        evt.target.removeChild(evt.target.querySelector('[value=""]'));
      }
    }
    evt.preventDefault();
  }
  // Задаёт синхронизацию поля количества комнать и поля колличества гостей.
  function onSetRoomWithCapacity(evt) {

    var capacityCount;
    var room;

    if (evt.target === rooms) {
      capacityCount = capacity.options[capacity.selectedIndex].value;
      room = evt.target.value;
    } else if (evt.target === capacity) {
      capacityCount = evt.target.value;
      room = rooms.options[rooms.selectedIndex].value;
    }

    if (room === '1' && capacityCount !== '1') {
      rooms.setCustomValidity('Доступна для 1 гостя');

    } else if (room === '2' && capacityCount !== '2' && capacityCount !== '1') {
      rooms.setCustomValidity('Доступна для 1 или 2 гостей');

    } else if (room === '3' && capacityCount !== '3' && capacityCount !== '2' && capacityCount !== '1') {
      rooms.setCustomValidity('Доступна для 1, 2 или 3 гостей');

    } else if (room === '100' && capacityCount !== '0') {
      rooms.setCustomValidity('Не для гостей');

    } else if (rooms.validity.valueMissing) {
      rooms.setCustomValidity('Обязательное поле');
    } else {
      rooms.setCustomValidity('');
    }
  }
  rooms.addEventListener('change', onRemoveHollowOption);
  rooms.addEventListener('change', onSetRoomWithCapacity);

  capacity.addEventListener('change', onRemoveHollowOption);
  capacity.addEventListener('change', onSetRoomWithCapacity);

  return {
    address: address,
    form: form
  };
})();
