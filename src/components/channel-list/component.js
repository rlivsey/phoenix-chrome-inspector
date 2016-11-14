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
    <li className={itemClass} key={channel.topic} onClick={() => onSelect(channel)}>
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
  if (activeChannels.length) {
    closedChannelList = (
      <ul className="channel-list">
        {sortBy("topic", closedChannels).map(channel => {
          const channelMessages = messages[channel.topic] || [];
          return <ChannelListItem
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
    <div>
      {activeChannelList}
      {closedChannelList}
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