class Assertions {
  ok(line, value) {
    if (!value) {
      throw {
        name: 'VerificationError',
        lineNumber: line,
        toString: function () {
          return 'Expected value to be truthy';
        }
      };
    }
  }

  equal(line, expected, value) {
    if (expected !== value) {
      throw {
        name: 'VerificationError',
        lineNumber: line,
        toString: function () {
          return `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(value)}`;
        }
      };
    }
  }

  equalish(line, expected, value) {
    if (expected != value) {
      throw {
        name: 'VerificationError',
        lineNumber: line,
        toString: function () {
          return `Expected something like ${JSON.stringify(expected)} but got ${JSON.stringify(value)}`;
        }
      };
    }
  }
}

class Tester {
  constructor() {
    this._tests = {};
    this._errors = [];
    this._assert = new Assertions();
  }

  test(name, fn) {
    this._tests[name] = fn;
  }

  reset() {
    this._tests = {};
    this._errors = [];
  }

  run() {
    for (let key of Object.keys(this._tests)) {
      try {
        this._tests[key](this._assert);
      } catch (e) {
        e.testName = key;
        this._errors.push(e);
      }
    }
  }

  get errors() {
    return this._errors;
  }
}

var TDT = new Tester();
