let app = require('app');
let BrowserWindow = require('browser-window');
let menuTemplate = require(`./server/menus/${process.platform}`);

let tdt = null;

require('crash-reporter').start();

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  let mainWindow = new BrowserWindow({
    'min-width': 800,
    'min-height': 600
  });

  tdt = new require('./server/tdt')(app, mainWindow, menuTemplate);
  tdt.reset();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
