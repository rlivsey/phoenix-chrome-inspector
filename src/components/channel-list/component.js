import React, { Component } from 'react';
import classNames from 'classnames';
import ChannelSparkline from '../channel-sparkline/component';
import ClearButton from '../clear-button/component';
import './styles.css';

function ChannelListItem({ channel, messages, selected, onSelect }) {
  const itemClass = classNames({
    "channel-list-item": true,
    [channel.state]: true,
    selected: selected && selected.topic === channel.topic
  });
  return (
    <li className={itemClass} onClick={() => onSelect(channel)}>
      <div className="title">{channel.topic}</div>
      <div className="spark">
        <ChannelSparkline messages={messages} />
      </div>
    </li>
  );
}

export default class ChannelList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: ''
    };

    this.filterChannels = this.filterChannels.bind(this);
  }

  filterChannels(event) {
    this.setState({
      filter: event.target.value
    });
  }

  render() {
    const { channels, selected, messages, onSelect, onClearOldChannels } = this.props;
    const { filter } = this.state;

    const filteredChannels = channels.filter(channel => channel.topic.indexOf(filter) !== -1);
    const activeChannels   = filteredChannels.filter(channel => channel.state !== "closed");
    const closedChannels   = filteredChannels.filter(channel => channel.state === "closed");

    let activeChannelList = null;
    if (activeChannels.length) {
      activeChannelList = (
        <ul className="channel-list">
          {sortBy("topic", activeChannels).map(channel => {
            const channelMessages = messages[channel.topic] || [];
            return <ChannelListItem
              key={channel.topic}
              messages={channelMessages}
              selected={selected}
              onSelect={onSelect}
              channel={channel}
            />
          })}
        </ul>
      );
    }

    let closedChannelList = null;
    if (closedChannels.length) {
      closedChannelList = (
        <ul className="channel-list">
          {sortBy("topic", closedChannels).map(channel => {
            const channelMessages = messages[channel.topic] || [];
            return <ChannelListItem
              key={channel.topic}
              messages={channelMessages}
              selected={selected}
              onSelect={onSelect}
              channel={channel}
            />
          })}
        </ul>
      );
    }

    return (
      <div className="channel-list">
        <div className="channel-list-header">
          <div className="channel-list-header-filter">
            <input
              className="channel-list-header-filter-input"
              type="search"
              placeholder="Filter Channels"
              value={filter}
              onChange={this.filterChannels}
            />
          </div>
          <div className="channel-list-header-clear">
            <ClearButton onClick={onClearOldChannels} />
          </div>
        </div>

        <div className="channel-list-contents">
          {activeChannelList}
          {closedChannelList}
        </div>
      </div>
    );
  }
}

function sortBy(key, array) {
  return array.sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue < bValue) {
      return -1;
    } else if (aValue > bValue) {
      return 1;
    } else {
      return 0;
    }
  });
}