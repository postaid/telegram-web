import Component from 'ROOT/lib/Component';
import Ripple from 'ROOT/components/Ripple'

class Button extends Component {
  constructor (icon, label) {
    super();
    this.icon_ = icon;
    this.label_ = label;
    this.render();
  }

  render (createEl) {
    let rippleEl;
    const children = [
      rippleEl = createEl('div', 'full-stretch')
    ];
    if (this.icon_) {
      children.push(this.icon_);
    }
    if (this.label_) {
      children.push(this.i18n.t(this.label_));
    }
    this.el = createEl('div', 'tg-button', children);
    this.el.addEventListener('click', () => {
      this.emit('action');
    });
    const ripple = new Ripple(rippleEl);
    this.el.addEventListener('mousedown', (ev) => ripple.show(ev));
    this.el.addEventListener('touchstart', (ev) => ripple.show(ev));
    return this.el;
  }
}

export default Button;
