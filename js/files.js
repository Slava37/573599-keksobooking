'use strict';

window.files = (function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooserAvatar = document.getElementById('avatar');
  var avatarPhoto = document.querySelector('.notice__photo');
  var avatarUpload = avatarPhoto.querySelector('.drop-zone');
  var preview = avatarPhoto.querySelector('img');

  function renderPhoto(file) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      preview.src = reader.result;
    });
    reader.readAsDataURL(file);

  }
  function onChooserFile(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var file;
    if (evt.type === 'change' && evt.target === fileChooserAvatar) {
      file = fileChooserAvatar.files[0];
    } else if (evt.type === 'drop') {
      file = evt.dataTransfer.files[0];
    }
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (value) {
      return fileName.endsWith(value);
    });
    if (matches) {
      renderPhoto(file);
    }
  }
  function onDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  }
  fileChooserAvatar.addEventListener('change', onChooserFile);
  avatarUpload.addEventListener('dragover', onDragOver, false);
  avatarUpload.addEventListener('drop', onChooserFile, false);
})();
