'use strict';

// Модуль управления картой.
(function () {

  var MAP_MAX_TOP = 150;
  var MAP_MAX_BOTTOM = 500;
  var MAP_WIDTH = document.querySelector('.map__pins').offsetWidth;

  var pin = window.pin.mainPin; // Метка нашего обьявления.
  var pinImage = pin.querySelector('.main__pin--image');
  var btnReset = window.forms.form.querySelector('.form__reset');
  var position;

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

    function onMouseUp() {
      window.forms.enableForm();
      window.forms.address.value = position;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

  });

  // Обработчик кнопки "Сбросить"
  btnReset.addEventListener('click', window.forms.disableForm);
})();
