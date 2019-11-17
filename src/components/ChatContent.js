import Component from "ROOT/lib/Component";
import Store from "ROOT/store";
import ChatContentChannel from 'ROOT/components/chatcontent/ChatContentChannel'
import ChatContentUser from 'ROOT/components/chatcontent/ChatContentUser'
import ChatContentEmpty from 'ROOT/components/chatcontent/ChatContentEmpty'
import ChatContentChat from 'ROOT/components/chatcontent/ChatContentChat'
import ViewSwitcher from 'ROOT/lib/ViewSwitcher'

class ChatContent extends Component {
  constructor () {
    super();
    this.render();
  }

  render (createEl) {
    let chatsPlace;
    this.el = createEl('div', 'tg-chat-content-container', [
      chatsPlace = Component.createVoid()
    ]);

    this.vs_ = new ViewSwitcher(
      [
        {name: 'channel', c: ChatContentChannel},
        {name: 'chat', c: ChatContentChat},
        {name: 'user', c: ChatContentUser},
        {name: 'default', c: ChatContentEmpty},
      ],
      chatsPlace
    );

    this.vs_.showView('default');
    Store.registerUpdate('activeChat', (chat) => this.activeChatUpdate(chat));
    return this.el;
  }

  /**
   * @param {ChatListItem|null} chatItem
   */
  activeChatUpdate (chatItem) {
    if (chatItem.peer_.megagroup) {
      this.vs_.showView('chat')
    } else {
      this.vs_.showView(chatItem.peer_._);
    }
  }
}

export default ChatContent;
