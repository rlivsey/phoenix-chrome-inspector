/*global chrome:true*/

import React, { Component } from 'react';
import ChannelList from './components/channel-list/component';
import LoadingScreen from './components/loading-screen/component';
import ChannelInfo from './components/channel-info/component';

import { CHANNELS, MESSAGES } from './data/dummy';

import 'fixed-data-table/dist/fixed-data-table.css';
import './App.css';

// this.backgroundPageConnection.postMessage({
//   name: 'hello'
// });

export default class App extends Component {

  constructor() {
    super(...arguments);

    this.selectChannel = this.selectChannel.bind(this);
    this.clearOldChannels = this.clearOldChannels.bind(this);

    // give us some dummy data to play with when not in the devtools
    if (process.env.NODE_ENV === "development") {
      this.state = {
        socket: true,
        channels: CHANNELS,
        messages: MESSAGES,
        selected: null
      };
    } else {
      this.state = {
        socket: false,
        channels: [],
        messages: {},
        selected: null
      };
      this.connect();
    }
  }

  connect() {
    this.backgroundPageConnection = chrome.runtime.connect({
      name: "phoenix-console"
    });

    this.backgroundPageConnection.postMessage({
      name: 'init',
      tabId: chrome.devtools.inspectedWindow.tabId
    });

    chrome.devtools.network.onNavigated.addListener(() => {
      window.location.reload(true);
    });

    this.backgroundPageConnection.onMessage.addListener(message => {
      if (message.phoenix && message.data && message.name) {
        switch (message.name) {
          case "init":
            this.setState({ socket: true });
            break;

          case "channel-list":
            this.updateChannelList(message.data);
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

  // merges current list with new list
  // channels no longer in the list are marked as "closed"
  updateChannelList(channels) {
    const currentChannels = this.state.channels;
    const newTopics = channels.map(channel => channel.topic);
    const closedChannels = currentChannels.reduce((acc, channel) => {
      if (newTopics.indexOf(channel.topic) === -1) {
        acc.push(Object.assign({}, channel, {
          state: "closed"
        }));
      }
      return acc;
    }, []);
    const allChannels = channels.concat(closedChannels);
    this.setState({ channels: allChannels });
  }

  clearOldChannels() {
    this.setState({
      channels: this.state.channels.filter(channel => channel.state !== "closed")
    });
  }

  // TODO - should probably use immutable.js or immutability helpers here
  handleMessage({event, payload, ref, topic}) {
    const messages = this.state.messages;
    const topicMessages = [].concat(messages[topic] || []).concat([{
      event, payload, ref, time: new Date()
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

  clearChannelMessages(topic) {
    const messages = this.state.messages;
    const newMessages = Object.assign({}, messages, { [topic]: [] });
    this.setState({
      messages: newMessages
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
        onClear={() => this.clearChannelMessages(this.state.selectedChannel.topic)}
      />;
    }

    return (
      <div className="app">
        <div className="app-container">
          <div className="app-sidebar">
            <ChannelList
              channels={this.state.channels}
              messages={this.state.messages}
              selected={this.state.selectedChannel}
              onSelect={this.selectChannel}
              onClearOldChannels={this.clearOldChannels}
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
