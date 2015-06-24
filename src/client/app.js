let id = document.getElementById.bind(document);
let keys = {
  shift: 16,
  control: 17,
  enter: 13
}
let control = false;
let remote = require('remote');
let remrequire = remote.require;

setTimeout(() => {
  let editor = ace.edit("editor");
  editor.$blockScrolling = Infinity;
  editor.setTheme("ace/theme/twilight");
  editor.getSession().setMode("ace/mode/javascript");
  editor.setOptions({
    fontFamily: 'Droid Sans Mono',
    fontSize: '12pt'
  });

  function evaluate() {
    let i = 1;
    let raw = 'var __line_number__ = 1;' + editor.getValue();
    raw = raw.replace(/\n/g, () => {
      i += 1;
      return '\n__line_number__ = ' + i + ';';
    });
    let output = id('console-output');
    output.innerHTML = '';
    let code = babel.transform(raw).code;
    code = code.replace(/require\(/g, 'remrequire(');
    code = code.replace(/assert\.([^\(]+)\(/g, 'assert.$1(__line_number__, ')
    code += '\nTDT.run();';
    try {
      eval(code);
    } finally {
      for (var err of TDT.errors) {
        output.innerHTML += `<div class="evaluation-error">
          <div class="evaluation-error-name" >Name: ${err.testName}</div>
          <div class="evaluation-error-position" data-value="${err.lineNumber}">Line number: ${err.lineNumber}</div>
          <div class="evaluation-error-message">${err}</div>
        </div>`;
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

