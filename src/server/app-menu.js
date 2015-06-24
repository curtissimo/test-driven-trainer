let fs = require('fs');
let Menu = require('menu');
let MenuItem = require('menu-item');
let path = require('path');
let template = require(`./menus/${process.platform}`);
let emit = template.emitter.command;

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
        click: emit('editor', 'setTheme', `ace/theme/${name}`)
      };
      item.checked = item.label === 'twilight';
      themes.submenu.push(item);
    }
  }

  template.menu.push(themes);
  
  let menu = Menu.buildFromTemplate(template.menu);
  Menu.setApplicationMenu(menu);
});

