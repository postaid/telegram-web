import Component from 'ROOT/lib/Component'
import MTProtoClient from 'ROOT/lib/mtproto'
import Store from 'ROOT/store'
import ChatListUserItem from 'ROOT/components/ChatListUserItem'

class ChatsList extends Component {
  constructor () {
    super();
    this.render();
  }

  render (createEl) {
    this.el = createEl('div', 'tg-channels', [
      this.chatsList = createEl('div', 'tg-chats-list')
    ]);

    Store.registerUpdate('chats', (chats) => {
      this.updateChatsList_(chats, createEl);
    })
    MTProtoClient('messages.getDialogs', {
      flags: 0,
      exclude_pinned: false,
      folder_id: 0,
      offset_date: 0,
      offset_id: 0,
      offset_peer: {
        _: 'inputPeerEmpty'
      },
      limit: 0,
      hash: 0,
    })
      .then(({chats, dialogs, messages, users}) => {
        this.createChatsList_(dialogs, chats, users, messages);
      })
      .catch((err) => {
        if (err.code === 401) {
          Store.setStateValue('authorized', false);
        }
      })
    return this.el;
  }

  createChatsList_ (dialogs, chats, users, messages) {
    const elements = [];
    for (let i = 0; i < dialogs.length; i++) {
      const dialog = dialogs[i];
      switch (dialog.peer._) {
        case 'peerUser':
          const user = this.findById_(users, dialog.peer.user_id);
          if (user) {
            const lastMessage = this.findById_(messages, dialog.top_message);
            elements.push(new ChatListUserItem(dialog, user, lastMessage));
          }
          break;
        case 'peerChannel':
          break;
      }
    }
    this.chatsList.innerHTML = '';
    elements.forEach(e => this.chatsList.appendChild(e.el));
  }

  findById_(users, id) {
    return users.find(u => u.id === id);
  }

  updateChatsList_ (list, createEl) {
    const chats = list.map((chat) => {
      return createEl('div', {
        class: 'tg-chats-list-item',
        id: chat.id,
      }, [
        chat.title
      ])
    })
    this.chatsList.innerHTML = '';
    chats.forEach(c => this.chatsList.appendChild(c));
    console.log(list);
  }
}

export default ChatsList
