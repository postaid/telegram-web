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
      ])
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
          debugger;
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
}

export default ChatContent;
