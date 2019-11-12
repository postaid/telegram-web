import Component from "ROOT/lib/Component";

class ChatContent extends Component {
  constructor () {
    super();
    this.render();
  }

  render (createEl) {
    this.el = createEl('div', 'tg-chat-content');
    return this.el;
  }
}

export default ChatContent;
