import React from 'react';
import './styles.css';

export default function({ onClick }) {
  return (
    <button onClick={onClick} className="close-button">
      <svg height="14" width="14" viewBox="0 0 14 14" version="1.1">
        <g className="svg-stroke">
          <path d="m 2,12 10,-10" stroke="#000000" strokeWidth="2" />
          <path d="m 2,2 10,10" stroke="#000000" strokeWidth="2" />
        </g>
      </svg>
    </button>
  )
}