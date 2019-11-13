import Component from 'ROOT/lib/Component'
import { formatMessage } from 'ROOT/lib/TelegramMessage'

class ChatMessageChannel extends Component {
  constructor (message) {
    super();
    this.message = message;
    this.render();
  }

  render (createEl) {
    console.log(this.message);
    this.el = createEl('div', 'tg-chat-message-channel input', [this.getMessageText(this.message)]);
    return this.el;
  }

  getMessageText (msg) {
    if (msg._ === 'messageService') {
      return msg.action._;
    } else {
      return formatMessage(msg);
    }
  }
}

export default ChatMessageChannel;
