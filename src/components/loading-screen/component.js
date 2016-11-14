import React from 'react';
import InfoMessage from '../info-message/component';
import './styles.css';

export default function() {
  return (
    <div className="loading">
      <InfoMessage>
        <p>No Phoenix socket found.</p>
        <p>Expected to be at <code>window._phoenixSocket</code>.</p>
      </InfoMessage>
    </div>
  );
};