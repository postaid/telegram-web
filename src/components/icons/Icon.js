import Component from 'ROOT/lib/Component';
import TemplateGenerator from 'ROOT/lib/TemplateGenerator';

class Icon extends Component {
  constructor (template, name) {
    super();
    this.render(template, name);
  }
  render (createEl, template, name) {
    this.el = TemplateGenerator.generate(template, name);
    this.el.classList.add(name);
  }
}

export default Icon;
