let app = null;

addEventListener('load', () => {
  document.body.removeAttribute('unresolved');

  let link = document.createElement('link');
  link.rel = 'import';
  link.href = './components/preferences-dialog/preferences-dialog.html';
  document.head.appendChild(link);

  let dialog = document.createElement('preferences-dialog');
  document.body.appendChild(dialog);

  app = require('./tdt')(dialog);
});
