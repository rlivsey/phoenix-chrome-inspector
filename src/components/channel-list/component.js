import React, { Component } from 'react';
import classNames from 'classnames';
import './styles.css';

export default class ChannelList extends Component {

  selectChannel(channel) {
    this.props.onSelect(channel);
  }

  render() {
    return <ul className="channel-list">
      {this.props.channels.map(channel => {
        const messages = this.props.messages[channel.topic] || [];
        const itemClass = classNames({
          "channel-list-item": true,
          selected: this.props.selected && this.props.selected.topic === channel.topic
        });

        return <li className={itemClass} key={channel.topic} onClick={(e) => this.selectChannel(channel)}>
          {channel.topic} ({messages.length})
        </li>
      })}
    </ul>
  }

}
