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
    window.addEventListener('scroll', () => {
      if ((document.documentElement.scrollTop || document.body.scrollTop) < 200) {
        this.getMessages_();
      }
    });
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
      this.messagesOffset_ = 0;
      this.getMessages_();
    }
  }

  getInputPeer () {
    return {
      _: 'PEERTYPE'
    }
  }

  getMessages_ () {
    if (this.gettingProgress_) {
      return;
    }
    this.gettingProgress_ = true;
    MTProtoClient('messages.getHistory', {
      peer: this.getInputPeer(), // InputPeer  Target peer
      offset_id: 0, // int  Only return messages starting from the specified message ID
      offset_date: 0, // int  Only return messages sent after the specified date
      add_offset: this.messagesOffset_, // int  Number of list elements to be skipped, negative values are also accepted.
      limit: 10, // int  Number of results to return
      max_id: 0, // int  If a positive value was transferred, the method will return only messages with IDs less than max_id
      min_id: 0, // int  If a positive value was transferred, the method will return only messages with IDs more than min_id
      hash: 0// int  Result hash
    })
      .then(({messages, users, chats}) => {
        const prevHeight = this.content.scrollHeight;
        const prevScroll = this.getScroll();
        const frag = document.createDocumentFragment();
        let iUsers = {};
        if (users) {
          users.forEach(u => (iUsers[u.id] = u));
        }
        let iChats = {};
        if (chats) {
          chats.forEach(c => (iChats[c.id] = c));
        }
        for (let i = messages.length - 1; i >= 0; i--) {
          const m = messages[i];
          if (m._ !== 'messageEmpty') {
            const from = iUsers[m.from_id] || iChats[m.from_id];
            frag.appendChild((new this.msgComponent(m, from)).el);
          }
        }
        if (this.content.firstChild) {
          this.content.insertBefore(frag, this.content.firstChild);
        } else {
          this.content.appendChild(frag);
        }
        const scrollHeight = this.content.scrollHeight;
        if (!this.messagesOffset_) {
          this.setScroll(scrollHeight);
        } else {
          this.setScroll(prevScroll + scrollHeight - prevHeight);
        }
        this.messagesOffset_ += messages.length;
        this.gettingProgress_ = false;
      })
      .catch(err => {
        this.gettingProgress_ = false;
        return ErrorHandler(err);
      });
  }

  getScroll () {
    return document.body.scrollTop || document.documentElement.scrollTop;
  }

  setScroll (v) {
    document.body.scrollTop = v;
    document.documentElement.scrollTop = v;
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
