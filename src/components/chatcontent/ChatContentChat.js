import ChatContentEmpty from 'ROOT/components/chatcontent/ChatContentEmpty';
import ChatMessageChannel from 'ROOT/components/ChatMessageChannel'
import Store from 'ROOT/store'

class ChatContentChat extends ChatContentEmpty {
  constructor () {
    super(true);
    this.chatItem = Store.getStateValue('activeChat');
    this.msgComponent = ChatMessageChannel;
    this.render();
  }
}

export default ChatContentChat;
