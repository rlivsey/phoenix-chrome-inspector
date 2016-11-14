import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import './styles.css';

export default function({ messages, selected, onSelect }) {
  return (
    <table className="messages">
      <thead>
        <tr>
          <th>Ref</th>
          <th>Event</th>
          <th>Time</th>
          <th>Duration</th>
          <th>Payload</th>
        </tr>
      </thead>
      <tbody>
        {sortMessages(messages).map(message => {
          const key = `${message.ref}-${message.event}`;
          const time = moment(message.time);

          const original = findOriginalFor(messages, message);
          let duration;
          if (original) {
            const diff = time.diff(moment(original.time));
            duration = `${diff}ms`;
          } else {
            duration = "-";
          }

          const itemClass = classNames({
            "message-row": true,
            selected: message === selected
          });

          return (
            <tr key={key} className={itemClass} onClick={(e) => onSelect(message)}>
              <td>{message.ref}</td>
              <td>{message.event}</td>
              <td>{time.format("HH:mm:ss.SSS")}</td>
              <td>{duration}</td>
              <td>
                <div className="message-row-payload">
                  {JSON.stringify(message.payload)}
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function findOriginalFor(messages, message) {
  if (message.event !== "phx_reply") {
    return;
  }

  return messages.find(m => m.ref === message.ref && m !== message);
}

// Currently sorts by ref & time, so replies are next to requests
// in future we should allow clicking the table header to re-order etc
function sortMessages(messages) {
  return messages.sort((a, b) => {
    if (a.ref === b.ref) {
      return compare(a.time, b.time);
    } else {
      return compare(a.ref, b.ref);
    }
  });
}

function compare(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}