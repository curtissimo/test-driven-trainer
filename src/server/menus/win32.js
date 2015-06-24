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
      label: '&Test-Driven Trainer',
      submenu: [
        { label: 'E&xit', click: emit('app', 'quit'), accelerator: 'Control+Q' }
      ]
    },

    {
      label: '&Edit',
      submenu: [
        { label: '&Undo', click: emit('editor', 'undo'), accelerator: 'Control+Z' },
        { label: '&Redo', click: emit('editor', 'redo'), accelerator: 'Control+Shift+Z' },
        { type: 'separator' },
        { label: '&Cut', click: emit('content', 'cut'), accelerator: 'Control+X' },
        { label: 'C&opy', click: emit('content', 'copy'), accelerator: 'Control+C' },
        { label: '&Paste', click: emit('content', 'paste'), accelerator: 'Control+V' },
        { label: 'Select &All', click: emit('editor', 'selectAll'), accelerator: 'Control+A' }
      ]
    }
  ]
};