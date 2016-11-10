import React from 'react';
import moment from 'moment';
import './styles.css';

export default function(props) {
  return (
    <div>
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
          {props.messages.map(message => {
            const key = `${message.ref}-${message.event}`;
            const time = moment(message.time);

            const original = findOriginalFor(props.messages, message);
            let duration;
            if (original) {
              const diff = time.diff(moment(original.time));
              duration = `${diff}ms`;
            } else {
              duration = "-";
            }

            return (
              <tr key={key} className="message">
                <td>{message.ref}</td>
                <td>{message.event}</td>
                <td>{time.format("HH:mm:ss.SSS")}</td>
                <td>{duration}</td>
                <td>{JSON.stringify(message.payload)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function findOriginalFor(messages, message) {
  if (message.event !== "phx_reply") {
    return;
  }

  return messages.find(m => m.ref === message.ref && m !== message);
}