'use strict';

// Модуль управления картой.
(function () {

  var AMOUNT_HOUSES = 8;
  var MAP_MAX_TOP = 150;
  var MAP_MAX_BOTTOM = 500;
  var MAP_WIDTH = document.querySelector('.map__pins').offsetWidth;

  var userDialog = document.querySelector('.map');
  var pin = window.pin.mainPin; // Метка нашего обьявления.
  var pinImage = pin.querySelector('.main__pin--image');
  var btnReset = window.forms.form.querySelector('.form__reset');
  var position;

  // Обработка отпускания кнопки мыши при перетаскивании, появляется активное окно.
  window.pin.mainPin.addEventListener('mouseup', window.forms.enableForm);

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


      if ((pin.offsetTop - shift.y) < MAP_MAX_BOTTOM && (pin.offsetTop - shift.y) > MAP_MAX_TOP) {
        pin.style.top = (pin.offsetTop - shift.y) + 'px';
      }
      if ((pin.offsetLeft - shift.x) < MAP_WIDTH && (pin.offsetLeft - shift.x) > 0) {
        pin.style.left = (pin.offsetLeft - shift.x) + 'px';
      }
      position = (pin.offsetLeft - shift.x) + ', ' + (pin.offsetTop - shift.y);
      window.forms.address.value = ((pin.offsetLeft - shift.x) + ', ' + (pin.offsetTop + window.pin.getHeightTipOfPin() - shift.x));
      window.forms.address.value = position;
    }
    // Обработка отпускания кнопки мыши при перетаскивании, появляется активное окно.

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      upEvt.preventDefault();
      userDialog.classList.remove('map--faded'); // Сняли класс у активной карты.
      window.forms.form.querySelectorAll('fieldset').forEach(function (value) {
        value.removeAttribute('disabled'); // Сняли disabled у всех тегов fieldset.address.attributes.setNamedItem('disabled');
      });
      window.forms.form.classList.remove('notice__form--disabled'); // Сняли disabled у всей формы объявления.
      window.forms.address.setAttribute('disabled', true); // Поле адреса всегда недоступно.

      // Устанавливаем координаты адреса, на конце метки.
      window.forms.address.value = position;
      var newHouses = window.data.genHouses(AMOUNT_HOUSES); // Создали новый массив домов.
      window.pin.removePins(); // Удалили старые метки.
      userDialog.querySelector('.map__pins').appendChild(window.pin.makeFragmentPins(newHouses)); // Поставили метки обьявлений.

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

  });

  // Обработчик кнопки "Сбросить"
  btnReset.addEventListener('click', window.forms.disableForm);
})();
