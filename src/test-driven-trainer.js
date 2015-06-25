let app = require('app');  // Module to control application life.
let BrowserWindow = require('browser-window');  // Module to create native browser window.
let dialog = require('dialog');
let fs = require('fs');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

let custom = {
  loadTraining: function () {
    dialog.showOpenDialog(mainWindow, {
      title: 'Choose a training file'
    }, filenames => {
      fs.readFile(filenames[0], 'utf8', function (e, data) {
        mainWindow.webContents.executeJavaScript(`editor.setValue("${data}")`);
      });
    });
  }
};

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/splash.html');

  process.nextTick(() => {
    let menu = require('./server/app-menu');
    menu
      .on('app', directive => app[directive]())
      .on('content', directive => mainWindow.webContents[directive]())
      .on('window', directive => mainWindow[directive]())
      .on('custom', directive => custom[directive]())
      .on('editor', (directive, ...args) => {
        let statement = `editor.${directive}();`;
        args = args.slice(0, -2);
        if (args.length > 0) {
          let sargs = JSON.stringify(args);
          statement = `editor.${directive}.apply(editor, ${sargs});`;
        }
        mainWindow.webContents.executeJavaScript(statement);
      })
      .on('element:style', (property, value) => {
        let statement = `editor.setOptions({ ${property}: ${JSON.stringify(value)} });`;
        mainWindow.webContents.executeJavaScript(statement);
      });
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
