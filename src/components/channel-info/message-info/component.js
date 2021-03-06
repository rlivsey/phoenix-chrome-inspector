import React from 'react';
import moment from 'moment';
import CloseButton from '../../close-button/component';
import './styles.css';

export default function({ message, onClose }) {
  const time = moment(message.time);

  return (
    <div className="message-info">
      <div className="message-info-close">
        <CloseButton onClick={() => onClose()} />
      </div>

      <div className="message-info-detail">
        <div className="message-info-row">
          <span className="message-info-label">Ref:</span>
          <span className="message-info-value">{message.ref}</span>
        </div>

        <div className="message-info-row">
          <span className="message-info-label">Event:</span>
          <span className="message-info-value">{message.event}</span>
        </div>

        <div className="message-info-row">
          <span className="message-info-label">Time:</span>
          <span className="message-info-value">{time.format("HH:mm:ss.SSS")}</span>
        </div>
      </div>

      <div className="message-info-payload">
        <pre>{JSON.stringify(message.payload, null, 2)}</pre>
      </div>
    </div>
  );
}