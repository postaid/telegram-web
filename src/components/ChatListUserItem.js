import ChatListItem from "ROOT/components/ChatListItem";

class ChatListUserItem extends ChatListItem {
  constructor (dialog, user, lastMsg) {
    super(dialog, user, lastMsg);
  }

  getTitle () {
    let title = '';
    if (this.peer_.deleted) {
      title = 'DELETED';
    } else {
      let fName = this.peer_.first_name || '';
      let lName = this.peer_.last_name || '';
      title = fName + (fName && lName ? ' ' : '') + lName;
    }
    return title;
  }

  isOnline () {
    return this.peer_.status && this.peer_.status._ === 'userStatusOnline';
  }
}

export default ChatListUserItem;
