
class Ripple {
  constructor (element) {
    this.element = element;
  }
  show (ev) {
    if (ev.touches && ev.touches.length) {
      ev = ev.touches[0];
    }
    this.element.classList.add('has-ripple');
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(this.element.offsetWidth, this.element.offsetHeight);
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';

    const bbox = this.element.getBoundingClientRect();
    let x = ev.pageX - (document.body.scrollLeft || document.documentElement.scrollLeft) - bbox.left - size / 2;
    let y = ev.pageY - (document.body.scrollTop || document.documentElement.scrollTop) - bbox.top - size / 2;

    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    this.element.appendChild(ripple);
    window.requestAnimationFrame(() => {
      ripple.classList.add('ripple-animate')
    });

    setTimeout(() => {
      this.element.removeChild(ripple);
    }, 600);

  }
}

export default Ripple;
