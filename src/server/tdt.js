let ipc = require('ipc');
let Menu = require('menu');

let tdt = null;
let basedir = `file://${__dirname}`;
let clientdir = `file://${__dirname}/../client`;

function commandsToClickHandlers(menu, tdt) {
  if (menu.command) {
    menu.click = function ({ command }) {
      tdt[command]();
    };
  }
  if (menu.items) {
    menu.items.forEach(m => commandsToClickHandlers(m, tdt));
  } else if (menu.submenu) {
    menu.submenu.forEach(m => commandsToClickHandlers(m, tdt));
  }
}

class TestDrivenTrainer {
  constructor(app, window, menuTemplate) {
    this._window = window;
    this._app = app;
    menuTemplate.forEach(m => commandsToClickHandlers(m, this));

    let m = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(m);
  }

  quit() {
    this._app.quit();
  }

  toggleDevTools() {
    this._window.toggleDevTools();
  }

  openTraining() {

  }

  reset() {
    this._window.loadUrl(`${clientdir}/splash.html`);
  }

  showPreferences() {
    this._window.loadUrl(`${clientdir}/preferences.html`);
  }

  reload() {
    this._window.reload();
  }

  undo() {
    this._window.webContents.send('tdt', 'undo');
  }

  redo() {
    this._window.webContents.send('tdt', 'redo');
  }

  cut() {
    this._window.webContents.send('tdt', 'cut');
  }

  copy() {
    this._window.webContents.send('tdt', 'copy');
  }

  paste() {
    this._window.webContents.send('tdt', 'paste');
  }

  selectAll() {
    this._window.webContents.send('tdt', 'selectAll');
  }
}

ipc.on('tdt', (event, name, ...args) => {
  tdt[name](...args);
});

export default function (app, window, menu) {
  return tdt = new TestDrivenTrainer(app, window, menu);
}
