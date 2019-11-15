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
    });
    this.el.addEventListener('mousedown', (ev) => this.showRipple(ev));
    this.el.addEventListener('touchstart', (ev) => this.showRipple(ev));
    return this.el;
  }

  showRipple (ev) {
    this.el.classList.add('has-ripple');
    const ripple = document.createElement('span');
    ripple.className = 'ripple ripple-animate';
    const size = Math.max(this.el.offsetWidth, this.el.offsetHeight);
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';

    let x = ev.pageX - this.el.offsetLeft - size / 2;
    let y = ev.pageY - this.el.offsetTop - size / 2;

    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    this.el.appendChild(ripple);
  }
}

export default ButtonSubmit;
