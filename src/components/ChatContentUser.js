import ChatContentEmpty from 'ROOT/components/ChatContentEmpty';
import ChatMessageChannel from 'ROOT/components/ChatMessageChannel'
import Store from 'ROOT/store'

class ChatContentUser extends ChatContentEmpty {
  constructor () {
    super(true);
    this.chatItem = Store.getStateValue('activeChat');
    this.msgComponent = ChatMessageChannel;
    this.render();
  }
}

export default ChatContentUser;
