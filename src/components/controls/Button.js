import Component from 'ROOT/lib/Component';

class Button extends Component {
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
      children.push(this.i18n.t(this.label_));
    }
    this.el = createEl('div', 'tg-button', children);
    this.el.addEventListener('click', () => {
      this.emit('action');
    })
    return this.el;
  }
}

export default Button;
