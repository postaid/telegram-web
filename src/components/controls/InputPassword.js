import Component from 'ROOT/lib/Component';

class InputPassword extends Component {
  constructor (label) {
    super();
    this.label_ = label;
    this.labelEl_ = null;
    this.input = null;
    this.render();
  }

  render (createEl) {
    this.el = createEl('div', 'tg-input', [
      this.input = createEl('input', {class: 'tg-input-input', type: 'password'}),
      this.labelEl_ = createEl('div', 'tg-input-label', [this.i18n.t(this.label_)])
    ]);

    this.input.addEventListener('focus', () => {
      this.focused_ = true;
      this.updateFocused_();
    });
    this.input.addEventListener('blur', () => {
      this.focused_ = false;
      this.updateFocused_();
    });
    this.input.addEventListener('input', (ev) => {
      this.updateClassName_();
      this.emit('input', this.input.value, ev);
    });
    return this.el;
  }
  updateFocused_ () {
    this.updateClassName_();
  }

  updateClassName_ () {
    this.el.classList.toggle('focused', this.focused_);
    this.el.classList.toggle('notempty', this.input.value !== '');
  }

  getValue () {
    return this.input.value;
  }
}

export default InputPassword;
