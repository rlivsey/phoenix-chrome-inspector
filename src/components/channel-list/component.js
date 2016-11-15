import React from 'react';
import classNames from 'classnames';
import ChannelSparkline from '../channel-sparkline/component';
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

export default function({ channels, selected, messages, onSelect }) {
  const activeChannels = channels.filter(channel => channel.state !== "closed");
  const closedChannels = channels.filter(channel => channel.state === "closed");

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
        Channels
      </div>

      <div className="channel-list-contents">
        {activeChannelList}
        {closedChannelList}
      </div>
    </div>
  );
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