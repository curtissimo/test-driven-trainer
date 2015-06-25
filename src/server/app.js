let path = require('path');
let root = path.join(__dirname, '..');

class TestDrivenTraining {
  constructor(app, window, menu) {
    this._app = app;
    this._window = window;
    this._menu = menu;
  }

  start() {
    this._window.loadUrl()
  }
}

module.exports = TestDrivenTraining;
