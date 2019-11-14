import Component from 'ROOT/lib/Component';

// TODO: RIPPLES
class ButtonSubmit extends Component {
  constructor (icon, label) {
    super();
    this.icon_ = icon;
    this.label_ = label;
    this.render();
  }

  render (createEl) {
    const children = [];
    if (this.icon_) {
      children.push(this.icon_);
    }
    if (this.label_) {
      children.push(this.label_);
    }
    this.el = createEl('div', 'tg-button-submit', children);
    this.el.addEventListener('click', () => {
      this.emit('action');
    })
    return this.el;
  }
}

export default ButtonSubmit;
