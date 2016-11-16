import React, { Component } from 'react';
import './styles.css';

import MessagesTable from './messages-table/component';
import MessageInfo from './message-info/component';
import InfoMessage from '../info-message/component';
import ClearButton from '../clear-button/component';

export default class ChannelInfo extends Component {
  constructor() {
    super(...arguments);
    this.selectMessage = this.selectMessage.bind(this);
    this.state = {
      selected: null,
      tableWidth: 0,
      tableHeight: 0
    };
  }

  selectMessage(message) {
    this.setState({
      selected: message
    });
  }

  render() {
    const { messages, channel, onClear } = this.props;
    const { selected } = this.state;

    if (messages.length === 0) {
      return (
        <div className="selected-message-empty">
          <InfoMessage>
            <p>
              No messages seen on this channel.
            </p>
            <p>
              Note, currently only messages sent/received since the panel was opened will be captured here.
            </p>
          </InfoMessage>
        </div>
      )
    }

    let messageInfo;
    if (selected) {
      messageInfo = (
        <div className="selected-message-info">
          <MessageInfo message={selected} onClose={() => this.selectMessage(null) }/>
        </div>
      );
    }

    return (
      <div className="messages-container">
        <div className="messages-header">
          <div className="messages-header-title">
            Messages in {channel.topic}
          </div>
          <div className="messages-header-clear">
            <ClearButton onClick={onClear} />
          </div>
        </div>
        <div className="messages-table">
          <MessagesTable
            messages={messages}
            selected={selected}
            onSelect={message => this.selectMessage(message)}
          />
        </div>
        {messageInfo}
      </div>
    )
  }

}