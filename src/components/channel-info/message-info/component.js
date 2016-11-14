import React from 'react';
import moment from 'moment';
import './styles.css';

export default function({ message, onClose }) {
  const time = moment(message.time);

  return (
    <div className="message-info">
      <p>
        <button className="close-message" onClick={() => onClose()}>close</button>
      </p>

      <p>{message.ref}</p>
      <p>{message.event}</p>
      <p>{time.format("HH:mm:ss.SSS")}</p>

      <pre>
        {JSON.stringify(message.payload, null, 2)}
      </pre>
    </div>
  );
}