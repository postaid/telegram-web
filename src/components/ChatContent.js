import Component from "ROOT/lib/Component";
import Store from "ROOT/store";
import MTProtoClient from "ROOT/lib/mtproto";

class ChatContent extends Component {
  constructor () {
    super();
    this.render();
  }

  render (createEl) {
    this.el = createEl('div', 'tg-chat-content', [
      createEl('div', 'tg-chat-content-header', [
        this.photo = createEl('div', 'tg-chat-list-item-photo empty')
      ]),
      this.content = createEl('div', 'tg-chat-content-content')
    ]);

    Store.registerUpdate('activeChat', (chat) => this.activeChatUpdate(chat));
    return this.el;
  }

  /**
   * @param {ChatListItem|null} chatItem
   */
  activeChatUpdate (chatItem) {
    this.photo.classList.toggle('empty', !chatItem);
    if (chatItem) {
      const messages = [];
      for (let i = chatItem.lastMsg_.id - 10; i <= chatItem.lastMsg_.id; i++) {
        const messageId = i;
        messages.push({
          _: 'inputMessageID',
          id: i
        });
      }
      MTProtoClient('messages.getMessages', {
        id: messages
      })
        .then((p) => {
          this.content.innerHTML = '';
          p.messages.forEach((m) => {
            this.content.appendChild(Component.createElement('div', 'tg-chat-message', [m.message || 'NO MESSAGE']));
          });
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
}

export default ChatContent;
