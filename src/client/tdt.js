let ipc = require('ipc');

let tdt = null;

class TestDrivenTrainer {
  constructor(prefDialog, editor) {
    this._editor = editor;
    this._prefDialog = prefDialog;
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
    this._prefDialog.open();
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

ipc.on('tdt', (name, ...args) => {
  tdt[name](...args);
});

export default function (prefDialog, editor) {
  return tdt = new TestDrivenTrainer(prefDialog, editor);
}
