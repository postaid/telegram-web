import i18n from 'ROOT/lib/i18n';
import EventEmitter from 'ROOT/lib/EventEmitter'

const tempDiv = document.createElement('div');

class Component extends EventEmitter {
  constructor () {
    super();
    /**
     * @type {HTMLElement}
     */
    this.el = null;
    this.__component = true;
    this.i18n = i18n;
    this.render = this.render.bind(this, Component.createElement);
  }

  update () {

  }

  render () {

  }

  static createElement (tag, props, children) {
    let el;
    if (tag === '#text') {
      el = document.createTextNode(props || '');
      return el;
    } else {
      el = document.createElement(tag);
      if (props) {
        if (typeof props === 'string') {
          el.className = props;
        } else {
          for (let i in props) if (props.hasOwnProperty(i)) {
            el.setAttribute(i, props[i]);
          }
        }
      }
      if (children) {
        for (let i = 0; i < children.length; i++) {
          let child = children[i];
          if (typeof child === 'string') {
            tempDiv.innerHTML = child;
            while(tempDiv.firstChild) {
              el.appendChild(tempDiv.firstChild);
            }
          } else if (child.__component) {
            el.appendChild(child.el);
          } else {
            el.appendChild(child);
          }
        }
      }
    }
    return el;
  }
}

export default Component;
