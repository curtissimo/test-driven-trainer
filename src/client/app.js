let id = document.getElementById.bind(document);
let keys = {
  shift: 16,
  control: 17,
  enter: 13
}
let control = false;
let remote = require('remote');
let remrequire = remote.require;
let editor = ace.edit("editor");
let setTheme = editor.setTheme.bind(editor);
let setOptions = editor.setOptions.bind(editor);

editor.setTheme = theme => {
  localStorage.setItem('theme', theme);
  setTheme(theme);
};

editor.setOptions = (options) => {
  let o = JSON.parse(localStorage.getItem('options')) || {};
  Object.assign(o, options);
  localStorage.setItem('options', JSON.stringify(o));
  setOptions(o);
};

setTimeout(() => {
  let theme = localStorage.getItem('theme') || 'ace/theme/twilight';
  let options = JSON.parse(localStorage.getItem('options')) || {
    fontFamily: 'Droid Sans Mono',
    fontSize: '12pt'
  };
  editor.$blockScrolling = Infinity;
  editor.setTheme(theme);
  editor.getSession().setMode("ace/mode/javascript");
  editor.getSession().setTabSize(2);
  editor.getSession().setUseSoftTabs(true);
  editor.setOptions(options);

  function evaluate() {
    let i = 0;
    let raw = editor.getValue();
    raw = raw.replace(/([^\n]*)\n?/g, (match, p1) => {
      i += 1;
      return p1.replace(/assert\.([^\(]+)\(/g, `assert.$1(${i}, `) + '\n';
    });
    let output = id('console-output');
    output.innerHTML = '';
    try {
      let code = babel.transform(raw).code;
      code = code.replace(/require\(/g, 'remrequire(');
      code += '\nTDT.run();';
      eval(code);
    } catch(e) {
      output.innerHTML = `<div class="evaluation-error">${e}</div>`;
    } finally {
      if (id('console').classList.contains('not-visible')) {
        id('console').classList.toggle('not-visible');
      }
      for (var result of TDT.results) {
        if (result.ok) {
          output.innerHTML += `<div class="evaluation-passed">
            <div class="evaluation-passed-name" >Test "${result.testName}" passed</div>
          </div>`;
        } else {
          output.innerHTML += `<div class="evaluation-error">
            <div class="evaluation-error-name" >Name: ${result.testName}</div>
            <div class="evaluation-error-position" data-value="${result.lineNumber}">Line number: ${result.lineNumber}</div>
            <div class="evaluation-error-message">${result}</div>
          </div>`;
        }
      }
    }
    TDT.reset();
  }

  id('toggle-console').addEventListener('click', e => {
    e.preventDefault();
    id('console').classList.toggle('not-visible');
    editor.resize();
  });
  id('toggle-console-position').addEventListener('click', e => {
    e.preventDefault();
    id('editor-and-console').classList.toggle('vertical');
    id('toggle-console-position').classList.toggle('vertical');
    editor.resize();
  });
  id('evaluate').addEventListener('click', e => {
    e.preventDefault();
    evaluate();
  });
  document.body.addEventListener('keydown', function (e) {
    if (!control) {
      control = e.keyCode === keys.control;
    }
    if (control && e.keyCode === keys.enter) {
      evaluate();
    }
  });
  document.body.addEventListener('keyup', function (e) {
    if (control && e.keyCode === keys.control) {
      control = false;
    }
  });
  document.body.addEventListener('click', function (e) {
    if (e.target.classList.contains('evaluation-error-position')) {
      editor.gotoLine(e.target.getAttribute('data-value'));
      editor.centerSelection();
    }
  });
  setTimeout(() => {
    document.body.classList.remove('passive');
    document.body.classList.add('active');
    id('editor-container').classList.remove('not-visible');
    id('logo').classList.add('not-visible');
    setTimeout(() => {
      editor.resize();
    }, 0);
  }, 1000);
}, 1000);

