'use strict';

window.files = (function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooserAvatar = document.getElementById('avatar');
  var noticePhoto = document.querySelector('.notice__photo');
  var avatarUpload = noticePhoto.querySelector('.drop-zone');

  var fileChooserPhotos = document.getElementById('images');
  var photoContainer = document.querySelector('.form__photo-container');
  var photosUpload = photoContainer.querySelector('.drop-zone');
  var uploadBlock = photoContainer.querySelector('.upload');

  var preview = noticePhoto.querySelector('img');

  // Удаляет загруженные фото и выставляет дефолтное значение аватара.
  window.resetOutputs = function () {
    preview.src = 'img/muffin.png';
    var photos = photoContainer.querySelectorAll('.form__photo');
    photos.forEach(function (value) {
      value.parentNode.removeChild(value);
    });
  };

  // Создадим логику загрузки файла загрузку файла для аватарки пользователя и фото жилья .
  function getOutput(evt) {
    var file;
    if (evt.type === 'change' && evt.target === fileChooserAvatar) {
      file = fileChooserAvatar.files;
    }
    if (evt.type === 'change' && evt.target === fileChooserPhotos) {
      file = fileChooserPhotos.files;
    }
    if (evt.type === 'drop') {
      file = evt.dataTransfer.files;
    }
    var files = [];
    var matches;
    for (var i = 0; i < file.length; i++) {
      var fileName = file[i].name.toLowerCase();
      matches = FILE_TYPES.some(function (value) {
        return fileName.endsWith(value);
      });
      if (matches) {
        files.push(file[i]);
      }
    }
    return files;
  }

  // Обработчик на действия а аватаркой.
  function onChooserFileAvatar(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var output = getOutput(evt);
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      preview.src = reader.result;
    });
    reader.readAsDataURL(output[0]);
  }
  // Обработчик на действия с фотографиями.
  function onChooserFilePhotos(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var output = getOutput(evt);

    for (var i = 0; i < output.length; i++) {

      var reader = new FileReader();
      reader.addEventListener('load', (function (file) {
        return function () {
          // Добавление блока с классом .form__photo
          var div = document.createElement('div');
          div.classList.add('form__photo');
          div.style = 'margin-right: 2px; display: inline-block;';

          var img = document.createElement('img');
          img.src = file.result;
          img.width = '66';
          img.draggable = true;
          img.zIndex = '100';
          div.appendChild(img);
          photoContainer.insertBefore(div, uploadBlock);
        };
      })(reader));
      reader.readAsDataURL(output[i]);
    }


  }
  // При отпускании мыши и завершении перетаскивания мы копируем перетаскиваемые файлы.
  function onDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  }

  fileChooserAvatar.addEventListener('change', onChooserFileAvatar);
  avatarUpload.addEventListener('dragover', onDragOver, false);
  avatarUpload.addEventListener('drop', onChooserFileAvatar, false);

  fileChooserPhotos.addEventListener('change', onChooserFilePhotos);
  photosUpload.addEventListener('dragover', onDragOver, false);
  photosUpload.addEventListener('drop', onChooserFilePhotos, false);
})();
