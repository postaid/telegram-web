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

  getItemPhotoData () {
    const photoData = this.peer_.photo;
    if (!photoData) {
      return [null, null];
    }

    switch (photoData._) {
      case 'userProfilePhoto':
        return [
          {
            _: 'inputPeerUser',
            user_id: this.peer_.id,
            access_hash: this.peer_.access_hash + 0
          },
          photoData.photo_small
        ];
      default:
        return [null, null];
    }
  }
}

export default ChatListUserItem;
