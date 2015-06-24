let app = require('app');  // Module to control application life.
let BrowserWindow = require('browser-window');  // Module to create native browser window.

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

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600});

  let menu = require('./server/app-menu');

  menu
    .on('app', directive => app[directive]())
    .on('content', directive => mainWindow.webContents[directive]())
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
      let statement = `document.getElementById('editor').style.${property} = '${value}'`;
      mainWindow.webContents.executeJavaScript(statement);
    })

  
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
