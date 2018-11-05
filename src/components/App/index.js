//This is your top level React component, you may change everything

import React from 'react'
import logo from '../../assets/spotim-logo.jpg'
import { Container, Image } from 'semantic-ui-react'
import styled from 'styled-components';
import MessageList from '../messageList';
import MessageCreate from '../messageCreate';
import io from "socket.io-client";

const Logo = styled.div`
      img{
        margin-left: auto;
        margin-right: auto;
        margin-top: 15px;
      }
`;

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.initSocketConnection = this.initSocketConnection.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onSetUsername = this.onSetUsername.bind(this);

    this.socket = null;

    this.state = {
      messages: [],
      selectedUsername: '',
    };

    this.initSocketConnection();
  }

  initSocketConnection() {
    this.socket = io("http://localhost:8080");
    this.socket.on("connect", () => {
      debugger
      console.log("connected to chat server! :)");
    });
    this.socket.on("disconnect", () => {
      debugger
      console.log("disconnected from chat server!");
      this.socket.emit("chat", {
        system: true,
        avatar: null,
        username: this.state.selectedUsername,
        text: 'disconnected from chat server!',
      });
    });
    this.socket.on("chat", (messageObj) => {
      const { messages } = this.state;
      messages.push(messageObj);
      this.setState(messages);
    });
  }

  sendMessage(messageObj) {
    this.socket.emit('chat', messageObj);
  }

  onSetUsername(username) {
    this.setState({ selectedUsername: username });
  }

  render() {
    return <Container className={'spotim-header'}>
      <div className={'spotim-title'}>
        Welcome to the Spot.IM Chat app
      </div>
      <div>
        <Logo>
          <Image size={'tiny'} src={logo} />
        </Logo>
        <div className={'chat-container'}>
          <MessageList messages={this.state.messages} selectedUsername={this.state.selectedUsername} />
          <MessageCreate sendMessage={this.sendMessage} onSetUsername={this.onSetUsername} />
        </div>
      </div>
    </Container>
  }
}

export default App;
