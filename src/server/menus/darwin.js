var EventEmitter = require('events').EventEmitter;
let emitter = new EventEmitter();

function emit(...args) {
  return emitter.emit.bind(emitter, ...args);
}

emitter.command = emit;

module.exports = {
  emitter: emitter,
  menu: [
    {
      label: 'Test-Driven Trainer',
      submenu: [{
        label: '&Open training...',
        click: emit('custom', 'loadTraining'),
        accelerator: 'Command+O'
      }, {
        label: '&Preferences',
        click: emit('custom', 'showPreferences'),
        accelerator: 'Command+,'
      }, {
        type: 'separator'
      }, {
        label: '&Reload',
        click: emit('content', 'reload'), accelerator: 'Command+R'
      }, {
        type: 'separator'
      }, {
        label: '&Dev Tools',
        click: emit('window', 'toggleDevTools'),
        accelerator: 'F12'
      }, {
        type: 'separator'
      }, {
        label: 'Services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: 'Hide Test-Driven Trainer',
        accelerator: 'Command+H',
        selector: 'hide:'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
      }, {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'CommandOrControl+Q',
        selector: 'terminate:'
      }]
    },

    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CommandOrControl+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CommandOrControl+Z',
          selector: 'redo:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CommandOrControl+X',
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: 'CommandOrControl+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'CommandOrControl+V',
          selector: 'paste:'
        }
      ]
    }
  ]
};
