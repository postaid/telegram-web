import locales from 'ROOT/locales';
import Store from 'ROOT/store';

const localeName = Store.getStateValue('locale');
let locale;
updateLocale(localeName);

Store.registerUpdate('locale', (newLocale) => {
  updateLocale(newLocale);
  for (let i = 0; i < register.length; i++) {
    const e = register[i];
    updateContent(e[0], e[1]);
  }
});
const register = [];

function updateLocale (name) {
  locale = locales[name] || locales['en-us'];
}

function getContent (name) {
  return locale[name] || name;
}

function updateContent(name, el) {
  const val = getContent(name);
  if (el.nodeType === 3) {
    el.data = val;
  } else {
    el.innerText = val;
  }
  return !!val;
}

const i18n = {
  t (name, el) {
    if (!el) {
      el = document.createTextNode('');
    }
    if (updateContent(name, el)) {
      register.push([name, el]);
    }
    return el;
  },
  c (name) {
    return getContent(name);
  }
};

export default i18n;
