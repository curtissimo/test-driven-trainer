module.exports = [
  {
    label: 'Test-Driven Trainer',
    submenu: [{
      label: '&Preferences',
      command: 'showPreferences',
      accelerator: 'Command+,',
      on: 'preferences-ready'
    }, {
      type: 'separator'
    }, {
      label: '&Reload',
      command: 'reload',
      accelerator: 'Command+R'
    }, {
      type: 'separator'
    }, {
      label: '&Dev Tools',
      command: 'toggleDevTools',
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
      accelerator: 'Command+Q',
      selector: 'terminate:'
    }]
  },

  {
    label: 'File',
    submenu: [
      {
        label: '&Open training...',
        command: 'openTraining',
        accelerator: 'Command+O'
      }
    ]
  },

  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:',
        on: 'editor-ready'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:',
        on: 'editor-ready'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:',
        on: 'editor-ready'
      },
      {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:',
        on: 'editor-ready'
      },
      {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:',
        on: 'editor-ready'
      }
    ]
  }
];
