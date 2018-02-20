'use strict';

window.forms = (function () {

  var AMOUNT_HOUSES = 8;

  var form = document.querySelector('.notice__form');
  var address = document.getElementById('address');
  var userDialog = document.querySelector('.map');

  // Заполнение поля адреса координатами стартовой позиции метки.

  address.value = window.pin.getStartPositionPinAddress(); // Устанавливаем старовое положение метки в поле адреса.
  address.setAttribute('disabled', true);

  // Доступная и недоступная форма.
  function disableForm() {
    var currentCard = document.querySelector('article.map__card');

    document.querySelector('.map').classList.add('map--faded');
    form.reset(); // Сбрасываем поля до стартовых значений.
    if (currentCard !== null) {
      currentCard.style.display = 'none'; // Скрываем карточку.
    }
    window.card.hideCard();
    window.pin.removePins();
    form.querySelectorAll('fieldset').forEach(function (value) {
      value.setAttribute('disabled', true); // Сняли disabled у всех тегов fieldset.address.attributes.setNamedItem('disabled');
    });
    form.classList.add('notice__form--disabled');
    //
    address.value = window.pin.getStartPositionPinAddress(); // Возвращаем полю адреса значение стартовой позиции..
    window.pin.setMainPinOnStart();


  }
  function enableForm() {

    userDialog.classList.remove('map--faded'); // Сняли класс у активной карты.
    window.forms.form.querySelectorAll('fieldset').forEach(function (value) {
      value.removeAttribute('disabled'); // Сняли disabled у всех тегов fieldset.address.attributes.setNamedItem('disabled');
    });
    window.forms.form.classList.remove('notice__form--disabled'); // Сняли disabled у всей формы объявления.
    window.forms.address.setAttribute('disabled', true); // Поле адреса всегда недоступно.

    // Устанавливаем координаты адреса, на конце метки.
    window.forms.address.value = (window.pin.mainPin.offsetLeft + window.pin.getWidthPin() / 2) + ', ' + (window.pin.mainPin.offsetTop + window.pin.getHeightTipOfPin() + window.pin.getHeightPin() / 2);
    var newHouses = window.data.genHouses(AMOUNT_HOUSES); // Создали новый массив домов.
    window.pin.removePins(); // Удалили старые метки.
    userDialog.querySelector('.map__pins').appendChild(window.pin.makeFragmentPins(newHouses)); // Поставили метки обьявлений.
  }

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

  form.timein.addEventListener('change', function () {
    form.timeout.selectedIndex = form.timein.selectedIndex;
  });
  form.timeout.addEventListener('change', function () {
    form.timein.selectedIndex = form.timeout.selectedIndex;
  });

  var rooms = form.rooms;
  var capacity = form.capacity;

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

    } else {
      rooms.setCustomValidity('');
    }
  }

  rooms.addEventListener('change', onSetRoomWithCapacity);
  capacity.addEventListener('change', onSetRoomWithCapacity);

  return {
    address: address,
    form: form,
    enableForm: enableForm,
    disableForm: disableForm
  };
})();
