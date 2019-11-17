import Component from 'ROOT/lib/Component'
import { formatMessage } from 'ROOT/lib/TelegramMessage'
import BubbleWhole from 'ROOT/components/Bubbles/BubbleWhole'
import Store from 'ROOT/store'
import Icon2Check from 'ROOT/components/icons/Icon2Check'

class ChatMessageChannel extends Component {
  constructor (message, from) {
    super();
    this.message = message;
    this.from = from;
    this.render();
  }

  render (createEl) {
    let subinfo;
    this.el = createEl('div', 'tg-chat-message channel', [
      this.inner_ = createEl('div', 'tg-chat-message-inner', [
        this.bubbleEl_ = createEl('div', 'tg-chat-message-bubble'),
        createEl('div', 'tg-chat-message-content', [
          this.getMessageContent(this.message),
          subinfo = createEl('span', 'tg-chat-message-sub-info', [
            createEl('span', 'tg-chat-message-sub-info-item', [this.getTime(new Date(this.message.date))]),
          ])
        ])
      ])
    ]);
    this.el.id = this.message.id;
    const user = Store.getStateValue('user');
    if (user && user.id === this.message.from_id) {
      this.el.classList.add('output');
      subinfo.appendChild(createEl('span', 'tg-chat-message-sub-info-item message-sent done', [
        new Icon2Check()
      ]));
    }
    window.requestAnimationFrame(() => {
      this.bubble = new BubbleWhole(this.inner_.offsetWidth, this.inner_.offsetHeight);
      this.bubbleEl_.appendChild(this.bubble.el);
    });
    return this.el;
  }

  getMessageContent (msg) {
    if (msg._ === 'messageService') {
      return msg.action._;
    } else {
      let pref = '';
      if (msg.media) {
        // todo: Add media
        pref += '[MEDIA] ';
      }
      return pref + formatMessage(msg);
    }
  }

  getTime (date) {
    date = new Date(date);
    let h = this.leftZero(date.getHours());
    let m = this.leftZero(date.getMinutes());
    return h + ':' + m;
  }

  leftZero (num) {
    return (num < 10 ? '0' : '') + num;
  }

}

export default ChatMessageChannel;
