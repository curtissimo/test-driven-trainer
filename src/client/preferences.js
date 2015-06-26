let settings = require('./settings');
let tdt = require('./tdt')();
let id = function (id) {
  return document.getElementById(id);
};

addEventListener('load', () => {
  id('themes').select(settings.theme);
  id('fonts').select(settings.font.replace('.ttf', ''));
});

id('themes').addEventListener('click', function () {
  settings.theme = this.selected;
});

id('fonts').addEventListener('click', function () {
  settings.font = this.selected;
});

id('back').addEventListener('click', function () {
  tdt.reset();
});
