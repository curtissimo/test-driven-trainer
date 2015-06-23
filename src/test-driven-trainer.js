var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600});

  let menu = require('./server/app-menu');

  menu
    .on('application:quit', () => app.quit())
    .on('core:undo', () => mainWindow.webContents.undo())
    .on('core:redo', () => mainWindow.webContents.redo())
    .on('core:cut',  () => mainWindow.webContents.cut())
    .on('core:copy', () => mainWindow.webContents.copy())
    .on('core:paste',  () => mainWindow.webContents.paste())
    .on('core:select-all', () => mainWindow.webContents.selectAll());

  
  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
