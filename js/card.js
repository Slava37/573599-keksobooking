'use strict';

window.card = (function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
  // Устанавливает значение жилья в зависимости от type DOM-элемента.

  function getOfferType(currentType) {
    var type = currentType;
    var name;
    switch (type) {
      case 'flat':
        name = 'Квартира';
        break;
      case 'bungalo':
        name = 'Бунгало';
        break;
      case 'house':
        name = 'Дом';
        break;
    }
    return name;
  }

  // Скрывает карточку.
  function hideCard() {
    var currentCard = document.querySelector('article.map__card');
    if (currentCard !== null) {
      currentCard.style.display = 'none'; // Скрываем карточку.
    }
  }

  /*
   * Возаращает новое обьявление, созданный на основе данных параметра (объекта).
   */
  function createMapCard(house) {
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
    var features = house.offer.features;

    // Очистим список и добавим свои элементы.

    var personFeatures = mapCardElement.querySelector('.popup__features');
    var featuresAllLi = personFeatures.getElementsByTagName('li');

    for (var i = 0; i < window.data.featuresLength; i++) {
      featuresAllLi[0].parentNode.removeChild(featuresAllLi[0]);
    }

    var featureClass;
    var featureLi;

    for (var j = 0; j < features.length; j++) {
      featureClass = 'feature feature--' + features[j];
      featureLi = document.createElement('li');
      featureLi.className = featureClass;
      personFeatures.appendChild(featureLi);
    }

    // Задаем описание обьявления.

    mapCardElement.getElementsByTagName('p')[4].textContent = house.offer.description;

    // Задаем картинки жилища.
    var photosList = mapCardElement.querySelector('.popup__pictures');

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
    var avatar = mapCardElement.querySelector('.popup__avatar');
    avatar.src = house.author.avatar;

    return mapCardElement;
  }

  function onPopupEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  }
  function closePopup() {
    hideCard();
    document.removeEventListener('keydown', onPopupEscPress);
  }

  function closeButtonCard() {
    var closeButton = document.querySelector('.popup__close');

    document.addEventListener('keydown', onPopupEscPress);
    closeButton.addEventListener('click', closePopup);
    closeButton.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        closePopup();
      }
    });
  }
  return {
    createMapCard: createMapCard,
    hideCard: hideCard,
    closeButtonCard: closeButtonCard
  };
})();
