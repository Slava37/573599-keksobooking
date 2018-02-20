'use strict';

// Модуль управления картой.
(function () {

  var btnReset = window.forms.form.querySelector('.form__reset');

  // Обработка отпускания кнопки мыши при перетаскивании, появляется активное окно.
  window.pin.mainPin.addEventListener('mouseup', window.forms.enableForm);

  // Обработчик кнопки "Сбросить"
  btnReset.addEventListener('click', window.forms.disableForm);

})();
