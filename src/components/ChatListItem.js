import Component from "ROOT/lib/Component";
import { formatMessage, getPhoto } from "ROOT/lib/TelegramMessage";

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

    this.getItemPhoto();

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

  getItemPhotoData () {
    return [null, null];
  }

  getItemPhoto () {
    let [photoPeer, location] = this.getItemPhotoData();
    if (location && photoPeer) {
      getPhoto(photoPeer, location)
        .then((objectUrl) => {
          this.photo_.style.backgroundImage = `url(${objectUrl})`;
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
      message = formatMessage(msg, 80);
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
