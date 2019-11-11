import Input from 'ROOT/components/controls/Input';
import Store from 'ROOT/store'

class InputPhone extends Input {
  constructor (label) {
    super(label);
  }

  render (createEl) {
    super.render(createEl);

    this.el.appendChild(
      this.code_ = createEl('div', 'tg-phone-country-code')
    );

    this.input.addEventListener('input', () => {
      Store.setStateValue('phone', this.input.value);
    });

    this.updateCountry_(null);
    Store.registerUpdate('country', (n, o) => {
      this.updateCountry_(n, o);
    });
  }

  updateCountry_ (country, oldCountry) {
    if (country) {
      this.input.value = country[2] + ' ';
      this.updateClassName_();
    }
  }
}

export default InputPhone;
