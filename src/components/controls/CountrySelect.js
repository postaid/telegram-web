import Component from 'ROOT/lib/Component';
import Store from 'ROOT/store';
import Config from 'ROOT/config';
import IconDropdownArrow from 'ROOT/components/icons/IconDropdownArrow'
import Button from 'ROOT/components/controls/Button'
import { getParentByClass } from 'ROOT/lib/utils'

class CountrySelect extends Component {
  constructor (label) {
    super();
    this.label_ = label;
    this.input_ = null;
    this.focused_ = false;
    this.expanded_ = false;
    this.options_ = [];
    this.country_ = null;
    this.render();
    this.updateOpened_();
  }

  render (createEl) {
    this.createOptions_(createEl);

    const icon = new IconDropdownArrow();
    const button = new Button(icon);
    button.el.classList.add('tg-select-button');

    let selectContent;
    this.el = createEl('div', 'tg-country-select', [
      this.input_ = createEl('input', 'tg-select-input'),
      createEl('div', 'tg-select-label', [this.i18n.t(this.label_)]),
      createEl('div', 'tg-select-dropdown', [
        selectContent = createEl('div', 'tg-select-content', this.options_)
      ]),
      button
    ]);
    selectContent.style.marginRight = -Config.ui.scrollbarWidth + 'px';

    const fnApply = (ev) => {
      const opt = getParentByClass(ev.target, 'tg-select-option', true);
      if (opt) {
        const countryName = this.i18n.c(opt.__val__[1]);
        this.input_.value = countryName;
        this.expanded_ = false;
        this.input_.blur();
        this.setCountry_(opt.__val__);
        this.updateClassName_();
        this.applyFilteredOpyions_(selectContent, countryName);
      }
    };

    selectContent.addEventListener('mousedown', (ev) => {
      ev.preventDefault();
    });
    selectContent.addEventListener('click', fnApply);

    this.input_.addEventListener('focus', () => {
      this.focused_ = true;
      this.expanded_ = true;
      this.updateFocused_();
    });
    this.input_.addEventListener('blur', () => {
      this.focused_ = false;
      this.expanded_ = false;
      this.updateFocused_();
    });
    this.input_.addEventListener('input', () => {
      const value = this.input_.value;
      this.updateClassName_();
      const filtered = this.applyFilteredOpyions_(selectContent, value);
      if (filtered.length === 1 && value.toLowerCase() === filtered[0].searchIndex.rest) {
        this.setCountry_(filtered[0].__val__);
      } else {
        this.setCountry_(null);
      }
    });

    const fn = (ev) => {
      this.expanded_ = !this.expanded_;
      this.updateOpened_();
      ev.stopPropagation();
      ev.preventDefault();
    }
    button.el.addEventListener('mousedown', fn);
    button.el.addEventListener('touchend', fn);

    return this.el;
  }

  createOptions_ (createEl) {
    const countries = Config.CountryCodes;
    const options = [];
    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      let opt, flag;
      const countryName = this.i18n.c(country[1]);
      options.push(opt = createEl('div', 'tg-select-option', [
        // flag = createEl('div', 'tg-country-flag'),
        this.i18n.t(country[1]),
        createEl('div', 'tg-country-code', [country[2]])
      ]));
      opt.__val__ = country;
      let lower = countryName.toLowerCase();
      opt.searchIndex = {1: lower[0], 2: lower.slice(0, 2), rest: lower};
      // TODO: Add flags
      /*
            let flagX = i % 40;
            let flagY = Math.floor(i / 40);
            flag.style.backgroundPosition = `-${flagX * 45}px -${flagY * 45}px`;
      */
    }
    this.options_ = options;
  }

  setCountry_ (country) {
    this.country_ = country;
    Store.setStateValue('country', country);
  }

  filterOptions_ (value) {
    value = value.toLowerCase();
    if (!value) {
      return this.options_;
    }
    const compareField = value.length === 1 ? '1' : (value.length === 2 ? '2' : 'rest');
    const filtered = [];
    if (compareField !== 'rest') {
      for (let i = 0; i < this.options_.length; i++) {
        const option = this.options_[i];
        if (option.searchIndex[compareField] === value) {
          filtered.push(option);
        }
      }
    } else {
      for (let i = 0; i < this.options_.length; i++) {
        const option = this.options_[i];
        if (option.searchIndex.rest.indexOf(value) === 0) {
          filtered.push(option);
        }
      }
    }
    return filtered;
  }

  applyFilteredOpyions_ (selectContent, value) {
    let filtered = this.filterOptions_(value);
    if (filtered.length === 0) {
      filtered = this.options_;
    }
    selectContent.innerHTML = '';
    for (let i = 0; i < filtered.length; i++) {
      selectContent.appendChild(filtered[i]);
    }
    return filtered;
  }

  updateFocused_ () {
    this.updateClassName_();
  }

  updateOpened_ () {
    this.updateClassName_();
    if (this.expanded_) {
      this.input_.focus();
    }
  }

  updateClassName_ () {
    this.el.classList.toggle('focused', this.focused_);
    this.el.classList.toggle('notempty', this.input_.value !== '');
    this.el.classList.toggle('expanded', this.expanded_);
  }
}

export default CountrySelect;
