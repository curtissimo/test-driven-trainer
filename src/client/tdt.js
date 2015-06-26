let ipc = require('ipc');

let tdt = null;

class TestDrivenTrainer {
  constructor(editor) {
    this._editor = editor;
  }

  quit() {
    ipc.send('tdt', 'quit');
  }

  toggleDevTools() {
    ipc.send('tdt', 'toggleDevTools');
  }

  openTraining() {
    ipc.send('tdt', 'openTraining');
  }

  reset() {
    ipc.send('tdt', 'reset');
  }

  showPreferences() {
    ipc.send('tdt', 'showPreferences');
  }

  reload() {
    ipc.send('tdt', 'reload');
  }

  undo() {
    this._editor.undo();
  }

  redo() {
    this._editor.redo();
  }

  cut() {
    this._editor.cut();
  }

  copy() {
    this._editor.cut();
  }

  paste() {
    this._editor.cut();
  }

  selectAll() {
    this._editor.cut();
  }
}

ipc.on('tdt', (event, name, ...args) => {
  tdt[name](...args);
});

export default function (editor) {
  return tdt = new TestDrivenTrainer(editor);
}
