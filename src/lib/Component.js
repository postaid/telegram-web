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

  static createElement (tag, props, children, ns) {
    let el;
    if (tag === '#text') {
      el = document.createTextNode(props || '');
      return el;
    } else {
      if (ns) {
        el = document.createElementNS(ns, tag);
      } else {
        el = document.createElement(tag);
      }
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
          const type = typeof child;
          if (type === 'string') {
            tempDiv.innerHTML = child;
            while(tempDiv.firstChild) {
              el.appendChild(tempDiv.firstChild);
            }
          } else if (child.__component) {
            el.appendChild(child.el);
          } else if (type === 'number') {
            el.appendChild(document.createTextNode(child));
          } else {
            el.appendChild(child);
          }
        }
      }
    }
    return el;
  }

  static createVoid () {
    let v = document.createComment('------');
    v.__void = true;
    return v;
  }
}

export default Component;
