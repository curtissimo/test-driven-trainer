module.exports = [
  {
    label: '&File',
    submenu: [
      { label: '&Open training...', command: 'openTraining', accelerator: 'Control+O' },
      { type: 'separator' },
      { label: '&Reload', command: 'reload', accelerator: 'Control+R' },
      { type: 'separator' },
      { label: '&Dev Tools', command: 'toggleDevTools', accelerator: 'F12' },
      { type: 'separator' },
      { label: 'E&xit', command: 'quit', accelerator: 'Control+Q' }
    ]
  },

  {
    label: '&Edit',
    submenu: [
      { label: '&Undo', command: 'undo', accelerator: 'Control+Z' },
      { label: '&Redo', command: 'redo', accelerator: 'Control+Shift+Z' },
      { type: 'separator' },
      { label: '&Cut', command: 'cut', accelerator: 'Control+X' },
      { label: 'C&opy', command: 'copy', accelerator: 'Control+C' },
      { label: '&Paste', command: 'paste', accelerator: 'Control+V' },
      { label: 'Select &All', command: 'selectAll', accelerator: 'Control+A' },
      { type: 'separator' },
      { label: 'Preferences', command: 'showPreferences', accelerator: 'Control+,' }
    ]
  }
];
