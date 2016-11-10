import React from 'react';
import './styles.css';

export default function() {
  return (
    <div className="loading">
      <div className="loading-message">
        <p>No Phoenix socket found.</p>
        <p>Expected to be at <code>window._phoenixSocket</code>.</p>
      </div>
    </div>
  );
};