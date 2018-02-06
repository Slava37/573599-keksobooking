'use strict';

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
var WIDTH_PIN = 40;
var amountHouses = 8;
var maxGuests = 20;

var userDialog = document.querySelector('.map');
userDialog.classList.remove('map--faded');

var buttonTemplate = document.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
var mapFilterContainer = document.querySelector('.map__filters-container');

var newHouses = genHouses(amountHouses);
userDialog.querySelector('.map__pins').appendChild(makeFragmentPins(newHouses));
userDialog.insertBefore(makeFragmentMapCards(newHouses), mapFilterContainer);


/*
 * Возаращает новую метку, созданный на основе данных параметра (объекта).
 */
function createButtonsPin(house) {
  /*
  var buttonElement = document.createElement('button');
  buttonElement.style.left = 'left: ' + house.location.x + 'px;';
  buttonElement.style.top = 'top: ' + (house.location.y) + 'px;';
  buttonElement.className = 'map__pin';

  var innImg = document.createElement('img');
  innImg.src = house.author.avatar;
  innImg.width = '40';
  innImg.height = '40';
  innImg.draggable = 'false';

  buttonElement.appendChild(innImg);
  return buttonElement;
  */
  var pinElement = buttonTemplate.cloneNode(true);
  pinElement.querySelector('img').src = house.author.avatar;
  pinElement.style.left = house.location.x + 'px';
  pinElement.style.top = (house.location.y - WIDTH_PIN) + 'px';

  return pinElement;
}
/*
 * Возвращает фрагмент, созданный из массива меток.
 */
function makeFragmentPins(houses) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < houses.length; i++) {
    fragment.appendChild(createButtonsPin(houses[i]));
  }

  return fragment;
}
/*
 * Возаращает новое обьявление, созданный на основе данных параметра (объекта).
 */
function createMapCard(house) {
  var mapCardElement = mapCardTemplate.cloneNode(true);
  mapCardElement.querySelector('h3').textContent = house.offer.title;
  mapCardElement.querySelector('small').textContent = house.offer.address;
  mapCardElement.querySelector('.popup__price').innerHTML = house.offer.price + '&#x20bd;/ночь';
  switch (house.offer.type) {
    case 'flat':
      mapCardElement.querySelector('h4').textContent = 'Квартира';
      break;
    case 'bungalo':
      mapCardElement.querySelector('h4').textContent = 'Бунгало';
      break;
    case 'house':
      mapCardElement.querySelector('h4').textContent = 'Дом';
      break;
  }
  mapCardElement.getElementsByTagName('p')[2].textContent = house.offer.rooms + ' комнаты для ' + house.offer.guests + ' гостей';
  mapCardElement.getElementsByTagName('p')[3].textContent = 'Заезд после ' + house.offer.checkin + ', выезд до ' + house.offer.checkout;
  var features = house.offer.features;

  var personFeatures = mapCardElement.getElementsByTagName('li');
  for (var i = 0; i < personFeatures.length; i++) {
    for (var j = 0; j < features.length; j++) {
      var feature = 'feature feature--' + features[j];
      if (personFeatures[i].className === feature) {
        personFeatures[i].innerHTML = features[j];
      }
    }
  }
  // Задаем описание обьявления.
  mapCardElement.getElementsByTagName('p')[4].textContent = house.offer.description;

  // Задаем картинки жилища.
  var photosLiTemplate = document.querySelector('template').content.querySelector('.popup__pictures li');
  var photosList = document.querySelector('template').content.querySelector('.popup__pictures');

  var photoFragment = document.createDocumentFragment();
  for (i = 0; i < house.offer.photos.length; i++) {
    if (i === 0) {
      photosLiTemplate.querySelector('img').src = house.offer.photos[i];
      photosLiTemplate.querySelector('img').width = '50';
      photosLiTemplate.querySelector('img').height = '50';
      continue;
    }
    var photoElement = photosLiTemplate.cloneNode(true);
    photoElement.querySelector('img').src = house.offer.photos[i];
    photoElement.querySelector('img').width = '50'; // Не понял насчет ширины и высоты, нужно подобрать размер?
    photoElement.querySelector('img').height = '50';

    photoFragment.appendChild(photoElement);
  }
  photosList.appendChild(photoFragment);

  // Меняем картинку аватара.
  var avatar = document.querySelector('template').content.querySelector('.popup__avatar');
  avatar.src = house.author.avatar;
  return mapCardElement;
}

/*
   * Возвращает фрагмент, созданный из массива обьявлений.
   */
function makeFragmentMapCards(houses) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(createMapCard(houses[0]));
  return fragment;
}

/*
   * Возвращает массив обьявлений о жилье (объектов).
   */
function genHouses(num) {
  var avatars = getRandomCollection(makeArrAvatars(), num);
  var titles = getRandomCollection(TITLES, num);
  var houses = [];
  for (var i = 0; i < num; i++) {
    var x = getRandomNumber(300, 900);
    var y = getRandomNumber(150, 500);
    houses[i] =
        {
          author: {
            avatar: avatars[i]
          },
          offer: {
            title: titles[i],
            address: x + ', ' + y,
            price: getRandomNumber(1000, 1000000),
            type: getRandomElement(TYPES),
            rooms: getRandomNumber(1, 5),
            guests: getRandomNumber(1, maxGuests),
            checkin: getRandomElement(CHECKIN),
            checkout: getRandomElement(CHECKOUT),
            features: getRandomCollection(FESTURES, getRandomNumber(0, FESTURES.length)),
            description: '',
            photos: getRandomCollection(PHOTOS, PHOTOS.length)
          },
          location: {
            x: x,
            y: y
          }
        };
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
  var value = getRandomNumber(0, arr.length - 1);
  return value;
}

function getRandomElement(arr) {
  var value = getRandomNumber(0, arr.length - 1);
  return arr[value];
}

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
