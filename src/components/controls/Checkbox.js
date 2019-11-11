import Component from 'ROOT/lib/Component';

class Checkbox extends Component {
  constructor (label) {
    super();
    this.label_ = label;
    this.input = null;
    this.render();
  }

  render (createEl) {
    this.el = createEl('label', 'tg-checkbox', [
      this.input = createEl('input', {class: 'tg-checkbox-input', type: 'checkbox'}),
      createEl('div', 'tg-checkbox-wrapper'),
      createEl('div', 'tg-checkbox-label', [this.i18n.t(this.label_)])
    ]);

    this.input.addEventListener('change', (ev) => {
      this.emit('change', this.input.checked);
    });
    return this.el;
  }

  setValue (value) {
    this.input.checked = value;
  }
}

export default Checkbox;
