import Component from "ROOT/lib/Component";

class ChatListItem extends Component {
  constructor (dialog, peer, lastMsg) {
    super();
    this.dialog_ = dialog;
    this.peer_ = peer;
    this.lastMsg_ = lastMsg;
    this.render();
  }

  render (createEl) {
    let [message, time] = this.getLastMessageData();
    let unreadCount = this.getUnreadCount();
    let title = this.getTitle();

    this.createItem(createEl, title, message, time, unreadCount);

    this.el.addEventListener('click', () => {
      this.emit('click', this);
    });
  }

  createItem(createEl, title, message, time, unreadCount) {
    this.el = createEl('div', {
      class: 'tg-chat-list-item',
      id: this.peer_.id
    }, [
      this.photo_ = createEl('div', 'tg-chat-list-item-photo'),
      this.onlineStatus_ = this.isOnline() ? createEl('div', 'tg-chat-list-item-online') : Component.createVoid(),
      createEl('div', 'tg-chat-list-item-texts', [
        createEl('div', 'tg-chat-list-item-top', [
          createEl('div', 'tg-chat-list-item-title', [title]),
          createEl('div', 'tg-chat-list-item-readed'),
          createEl('div', 'tg-chat-list-item-time', [time])
        ]),
        createEl('div', 'tg-chat-list-item-bottom', [
          createEl('div', 'tg-chat-list-item-message', [message]),
          createEl('div', 'tg-chat-list-item-pin'),
          this.unreadCount_ = unreadCount ? createEl('div', 'tg-chat-list-item-unread', [unreadCount]) : Component.createVoid()
        ])
      ])
    ]);
    return this.el;
  }

  getUnreadCount () {
    let  unreadCount = this.dialog_.unread_count || 0;
    if (unreadCount > 999) {
      unreadCount = '999+';
    }
    return unreadCount;
  }

  getLastMessageData () {
    let message = '', time = '';
    if (this.lastMsg_) {
      const msg = this.lastMsg_;
      message = (msg.message || '').slice(0, 80) + '';
      if (msg.entities) {
        message = this.applyMessageEntities_(message, msg.entities);
      }
      time = this.getTime(msg.date);
    }
    return [message, time];
  }

  getTitle () {
    return '__TITLE__';
  }

  isOnline () {
    return false;
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

export default ChatListItem;
