'use strict';

// Модуль управления картой.
(function () {


  var btnReset = window.forms.form.querySelector('.form__reset');

  // Обработчик кнопки "Сбросить"
  btnReset.addEventListener('click', window.forms.disableForm);
})();
