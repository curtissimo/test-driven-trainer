let fs = require('fs');
let Menu = require('menu');
let MenuItem = require('menu-item');
let path = require('path');
let template = require(`./menus/${process.platform}`);
module.exports = template.emitter;

fs.readdir(path.join(__dirname, '..', 'vendor', 'ace'), function (e, files) {
  for (var file of files) {
    if (file.startsWith('theme-')) {
      let item = {
        label: path.basename(file.substring(6), '.js').trim()
      };
      item.checked = item.label === 'twilight';
      // template[1].submenu.push(item);
    }
  }

  // template.unshift(appMenus[process.platform]);
  
  let menu = Menu.buildFromTemplate(template.menu);
  Menu.setApplicationMenu(menu);
});

