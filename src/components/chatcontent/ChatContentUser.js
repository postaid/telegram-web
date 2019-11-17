import ChatContentEmpty from 'ROOT/components/chatcontent/ChatContentEmpty';
import ChatMessageUser from 'ROOT/components/ChatMessageUser'
import Store from 'ROOT/store'

class ChatContentUser extends ChatContentEmpty {
  constructor () {
    super(true);
    this.chatItem = Store.getStateValue('activeChat');
    this.msgComponent = ChatMessageUser;
    this.render();
  }

  getAdditionalInfo (createEl) {
    const title = this.chatItem.getTitle();
    const isOnline = this.chatItem.isOnline();
    return createEl('div', 'tg-chat-list-item-texts', [
      createEl('div', 'tg-chat-list-item-top', [
        createEl('div', 'tg-chat-list-item-title', [title]),
      ]),
      createEl('div', 'tg-chat-list-item-bottom', [
        createEl('div', 'tg-chat-list-item-message' + (isOnline ? ' online' : ''), [this.i18n.t(isOnline ? 'status_online' : 'status_offline')]),
      ])
    ]);
  }

}

export default ChatContentUser;
