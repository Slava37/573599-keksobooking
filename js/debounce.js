'use strict';

window.debounce = (function () {
  var DEBOUNCE_INTERVAL = 500; // ms

  var lastTimeout;
  function setValue(fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  }
  return {
    setValue: setValue
  };
})();
