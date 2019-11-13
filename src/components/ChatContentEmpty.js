import Component from 'ROOT/lib/Component';
import { getPhoto } from 'ROOT/lib/TelegramMessage'
import MTProtoClient from 'ROOT/lib/mtproto'
import Store from 'ROOT/store'
import ErrorHandler from 'ROOT/lib/ErrorHandler'

class ChatContentEmpty extends Component {
  constructor (abstract = false) {
    super();
    this.chatItem = null;
    this.msgComponent = null;
    if (!abstract) {
      this.render();
    }
  }

  render (createEl) {
    this.el = createEl('div', 'tg-chat-content', [
      createEl('div', 'tg-chat-content-header', [
        this.photo = createEl('div', 'tg-chat-list-item-photo empty'),
        this.addInfo = Component.createVoid()
      ]),
      this.content = createEl('div', 'tg-chat-content-content')
    ]);

    this.updateAdditionalInfo(createEl);
    this.updatePhoto();
    this.updateMessages();
   }

  updateAdditionalInfo (createEl) {
    const data = this.getAdditionalInfo(createEl)
    this.addInfo.parentNode.insertBefore(data, this.addInfo);
    this.addInfo.parentNode.removeChild(this.addInfo);
    this.addInfo = data;
  }

  updatePhoto () {
    if (this.chatItem) {
      this.photo.classList.add('empty');
      this.photo.style.backgroundImage = '';
      const photoData = this.chatItem.getItemPhotoData();
      if (photoData) {
        this.getPhoto_(photoData, this.chatItem.peer_.id);
      }
    }
  }

  getPhoto_ (photoData, id) {
    getPhoto(photoData)
      .then((url) => {
        if (this.chatItem && this.chatItem.peer_.id === id) {
          this.photo.classList.remove('empty');
          this.photo.style.backgroundImage = `url(${url})`;
        }
      })
      .catch(err => ErrorHandler(err));
  }

  updateMessages () {
    if (this.chatItem) {
      this.content.innerHTML = '';
      const messages = [];
      for (let i = this.chatItem.lastMsg_.id - 10; i <= this.chatItem.lastMsg_.id; i++) {
        const messageId = i;
        messages.push({
          _: 'inputMessageID',
          id: messageId
        });
      }
      this.getMessages_(messages, this.chatItem.peer_.id);
    }
  }

  getMessages_ (messages, id) {
    MTProtoClient('messages.getMessages', {
      id: messages
    })
      .then((p) => {
        if (this.chatItem && this.chatItem.peer_.id === id) {
          p.messages.forEach((m) => {
            if (m._ !== 'messageEmpty') {
              this.content.appendChild((new this.msgComponent(m)).el);
            }
          });
        }
      })
      .catch(err => ErrorHandler(err))
  }

  getAdditionalInfo (createEl) {
    return createEl('div', 'tg-chat-content-header-additional');
  }

  beforeShow () {
    this.chatItem = Store.getStateValue('activeChat');
    this.updatePhoto();
    this.updateAdditionalInfo(Component.createElement);
    this.updateMessages();
  }
}

export default ChatContentEmpty;
