'use strict';

window.someRandom = (function () {
  /*
   * Возврящает случайное целое число в диапазоне.
   */
  function getRandomNumber(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  /*
     * Вспомогательные функции, возвращают случайный элемент массива,
     * индекс массива, и случайный массив.
     */
  function getRandomIndex(arr) {
    return getRandomNumber(0, arr.length - 1);
  }

  function getRandomElement(arr) {
    var value = getRandomNumber(0, arr.length - 1);
    return arr[value];
  }

  function getRandomCollection(arr, N) {
    var copyArr = arr.slice();
    var resultArr = [];
    var index;
    for (var i = 0; i < N; i++) {
      index = getRandomIndex(copyArr);
      resultArr.push(copyArr.splice(index, 1)[0]);
    }
    return resultArr;
  }

  return {
    getRandomNumber: getRandomNumber,
    getRandomIndex: getRandomIndex,
    getRandomElement: getRandomElement,
    getRandomCollection: getRandomCollection
  };
})();

