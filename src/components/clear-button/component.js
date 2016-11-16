import React from 'react';
import './styles.css';

export default function({ onClick }) {
  return (
    <button onClick={onClick} className="clear-button">
      <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1">
        <g className="svg-stroke" transform="translate(3.000000, 3.7500000)" stroke="#000000" strokeWidth="2" fill="none" fillRule="evenodd">
          <circle cx="5.5" cy="5.5" r="5.5"></circle>
          <path d="M1.98253524,1.98253524 L9,9" id="Line" strokeLinecap="square"></path>
        </g>
      </svg>
    </button>
  )
}