setTimeout(() => {
  let editor = ace.edit("editor");
  editor.$blockScrolling = Infinity;
  editor.setTheme("ace/theme/twilight");
  editor.getSession().setMode("ace/mode/javascript");
  editor.setOptions({
    fontFamily: 'Droid Sans Mono',
    fontSize: '14pt'
  });
  setTimeout(() => {
    document.body.classList.remove('passive');
    document.body.classList.add('active');
    document.getElementById('editor-container').classList.remove('not-visible');
    document.getElementById('logo').classList.add('not-visible');
    setTimeout(() => {
      editor.resize();
    }, 0);
  }, 1000);
}, 3000);
