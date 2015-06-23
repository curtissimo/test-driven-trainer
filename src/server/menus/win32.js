var EventEmitter = require('events').EventEmitter;
let emitter = new EventEmitter();

function emit(val) {
  return emitter.emit.bind(emitter, val);
}

module.exports = {
  emitter: emitter,
  menu: [
    {
      label: '&Test-Driven Trainer',
      submenu: [
        { label: 'E&xit', click: emit('application:quit'), accelerator: 'Control+Q' }
      ]
    },

    {
      label: '&Edit',
      submenu: [
        { label: '&Undo', click: emit('core:undo'), accelerator: 'Control+Z' },
        { label: '&Redo', click: emit('core:redo'), accelerator: 'Control+Y' },
        { type: 'separator' },
        { label: '&Cut', click: emit('core:cut'), accelerator: 'Control+X' },
        { label: 'C&opy', click: emit('core:copy'), accelerator: 'Control+C' },
        { label: '&Paste', click: emit('core:paste'), accelerator: 'Control+V' },
        { label: 'Select &All', click: emit('core:select-all'), accelerator: 'Control+A' }
      ]
    }
  ]
};