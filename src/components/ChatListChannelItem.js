import ChatListItem from "ROOT/components/ChatListItem";

class ChatListChannelItem extends ChatListItem {
  constructor(dialog, channel, lastMsg) {
    super(dialog, channel, lastMsg);
  }

  getTitle () {
    return this.peer_.title || this.peer_.username;
  }

  getItemPhotoData () {
    const photoData = this.peer_.photo;
    if (!photoData) {
      return [null, null];
    }

    switch (photoData._) {
      case 'chatPhoto':
        return [
          {
            _: 'inputPeerChannel',
            channel_id: this.peer_.id,
            access_hash: this.peer_.access_hash
          },
          photoData.photo_small
        ];
    }
    return [null, null];
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
