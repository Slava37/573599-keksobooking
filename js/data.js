'use strict';

window.data = (function () {
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
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var MAX_GUESTS = 20;
  /*
   * Возвращает массив обьявлений о жилье (объектов).
   */
  function genHouses(num) {
    var avatars = window.someRandom.getRandomCollection(makeArrAvatars(), num);
    var titles = window.someRandom.getRandomCollection(TITLES, num);
    var houses = [];
    for (var i = 0; i < num; i++) {
      var x = window.someRandom.getRandomNumber(300, 900);
      var y = window.someRandom.getRandomNumber(150, 500);
      houses.push(
          {
            author: {
              avatar: avatars[i]
            },
            offer: {
              title: titles[i],
              address: x + ', ' + y,
              price: window.someRandom.getRandomNumber(1000, 1000000),
              type: window.someRandom.getRandomElement(TYPES),
              rooms: window.someRandom.getRandomNumber(1, 5),
              guests: window.someRandom.getRandomNumber(1, MAX_GUESTS),
              checkin: window.someRandom.getRandomElement(CHECKIN),
              checkout: window.someRandom.getRandomElement(CHECKOUT),
              features: window.someRandom.getRandomCollection(FEATURES, window.someRandom.getRandomNumber(0, FEATURES.length)),
              description: '',
              photos: window.someRandom.getRandomCollection(PHOTOS, window.someRandom.getRandomNumber(1, PHOTOS.length))
            },
            location: {
              x: x,
              y: y
            }
          });
    }
    return houses;
  }

  /*
   * Создает массив из заданных данных.
   * @return {Array}
   */
  function makeArrAvatars() {
    var resultArr = [];
    for (var i = 0; i < 8; i++) {
      resultArr[i] = 'img/avatars/user0' + (i + 1) + '.png';
    }
    return resultArr;
  }

  return {
    featuresLength: FEATURES.length,
    //  genHouses: genHouses
  };
})();
