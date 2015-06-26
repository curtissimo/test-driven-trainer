function lsget(key, def) {
  let value = localStorage.getItem(key);
  if (!value) {
    localStorage.setItem(key, def);
    value = def;
  }
  return value;
}

const defaultFont = 'DroidSansMono.ttf';
const defaultTheme = 'solarized_light';
let validFonts = /^(DroidSansMono|Inconsolata-Regular|OxygenMono-Regular|PTM55FT|RobotoMono-Regular|SourceCodePro-Regular)$/;

class Settings {
  get font() {
    return lsget('font', defaultFont);
  }

  set font(value) {
    if (!value.match(validFonts)) {
      value = defaultFont;
    }
    localStorage.setItem('font', value);
  }

  get theme() {
    return lsget('theme', defaultTheme);
  }

  set theme(value) {
    localStorage.setItem('theme', value);
  }
}

export default new Settings();
