import Component from 'ROOT/lib/Component';
import IconLoader from 'ROOT/components/icons/IconLoader'
import Ripple from 'ROOT/components/Ripple'

// TODO: RIPPLES
class ButtonSubmit extends Component {
  constructor (icon, label) {
    super();
    this.icon_ = icon;
    this.label_ = label;
    this.loader_ = null;
    this.render();
  }

  render (createEl) {
    let rippleEl;
    const children = [
      rippleEl = createEl('div', 'full-stretch tg-button-ripples')
    ];
    if (this.icon_) {
      children.push(this.icon_);
    }
    if (this.label_) {
      children.push(this.createLabel_(this.label_));
    }
    this.el = createEl('div', 'tg-button tg-button-submit', children);
    this.el.addEventListener('click', () => {
      this.emit('action');
    });
    const ripple = new Ripple(rippleEl);
    this.el.addEventListener('mousedown', (ev) => ripple.show(ev));
    this.el.addEventListener('touchstart', (ev) => ripple.show(ev));
    return this.el;
  }

  showLoader () {
    if (this.loader_) {
      return;
    }

    this.loader_ = new IconLoader();
    this.el.appendChild(this.loader_.el);
  }

  hideLoader () {
    if (!this.loader_) {
      return;
    }

    this.el.removeChild(this.loader_.el);
    this.loader_ = null;
  }

  createLabel_ (label) {
    return this.labelEl_ = Component.createElement('span', 'tg-button-submit-label', [label]);
  }

  setLabel (label) {
    this.label_ = label;
    if (this.labelEl_) {
      while(this.labelEl_.firstChild) {
        this.labelEl_.removeChild(this.labelEl_.firstChild);
      }
      this.labelEl_.appendChild(label);
    } else {
      this.createLabel_(label);
    }
  }
}

export default ButtonSubmit;
