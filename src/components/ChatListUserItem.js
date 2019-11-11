import Component from 'ROOT/lib/Component';

class ChatListUserItem extends Component {
  constructor (dialog, user, lastMsg) {
    super();
    this.dialog_ = dialog;
    this.user_ = user;
    this.lastMsg_ = lastMsg;
    this.render();
  }

  render (createEl) {
    let photo;
    let title = '';
    if (this.user_.deleted) {
      title = 'DELETED';
    } else {
      let fName = this.user_.first_name || '';
      let lName = this.user_.last_name || '';
      title = fName + (fName && lName ? ' ' : '') + lName;
    }

    let message = '';
    if (this.lastMsg_) {
      const msg = this.lastMsg_;
      message = (msg.message || '').slice(0, 40);
      if (msg.entities) {
        message = this.applyMessageEntities_(message, msg.entities);
      }
    }

    // debugger;


    this.el = createEl('div', {
      class: 'tg-chat-list-item',
      id: this.dialog_.peer.user_id
    }, [
      photo = createEl('div', 'tg-chat-list-item-photo'),
      createEl('div', 'tg-chat-list-item-texts', [
        createEl('div', 'tg-chat-list-item-top', [
          createEl('div', 'tg-chat-list-item-title', [title]),
          createEl('div', 'tg-chat-list-item-readed'),
          createEl('div', 'tg-chat-list-item-time')
        ]),
        createEl('div', 'tg-chat-list-item-bottom', [
          createEl('div', 'tg-chat-list-item-message', [message]),
          createEl('div', 'tg-chat-list-item-pin'),
          createEl('div', 'tg-chat-list-item-unread', [this.dialog_.unread_count || 0])
        ])
      ])
    ]);
    return this.el;
  }

  applyMessageEntities_(message, entities) {
    for (let i = entities.length - 1; i >= 0; i--) {
      const e = entities[i];
      switch(e._) {
        case 'messageEntityBold':
          message = message.slice(0, e.offset) + '<b>'
            + message.slice(e.offset, e.offset + e.length) + '</b>'
            + message.slice(e.offset + e.length);
          break;
      }
    }
    return message;
  }
}

export default ChatListUserItem;
