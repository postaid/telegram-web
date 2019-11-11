import Component from './Component';

function __TEMP (root, rootComponent) {
  this.components_ = {};

  const component = this.createComponent(rootComponent);
  component.render(this.createElement);
  root.appendChild(component.el);
}

__TEMP.prototype.createElement = function (component, props, children) {
  const el = document.createElement(component);
  for (let i = 0; i < children.length; i++) {
    el.appendChild(children[i].el);
  }
}

__TEMP.prototype.createComponent = function (setup) {
  if (setup._uid) {
    return this.components_[setup._uid];
  }
  const component = new Component(setup);
  setup._uid = setup.id || String(Math.floor(Math.random() * 10000000000));
  this.components_[setup._uid] = component;
  return component;
}

export default __TEMP;
