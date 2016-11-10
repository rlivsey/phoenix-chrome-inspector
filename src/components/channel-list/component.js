import React, { Component } from 'react';
import classNames from 'classnames';
import ChannelSparkline from '../channel-sparkline/component';
import './styles.css';

export default function(props) {
  return <ul className="channel-list">
    {sortBy("topic", props.channels).map(channel => {
      const messages = props.messages[channel.topic] || [];
      const itemClass = classNames({
        "channel-list-item": true,
        selected: props.selected && props.selected.topic === channel.topic
      });

      return <li className={itemClass} key={channel.topic} onClick={(e) => props.onSelect(channel)}>
        <div className="title">{channel.topic}</div>
        <div className="spark">
          <ChannelSparkline messages={messages} />
        </div>
      </li>
    })}
  </ul>
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