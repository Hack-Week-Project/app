import React, { Component } from 'react';
import '../styles/ChatRoom.css';
import SocketIOClient from 'socket.io-client';
import jwt_decode from "jwt-decode";
import { Input, Grid } from 'semantic-ui-react';
import Message from './Message.js';

class ChatRoom extends Component {
  constructor(props){
    super(props);
    let token = localStorage.getItem("userToken");
    this.user = jwt_decode(token);

    this.state = {
      targetUser: props.match.params.to,
      input: "",
      chat: []
    };

    this.socket = SocketIOClient('http://localhost:3001/');
  }

  componentDidMount(){
    console.log('mounted!');
    console.log(this.user.id);
    // populate chat with any existing messages
    this.findMessages(this.user.id, this.props.match.params.to);

    this.socket.emit('join', {userId: this.user.id});

    this.socket.on('new message', (data) => {
      console.log(data.msg);
      this.handleIncomingMessage(data);
    });
  }

  findMessages = (user1, user2) => {
    fetch('/api/chat/getMessages?user1=' +user1+ '&user2=' +user2)
    .then(res => res.json())
    .then(messages => {
      this.setState({chat: messages.chats});
    });
  }

  handleIncomingMessage = data => {
    console.dir(data);
    console.log("From: ", data.from);
    console.log("Current chatmate: ", this.state.targetUser);
    if(data.from != this.state.targetUser){
      console.log("Adding to inbox...");
      // Add message to inbox, not current chat
      return;
    }

    // Add message to current chat
    console.log("Adding to current chat...");

    let message = {
      from: data.from,
      to: this.user.id,
      msg: data.msg
    }

    this.setState( state => {
      const chat = state.chat.concat(message);
      return {chat: chat};
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.socket.emit('chat message', {to: this.state.targetUser, from: this.user.id, msg: this.state.input});

    let message = {
      from: this.user.id,
      to: this.state.targetUser,
      msg: this.state.input
    }

    this.setState( state => {
      const chat = state.chat.concat(message);
      return {chat: chat};
    });

    this.setState({
      input: ""
    });
    document.getElementById('messageForm').reset();
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  render(){
    return (
      <div className="ChatRoom">
        {this.state.chat ? (<div>This is the beginning of your conversation.</div>) : null }
          <ul id="chatBody">
            {this.state.chat ? this.state.chat.map((message, index) => {
              let messageDirection = message.from == this.user.id ? 'outgoing' : 'incoming';
              return(
                <Message key={index} msg={message.msg} messageDirection={messageDirection}/>
              );
            }) : null}
          </ul>

        <form id="messageForm" onSubmit={this.handleSubmit}>
            <Input type="text" id="input" fluid onChange={this.handleChange} autoComplete="off" placeholder="Say something..." icon='send' autoFocus/>
        </form>
      </div>
    );
  }
}

export default ChatRoom;
