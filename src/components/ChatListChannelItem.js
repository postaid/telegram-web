import ChatListItem from "ROOT/components/ChatListItem";

class ChatListChannelItem extends ChatListItem {
  constructor(dialog, channel, lastMsg) {
    super(dialog, channel, lastMsg);
  }

  getTitle () {
    return this.peer_.title || this.peer_.username;
  }
}

export default ChatListChannelItem;
