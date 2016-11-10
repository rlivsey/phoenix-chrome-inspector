/*global chrome:true*/

import React, { Component } from 'react';
import ChannelList from './components/channel-list/component';
import LoadingScreen from './components/loading-screen/component';
import ChannelInfo from './components/channel-info/component';

import './App.css';

// this.backgroundPageConnection.postMessage({
//   name: 'hello'
// });

export default class App extends Component {

  constructor() {
    super(...arguments);

    this.selectChannel = this.selectChannel.bind(this);

    this.state = {
      socket: false,
      channels: [],
      messages: {},
      selected: null
    };

    this.connect();
  }

  connect() {
    this.backgroundPageConnection = chrome.runtime.connect({
      name: "phoenix-console"
    });

    this.backgroundPageConnection.postMessage({
      name: 'init',
      tabId: chrome.devtools.inspectedWindow.tabId
    });

    this.backgroundPageConnection.onMessage.addListener(message => {
      if (message.phoenix && message.data && message.name) {
        switch (message.name) {
          case "init":
            this.setState({ socket: true });
            break;

          case "channel-list":
            this.setState({ channels: message.data });
            break;

          case "message-received":
            this.handleMessage(message.data);
            break;

          case "message-sent":
            this.handleMessage(message.data);
            break;

          default:
            console.log("received unknown action", message.name);
            break;
        }
      }
    });
  }

  // TODO - should probably use immutable.js or immutability helpers here
  handleMessage({event, payload, ref, topic}) {
    console.log("handling", event, payload, ref, topic);

    const messages = this.state.messages;
    const topicMessages = [].concat(messages[topic] || []).concat([{
      event, payload, ref
    }]);

    let newMessages = {};
    newMessages[topic] = topicMessages;
    newMessages = Object.assign({}, messages, newMessages);

    this.setState({messages: newMessages});
  }

  selectChannel(channel) {
    this.setState({
      selectedChannel: channel
    });
  }

  render() {
    if (!this.state.socket) {
      return <LoadingScreen />
    }

    let selectedChannelComponent;
    if (this.state.selectedChannel) {
      selectedChannelComponent = <ChannelInfo
        channel={this.state.selectedChannel}
        messages={this.state.messages[this.state.selectedChannel.topic] || []}
      />;
    } else {
      selectedChannelComponent = <div>Select a channel</div>;
    }

    return (
      <div className="app">
        <div className="app-header">
          <p>Header</p>
        </div>

        <div className="app-container">
          <div className="app-sidebar">
            <ChannelList
              channels={this.state.channels}
              messages={this.state.messages}
              selected={this.state.selectedChannel}
              onSelect={this.selectChannel}
            />
          </div>
          <div className="app-contents">
            {selectedChannelComponent}
          </div>
        </div>
      </div>
    );
  }
}
