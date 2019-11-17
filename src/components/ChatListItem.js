import Component from "ROOT/lib/Component";
import { formatMessage, getPhoto } from "ROOT/lib/TelegramMessage";
import ErrorHandler from 'ROOT/lib/ErrorHandler'
import Ripple from 'ROOT/components/Ripple'

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
    let rippleEl;
    this.el = createEl('div', {
      class: 'tg-chat-list-item',
      id: this.peer_.id
    }, [
      this.photo_ = createEl('div', 'tg-chat-list-item-photo', [this.getShortTitle()]),
      rippleEl = createEl('div', 'full-stretch'),
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

    if (this.isSilent()) {
      this.el.classList.add('mute');
    }

    const ripple = new Ripple(rippleEl);
    this.el.addEventListener('mousedown', (ev) => ripple.show(ev));
    this.el.addEventListener('touchstart', (ev) => ripple.show(ev));
    return this.el;
  }

  getItemPhotoData () {
    return [null, null];
  }

  getItemPhoto () {
    let photoData = this.getItemPhotoData();
    if (photoData) {
      const fnDone = (objectUrl) => {
        this.photo_.style.backgroundImage = `url(${objectUrl})`;
        this.photo_.innerHTML = '';
      }
      const fnReject = (err) => {
       return ErrorHandler(err);
      }

      getPhoto(photoData)
        .then(fnDone)
        .catch(fnReject);
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

  getShortTitle () {
    return 'C';
  }

  isOnline () {
    return false;
  }

  isSilent () {
    const notify = this.dialog_.notify_settings;
    if (notify._ === 'peerNotifySettings') {
      return !!notify.mute_until;
    }
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
