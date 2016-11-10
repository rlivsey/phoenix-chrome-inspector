/*global chrome:true*/

import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor() {
    super(...arguments);

    this.state = {
      socket: false,
      channels: []
    };

    // Create a connection to the background page
    this.backgroundPageConnection = chrome.runtime.connect({
      name: "phoenix-console"
    });

    this.backgroundPageConnection.postMessage({
      name: 'init',
      tabId: chrome.devtools.inspectedWindow.tabId
    });

    this.backgroundPageConnection.onMessage.addListener(message => {
      console.log("mesage received in addon", message);
      if (message.phoenix && message.data) {
        this.setState(message.data);
      }
    });
  }

  clicked() {
    this.backgroundPageConnection.postMessage({
      name: 'hello'
    });
  }

  render() {
    console.log("RENDERING", this.state, this.props);

    if (!this.state.socket) {
      return (
        <div className="app-loading">
          <div className="app-loading-message">
            <p>No phoenix socket found.</p>
            <p>Expected to be at window._phoenixSocket.</p>
            <p>
              <button onClick={() => this.clicked()}>Click</button>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="app">
        <div className="app-header">
          <p>Header</p>
        </div>

        <div className="app-container">
          <div className="app-sidebar">
            <h2>Channels: {this.state.channels.length}</h2>
            <ul className="channel-list">
              {this.state.channels.map(channel => {
                return <li className="channel-list-item" key={channel.topic}>{channel.topic} ({channel.state})</li>
              })}
            </ul>
          </div>
          <div className="app-contents">
            Contents
          </div>
        </div>
      </div>
    );
  }
}

export default App;
