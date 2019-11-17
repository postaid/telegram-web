import ChatContentEmpty from 'ROOT/components/chatcontent/ChatContentEmpty';
import Store from 'ROOT/store'
import ChatMessageChat from 'ROOT/components/chatmessage/ChatMessageChat'
import Component from 'ROOT/lib/Component'
import MTProtoClient from 'ROOT/lib/mtproto'
import ErrorHandler from 'ROOT/lib/ErrorHandler'

class ChatContentChat extends ChatContentEmpty {
  constructor () {
    super(true);
    this.chatItem = Store.getStateValue('activeChat');
    this.msgComponent = ChatMessageChat;
    this.render();
  }

  getAdditionalInfo (createEl) {
    const title = this.chatItem.getTitle();
    this.getSubscribers();
    return createEl('div', 'tg-chat-list-item-texts', [
      createEl('div', 'tg-chat-list-item-top', [
        createEl('div', 'tg-chat-list-item-title', [title]),
      ]),
      createEl('div', 'tg-chat-list-item-bottom', [
        createEl('div', 'tg-chat-list-item-message', [this.subsCount = Component.createVoid()]),
      ])
    ]);
  }

  getSubscribers () {
    MTProtoClient('channels.getFullChannel', {
      channel: {
        _: 'inputChannel',
        channel_id: this.chatItem.peer_.id,
        access_hash: this.chatItem.peer_.access_hash
      }
    })
      .then((data) => {
        this.setSubscribers(data.full_chat.participants_count, data.full_chat.online_count);
      })
      .catch(err => ErrorHandler(err));
  }

  setSubscribers(subsCount, onlineCount) {
    let el = this.subsCount;
    if (el.__void) {
      let countEl = Component.createElement('div', 'tg-chat-list-item-subscribers');
      el.parentNode.insertBefore(countEl, el);
      el.parentNode.removeChild(el);
      this.subsCount = countEl
    }
    subsCount = this.formatCount(subsCount);
    let result = subsCount + ' members';
    if (onlineCount) {
      onlineCount = this.formatCount(onlineCount);
      result += ', ' + onlineCount + ' online';
    }
    this.subsCount.innerHTML = result;
  }

  formatCount(value) {
    return String(value).match(/.{1,3}(?=(.{3})+(?!.))|.{1,3}$/g).join(',');
  }

  getInputPeer () {
    return {
      _: 'inputPeerChannel',
      channel_id: this.chatItem.peer_.id,
      access_hash: this.chatItem.peer_.access_hash
    }
  }
}

export default ChatContentChat;
