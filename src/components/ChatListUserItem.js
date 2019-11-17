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

  getShortTitle () {
    let title = '';
    if (this.peer_.deleted) {
      title = 'D';
    } else {
      let fName = this.peer_.first_name || '';
      let lName = this.peer_.last_name || '';
      if (fName) {
        title += fName[0];
      }
      if (lName) {
        title += lName[0];
      }
    }
    return title;
  }

  isOnline () {
    return this.peer_.status && this.peer_.status._ === 'userStatusOnline';
  }

  getItemPhotoData () {
    const photoData = this.peer_.photo;
    if (!photoData) {
      return null;
    }

    switch (photoData._) {
      case 'userProfilePhoto':
        return [
          photoData.photo_id,
          {
            _: 'inputPeerUser',
            user_id: this.dialog_.peer.user_id,
            access_hash: this.peer_.access_hash
          },
          photoData.photo_small,
          photoData.dc_id
        ];
      default:
        return null;
    }
  }
}

export default ChatListUserItem;
