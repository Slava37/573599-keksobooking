
'use strict';

window.card = (function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var DIMENSIONS = 50;
  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');

  // Устанавливает значение жилья в зависимости от type DOM-элемента.
  var getOfferType = function (currentType) {
    var type = currentType;
    switch (type) {
      case 'flat':
        return 'Квартира';
      case 'bungalo':
        return 'Бунгало';
      case 'house':
        return 'Дом';
      default: return '';
    }
  }

  // Скрывает карточку.
  window.hideCard = function () {
    var currentCardElement = document.querySelector('article.map__card');
    if (currentCardElement !== null) {
      currentCardElement.style.display = 'none'; // Скрываем карточку.
    }
  }

  // Возаращает новое обьявление, созданный на основе данных параметра (объекта).
  var createMapCard = function (house) {
    var mapCardElement = mapCardTemplate.cloneNode(true);
    mapCardElement.id = 'new_card';

    mapCardElement.querySelector('h4').textContent = getOfferType(house.offer.type);

    mapCardElement.dataset.title = house.offer.title;
    mapCardElement.querySelector('h3').textContent = house.offer.title;

    mapCardElement.dataset.address = house.offer.address;
    mapCardElement.querySelector('small').textContent = house.offer.address;

    mapCardElement.querySelector('.popup__price').textContent = house.offer.price + '\u20BD/ночь';

    mapCardElement.dataset.price = house.offer.title;
    mapCardElement.getElementsByTagName('p')[2].textContent = house.offer.rooms + ' комнаты для ' + house.offer.guests + ' гостей';
    mapCardElement.getElementsByTagName('p')[3].textContent = 'Заезд после ' + house.offer.checkin + ', выезд до ' + house.offer.checkout;

    // Добавим свои элементы.
    var pupupFeaturesElement = mapCardElement.querySelector('.popup__features');

    house.offer.features.forEach(function (value) {
      var featureClass = 'feature feature--' + value;
      var featureLiElement = document.createElement('li');
      featureLiElement.className = featureClass;
      pupupFeaturesElement.appendChild(featureLiElement);
    });

    // Задаем описание обьявления.
    mapCardElement.getElementsByTagName('p')[4].textContent = house.offer.description;

    // Задаем картинки жилища.
    var photosList = mapCardElement.querySelector('.popup__pictures');
    var photosLiTemplate = photosList.querySelector('li');
    var photosFragment = document.createDocumentFragment();

    var photoImgElement;
    house.offer.photos.forEach(function (value) {
      var photoElement = photosLiTemplate.cloneNode(true);
      photoImgElement = photoElement.querySelector('img');
      photoImgElement.src = value;
      photoImgElement.width = DIMENSIONS;
      photoImgElement.height = DIMENSIONS;
      photosFragment.appendChild(photoElement);
    });
    photosList.appendChild(photosFragment);

    // Меняем картинку аватара.
    var avatarElement = mapCardElement.querySelector('.popup__avatar');
    avatarElement.src = house.author.avatar;

    return mapCardElement;
  }

  function onPopupEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  }
  function closePopup() {
    window.hideCard();
    document.removeEventListener('keydown', onPopupEscPress);
  }

  function closeButtonCard() {
    var closeButtonElement = document.querySelector('.popup__close');

    document.addEventListener('keydown', onPopupEscPress);
    closeButtonElement.addEventListener('click', closePopup);
    closeButtonElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        closePopup();
      }
    });
  }
  window.showCard = function (house) {
    var mapFilterContainer = document.querySelector('.map__filters-container');
    var fragmentCard = document.createDocumentFragment();
    fragmentCard.appendChild(createMapCard(house));
    var popup = document.getElementById('new_card');
    if (popup !== null) {
      popup.parentNode.removeChild(popup);
    }
    document.querySelector('.map').insertBefore(fragmentCard, mapFilterContainer);
    closeButtonCard();
  };
})();
