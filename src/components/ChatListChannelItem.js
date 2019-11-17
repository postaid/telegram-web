import ChatListItem from "ROOT/components/ChatListItem";

class ChatListChannelItem extends ChatListItem {
  constructor(dialog, channel, lastMsg) {
    super(dialog, channel, lastMsg);
  }

  getTitle () {
    return this.peer_.title || this.peer_.username;
  }

  getShortTitle () {
    return this.getTitle()[0];
  }

  getItemPhotoData () {
    const photoData = this.peer_.photo;
    if (!photoData) {
      return null;
    }

    switch (photoData._) {
      case 'chatPhoto':
        return [
          this.peer_.id,
          {
            _: 'inputPeerChannel',
            channel_id: this.peer_.id,
            access_hash: this.peer_.access_hash
          },
          photoData.photo_small,
          photoData.dc_id
        ];
    }
    return null;
/*

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
*/
  }

}

export default ChatListChannelItem;
