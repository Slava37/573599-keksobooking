'use strict';

(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var chooserAvatarElement = document.getElementById('avatar');
  var noticePhotoElement = document.querySelector('.notice__photo');
  var avatarUploadElement = noticePhotoElement.querySelector('.drop-zone');

  var chooserPhotosElement = document.getElementById('images');
  var photoContainerElement = document.querySelector('.form__photo-container');
  var photosUploadElement = photoContainerElement.querySelector('.drop-zone');
  var uploadBlockElement = photoContainerElement.querySelector('.upload');

  var previewElement = noticePhotoElement.querySelector('img');

  // Удаляет загруженные фото и выставляет дефолтное значение аватара.
  window.resetOutputs = function () {
    previewElement.src = 'img/muffin.png';
    var photos = photoContainerElement.querySelectorAll('.form__photo');
    photos.forEach(function (value) {
      value.parentNode.removeChild(value);
    });
  };

  // Создадим логику загрузки файла загрузку файла для аватарки пользователя и фото жилья .
  var getOutput = function (evt) {
    var files;
    if (evt.type === 'change' && evt.target === chooserAvatarElement) {
      files = chooserAvatarElement.files;
    }
    if (evt.type === 'change' && evt.target === chooserPhotosElement) {
      files = chooserPhotosElement.files;
    }
    if (evt.type === 'drop') {
      files = evt.dataTransfer.files;
    }
    var picturesFiles = Array.prototype.filter.call(files, function (file) {
      return FILE_TYPES.indexOf(file.name.split('.').pop().toLowerCase()) !== -1;
    });
    return picturesFiles;
  };

  // Обработчик на действия а аватаркой.
  var onChooserFileAvatar = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var output = getOutput(evt);
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      previewElement.src = reader.result;
    });
    reader.readAsDataURL(output[0]);
  };
  // Начало перетаскивания фотографии(сортировка).
  var dragPhotoStart = function (ev) {
    window.currSrc = ev.target;

  };
  // Окончание перетаскивание фотографии(сортировка).
  var dragPhotoDrop = function (ev) {
    var data = ev.dataTransfer.getData('Text');
    var img = ev.target;
    window.currSrc.src = img.src;
    img.src = data;
    ev.stopPropagation();
  };
  // Обработчик на действия с фотографиями.
  var onChooserFilePhotos = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var output = getOutput(evt);

    output.forEach(function (file) {
      var reader = new FileReader();
      reader.addEventListener('load', (function (fileSrc) {
        return function () {
          // Добавление блока с классом .form__photo
          var divElement = document.createElement('div');
          divElement.classList.add('form__photo');
          divElement.style = 'margin-right: 2px; display: inline-block;';

          var imgElement = document.createElement('img');
          imgElement.src = fileSrc.result;
          imgElement.draggable = true;
          imgElement.width = '66';
          imgElement.zIndex = '3';
          divElement.appendChild(imgElement);
          photoContainerElement.insertBefore(divElement, uploadBlockElement);
        };
      })(reader));
      reader.readAsDataURL(file);
    });
  };

  // При отпускании мыши и завершении перетаскивания мы копируем перетаскиваемые файлы.
  var onDragOver = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  };

  photoContainerElement.addEventListener('mousedown', dragPhotoStart);
  photoContainerElement.addEventListener('dragover', onDragOver, false);
  photoContainerElement.addEventListener('drop', dragPhotoDrop, false);

  chooserAvatarElement.addEventListener('change', onChooserFileAvatar);
  avatarUploadElement.addEventListener('dragover', onDragOver, false);
  avatarUploadElement.addEventListener('drop', onChooserFileAvatar, false);

  chooserPhotosElement.addEventListener('change', onChooserFilePhotos);
  photosUploadElement.addEventListener('dragover', onDragOver, false);
  photosUploadElement.addEventListener('drop', onChooserFilePhotos, false);
})();
