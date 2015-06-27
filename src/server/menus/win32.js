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
      { label: '&Undo', command: 'undo', accelerator: 'Control+Z', on: 'editor-ready' },
      { label: '&Redo', command: 'redo', accelerator: 'Control+Shift+Z', on: 'editor-ready' },
      { type: 'separator' },
      { label: '&Cut', command: 'cut', accelerator: 'Control+X', on: 'editor-ready' },
      { label: 'C&opy', command: 'copy', accelerator: 'Control+C', on: 'editor-ready' },
      { label: '&Paste', command: 'paste', accelerator: 'Control+V', on: 'editor-ready' },
      { label: 'Select &All', command: 'selectAll', accelerator: 'Control+A', on: 'editor-ready' },
      { type: 'separator' },
      { label: 'Preferences', command: 'showPreferences', accelerator: 'Control+,', on: 'preferences-ready' }
    ]
  }
];
