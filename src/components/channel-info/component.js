import React from 'react';
import './styles.css';

export default function(props) {
  return (
    <div>
      <table className="messages">
        <thead>
          <tr>
            <th>Ref</th>
            <th>Event</th>
            <th>Payload</th>
          </tr>
        </thead>
        <tbody>
          {props.messages.map(message => {
            const key = `${message.ref}-${message.event}`;
            return (
              <tr key={key} className="message">
                <td>{message.event}</td>
                <td>{message.ref}</td>
                <td>{JSON.stringify(message.payload)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}