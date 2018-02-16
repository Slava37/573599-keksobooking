'use strict';

// Модуль управления картой.
(function () {

  var AMOUNT_HOUSES = 8;
  var userDialog = document.querySelector('.map');

  // Обработка отпускания кнопки мыши при перетаскивании, появляется активное окно.

  window.pin.mainPin.addEventListener('mouseup', function () {

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
  });
})();


