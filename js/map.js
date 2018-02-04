'use strict'

var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var TYPES = ['flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FESTURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var amountHouses = 8;
var maxGuests = 20;

function genHouses(num) {
  var avatars = getRandomCollection(makeArrAvatars(), num);
  var titles = getRandomCollection(TITLES, num);

  for (var i = 0; i < num; i++) {
    var houses = [
      {
        'location': {
          'x': getRandomNumber(300, 900),
          'y': getRandomNumber(150, 500)
        },
        'author': {
          'avatar': avatars[i]
        },
        'offer': {
          'title': titles[i],
          'address': '{{' + location.x + '}}, ' + ' {{' + location.y + '}}',
          'price': getRandomNumber(1000, 1000000),
          'type': getRandomElement(TYPES),
          'rooms': getRandomNumber(1, 5),
          'guests': getRandomNumber(1, maxGuests),
          'checkin': getRandomElement(CHECKIN),
          'checkout': getRandomElement(CHECKOUT),
          'features': getRandomCollection(FESTURES, getRandomNumber(0, FESTURES.length)),
          'description': '',
          'photos': getRandomCollection(PHOTOS, PHOTOS.length)
        }
      }
    ];
  }
  return houses;
}

/**
 * Создает массив из заданных данных.
 * @return {Array}
 */
function makeArrAvatars() {
  var resultArr = [];
  for (var i = 0; i < 8; i++) {
    resultArr[i] = 'img/avatars/user{{0' + (i + 1) + '}}.png';
  }
  return resultArr;
}
/**
* Возврящает случайное целое число в диапазоне.
* @param {*} min
* @param {*} max
*/
function getRandomNumber(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}
/**
 * Возврящает случайный индекс массива.
 * @param {*} arr
 */

function getRandomIndex(arr) {
  var value = getRandomNumber(0, arr.length - 1);
  return value;
}
var getRandomElement = function (arr) {
  var value = getRandomNumber(0, arr.length - 1);
  return arr[value];
};
function getRandomCollection(arr, N) {
  var copyArr = arr.slice();
  var resultArr = [];
  var element;
  for (var i = 0; i < N; i++) {
    element = getRandomIndex(copyArr);
    resultArr.splice(i, 0, copyArr[element]);
    copyArr.splice(element, 1);
  }
  return resultArr;

}

var userDialog = document.querySelector('.map');
userDialog.classList.remove('.map--faded');

var houses = genHouses(amountHouses);
