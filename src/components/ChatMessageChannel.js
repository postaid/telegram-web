import Component from 'ROOT/lib/Component'
import { formatMessage } from 'ROOT/lib/TelegramMessage'
import BubbleWhole from 'ROOT/components/Bubbles/BubbleWhole'

class ChatMessageChannel extends Component {
  constructor (message) {
    super();
    this.message = message;
    this.render();
  }

  render (createEl) {

    this.el = createEl('div', 'tg-chat-message', [
      this.inner_ = createEl('div', 'tg-chat-message-inner', [
        this.bubbleEl_ = createEl('div', 'tg-chat-message-bubble'),
        createEl('div', 'tg-chat-message-content', [
          this.getMessageText(this.message),
          createEl('span', 'tg-chat-message-date', [this.getTime(new Date(this.message.date))])
        ])
      ])
    ]);
    window.requestAnimationFrame(() => {
      this.bubble = new BubbleWhole(this.inner_.offsetWidth, this.inner_.offsetHeight);
      this.bubbleEl_.appendChild(this.bubble.el);
    });
    return this.el;
  }

  getMessageText (msg) {
    if (msg._ === 'messageService') {
      return msg.action._;
    } else {
      return formatMessage(msg);
    }
  }

  getTime (date) {
    date = new Date(date);
    let m = this.leftZero(date.getMinutes());
    let s = this.leftZero(date.getSeconds());
    return m + ':' + s;
  }

  leftZero (num) {
    return (num < 10 ? '0' : '') + num;
  }

}

export default ChatMessageChannel;
