let fs = require('fs');
let Menu = require('menu');
let MenuItem = require('menu-item');
let path = require('path');
let template = require(`./menus/${process.platform}`);

let defaultSize = '14pt';
let currentSize = defaultSize;
let emit = template.emitter.command;
let family = function (font) {
  return emit('element:style', 'fontFamily', `${font}`);
};
let size = function (delta) {
  currentSize = (parseInt(currentSize) + delta) + 'pt';
  return emit('element:style', 'fontSize', `${currentSize}`);
};

module.exports = template.emitter;

fs.readdir(path.join(__dirname, '..', 'vendor', 'ace'), function (e, files) {
  let themes = {
    label: 'Themes',
    submenu: []
  };

  for (var file of files) {
    if (file.startsWith('theme-')) {
      let name = path.basename(file.substring(6), '.js').trim();
      let item = {
        label: name,
        type: 'radio',
        click: emit('editor', 'setTheme', `ace/theme/${name}`)
      };
      item.checked = item.label === 'twilight';
      themes.submenu.push(item);
    }
  }

  template.menu.push(themes);

  template.menu.push({
    label: 'Fonts',
    submenu: [
      { label: 'Droid',           type: 'radio', click: family('Droid Sans Mono') },
      { label: 'Inconsolata',     type: 'radio', click: family('Inconsolata') },
      { label: 'Oxygen',          type: 'radio', click: family('Oxygen Mono') },
      { label: 'PT',              type: 'radio', click: family('PT Mono') },
      { label: 'Roboto',          type: 'radio', click: family('Roboto Mono') },
      { label: 'Source Code Pro', type: 'radio', click: family('Source Code Pro') },
      { type: 'separator' },
      { label: 'Increase size',   accelerator: 'CommandOrControl+=', click: () => size(2)() },
      { label: 'Decrease size',   accelerator: 'CommandOrControl+-', click: () => size(-2)() },
      { label: 'Reset',           accelerator: 'CommandOrControl+0', click: () => {
        currentSize = defaultSize;
        emit('element:style', 'fontSize', defaultSize)();
      }}
    ]
  })
  
  let menu = Menu.buildFromTemplate(template.menu);
  Menu.setApplicationMenu(menu);
});

