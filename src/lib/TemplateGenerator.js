const data = {};
export default {
  generate (template, name) {
    let tpl = data[name];
    if (!tpl) {
      const frag = document.createElement('div');
      frag.innerHTML = template;
      data[name] = tpl = frag.firstChild;
    }
    return tpl.cloneNode(true);
  }
}
