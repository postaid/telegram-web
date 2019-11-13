import Component from "ROOT/lib/Component";
import Store from "ROOT/store";
import ChatContentChannel from 'ROOT/components/ChatContentChannel'
import ChatContentUser from 'ROOT/components/ChatContentUser'
import ChatContentEmpty from 'ROOT/components/ChatContentEmpty'
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
    this.vs_.showView(chatItem.peer_._);
  }
}

export default ChatContent;
