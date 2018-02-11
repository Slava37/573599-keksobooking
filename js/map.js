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
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var WIDTH_PIN = 40;
var HEIGTH_PIN = 44;
var HEIGTH_TIP_OF_PIN = 18; // border-top-width: 22px - 4px
var AMOUNT_HOUSES = 8;
var MAX_GUESTS = 20;


var newHouses = genHouses(AMOUNT_HOUSES);

/*
 * Возаращает новую метку, созданный на основе данных параметра (объекта).
 */
function createButtonsPin(house) {
  var pinElement = buttonTemplate.cloneNode(true);
  pinElement.querySelector('img').src = house.author.avatar;

  pinElement.style.left = house.location.x + 'px';

  pinElement.style.top = (house.location.y - WIDTH_PIN) + 'px';

  // Добавляем обработчик и создание карточки для дома.
  pinElement.addEventListener('click', function () {
    var fragmentCard = document.createDocumentFragment();
    fragmentCard.appendChild(createMapCard(house));
    userDialog.insertBefore(fragmentCard, mapFilterContainer);
  });
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

  mapCardElement.dataset.title = house.offer.title;
  mapCardElement.querySelector('h3').textContent = house.offer.title;

  mapCardElement.dataset.address = house.offer.address;
  mapCardElement.querySelector('small').textContent = house.offer.address;

  mapCardElement.querySelector('.popup__price').textContent = house.offer.price + '\u20BD/ночь';
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
  mapCardElement.dataset.price = house.offer.title;
  mapCardElement.getElementsByTagName('p')[2].textContent = house.offer.rooms + ' комнаты для ' + house.offer.guests + ' гостей';
  mapCardElement.getElementsByTagName('p')[3].textContent = 'Заезд после ' + house.offer.checkin + ', выезд до ' + house.offer.checkout;
  var features = house.offer.features;

  var personFeatures = mapCardElement.getElementsByTagName('li');
  for (var i = 0; i < personFeatures.length; i++) {
    for (var j = 0; j < features.length; j++) {
      var feature = 'feature feature--' + features[j];
      if (personFeatures[i].className === feature) {
        personFeatures[i].textContent = features[j];
      }
    }
  }
  // Задаем описание обьявления.
  mapCardElement.getElementsByTagName('p')[4].textContent = house.offer.description;

  // Задаем картинки жилища.
  var photosList = document.querySelector('template').content.querySelector('.popup__pictures');
  var photosLiTemplate = photosList.querySelector('li');

  var photoFragment = document.createDocumentFragment();

  var photoTemplateImg = photosLiTemplate.querySelector('img');
  var photoElementImg;
  for (i = 0; i < house.offer.photos.length; i++) {
    if (i === 0) {
      photoTemplateImg.src = house.offer.photos[i];
      photoTemplateImg.width = '50';
      photoTemplateImg.height = '50';
      continue;
    }
    var photoElement = photosLiTemplate.cloneNode(true);
    photoElementImg = photoElement.querySelector('img');
    photoElementImg.src = house.offer.photos[i];
    photoElementImg.width = '50';
    photoElementImg.height = '50';

    photoFragment.appendChild(photoElement);
  }
  photosList.appendChild(photoFragment);

  // Меняем картинку аватара.
  var avatar = document.querySelector('template').content.querySelector('.popup__avatar');
  avatar.src = house.author.avatar;

  return mapCardElement;
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
    houses.push(
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
            guests: getRandomNumber(1, MAX_GUESTS),
            checkin: getRandomElement(CHECKIN),
            checkout: getRandomElement(CHECKOUT),
            features: getRandomCollection(FEATURES, getRandomNumber(0, FEATURES.length)),
            description: '',
            photos: getRandomCollection(PHOTOS, PHOTOS.length)
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

// Обработка отпускания кнопки мыши при перетаскивании, появляется активное окно.

var mainPin = document.querySelector('.map__pin--main');
var userDialog = document.querySelector('.map');
var fieldSets = document.querySelector('.notice__form').querySelectorAll('fieldset');

// Заполнение поля адреса координатами стартовой позиции метки.

var address = document.getElementById('address');
var startPositionPin = (mainPin.offsetLeft + WIDTH_PIN / 2) + ', ' + (mainPin.offsetTop + HEIGTH_PIN / 2);
address.value = startPositionPin;

mainPin.addEventListener('mouseup', function () {
  userDialog.classList.remove('map--faded'); // Сняли класс у активной карты.
  fieldSets.forEach(function (value) {
    value.removeAttribute('disabled'); // Сняли disabled у всех тегов fieldset.address.attributes.setNamedItem('disabled');
  });
  address.setAttribute('disabled', true); // Поле адреса всегда недоступно.
  address.value = (mainPin.offsetLeft + WIDTH_PIN / 2) + ', ' + (mainPin.offsetTop + HEIGTH_TIP_OF_PIN + HEIGTH_PIN / 2); // Устанавливаем координаты адреса, на конце метки.

  userDialog.querySelector('.map__pins').appendChild(makeFragmentPins(newHouses)); // Поставили метки обьявлений.
});

// Отрисовываем карту при запуске страницы.
var buttonTemplate = document.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
var mapFilterContainer = document.querySelector('.map__filters-container');
