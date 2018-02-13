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
var AMOUNT_HOUSES = 8;
var MAX_GUESTS = 20;

var userDialog = document.querySelector('.map');
userDialog.classList.remove('map--faded');

var buttonTemplate = document.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
var mapFilterContainer = document.querySelector('.map__filters-container');

var newHouses = genHouses(AMOUNT_HOUSES);
userDialog.querySelector('.map__pins').appendChild(makeFragmentPins(newHouses));
userDialog.insertBefore(makeFragmentMapCards(newHouses), mapFilterContainer);


/*
 * Возаращает новую метку, созданный на основе данных параметра (объекта).
 */
function createButtonsPin(house) {
  var pinElement = buttonTemplate.cloneNode(true);
  pinElement.querySelector('img').src = house.author.avatar;
  pinElement.style.left = house.location.x + 'px';
  pinElement.style.top = (house.location.y - WIDTH_PIN) + 'px';
  pinElement.classList.add('fragments');
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

/*
 * !Весь блок по заданию №14 в следующих заданиях вынесу в отдельный модуль.
 */

var mainPin = userDialog.querySelector('.map__pin--main');
var pins = userDialog.querySelector('.map__pins').querySelectorAll('button');

var address = document.getElementById('address');
address.setAttribute('disabled', true);

var form = document.querySelector('.notice__form');

var fieldSets = form.querySelectorAll('fieldset');
var btnReset = form.querySelector('.form__reset');

// Значения 40 и 44 это ширина, высота метки. Пока не присваиваю переменным, чтобы не порождать конфликты с заданием 13.

var startPinX = mainPin.offsetLeft + 40 / 2;
var startPinY = mainPin.offsetTop + 18 + 44 / 2;
var startAddress = (startPinX) + ', ' + (startPinY); // Запомним координаты адреса, на конце метки при старте.
address.value = startAddress; // Устанавливаем старовое положение метки в поле адреса.


btnReset.addEventListener('click', function () {

  var currentCard = document.querySelector('article.map__card');

  userDialog.classList.add('map--faded');
  form.reset(); // Сбрасываем поля до стартовых значений.
  currentCard.style.display = 'none'; // Скрываем карточку.

  for (var i = 1; i < pins.length; i++) {
    pins[i].parentNode.removeChild(pins[i]); // Удаляем метки, кроме главной.
  }
  fieldSets.forEach(function (value) { // Убираем доспуп к полям формы.
    value.setAttribute('disabled', true);
  });
  //
  address.value = startAddress; // Возвращаем полю адреса значение стартовой позиции..
  mainPin.style.left = startPinX; // ..и ставим метку на стартовую позицию.
  mainPin.style.top = startPinY;
});

// Зададим зависимость минимальной стоимости аренды от типа жилья.

form.price.addEventListener('focus', function (evt) {
  var mySelect = form.type;
  for (var i = 0; i < mySelect.length; i++) {
    if (mySelect.options[i].selected) {
      switch (mySelect.options[i].value) {
        case 'flat':
          evt.currentTarget.setAttribute('min', 1000);
          break;
        case 'bungalo':
          evt.currentTarget.setAttribute('min', 0);
          break;
        case 'house':
          evt.currentTarget.setAttribute('min', 5000);
          break;
        case 'palace':
          evt.currentTarget.setAttribute('min', 10000);
          break;
      }
    }
  }
});

// Зависимость время заезда и выезда.

form.timein.addEventListener('click', function () {
  form.timeout.selectedIndex = form.timein.selectedIndex;
});
form.timeout.addEventListener('click', function () {
  form.timein.selectedIndex = form.timeout.selectedIndex;
});


// Удаляет пустой <option>

var rooms = form.rooms;
var capacity = form.capacity;

function onRemoveHollowOption(evt) {
  for (var i = 0; i < evt.target.length; ++i) {
    if (evt.target.options[i].value === '') {
      evt.target.removeChild(evt.target.querySelector('[value=""]'));
    }
  }
  evt.preventDefault();
}
// Задаёт синхронизацию поля количества комнать и поля колличества гостей.
function onSetRoomWithCapacity(evt) {

  var capacityCount;
  var room;

  if (evt.target === rooms) {
    capacityCount = capacity.options[capacity.selectedIndex].value;
    room = evt.target.value;
  } else if (evt.target === capacity) {
    capacityCount = evt.target.value;
    room = rooms.options[rooms.selectedIndex].value;
  }

  if (room === '1' && capacityCount !== '1') {
    rooms.setCustomValidity('Доступна для 1 гостя');

  } else if (room === '2' && capacityCount !== '2' && capacityCount !== '1') {
    rooms.setCustomValidity('Доступна для 1 или 2 гостей');

  } else if (room === '3' && capacityCount !== '3' && capacityCount !== '2' && capacityCount !== '1') {
    rooms.setCustomValidity('Доступна для 1, 2 или 3 гостей');

  } else if (room === '100' && capacityCount !== '0') {
    rooms.setCustomValidity('Не для гостей');

  } else if (rooms.validity.valueMissing) {
    rooms.setCustomValidity('Обязательное поле');
  } else {
    rooms.setCustomValidity('');
  }
}


rooms.addEventListener('change', onRemoveHollowOption);
rooms.addEventListener('change', onSetRoomWithCapacity);

capacity.addEventListener('change', onRemoveHollowOption);
capacity.addEventListener('change', onSetRoomWithCapacity);
