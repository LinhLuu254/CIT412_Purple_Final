import React from 'react';
import PropTypes from 'prop-types';

function Tooltip({ text, children }) {
  return (
    <div className="tooltip-container">
      {children}
      <div className="tooltip-content">{text}</div>
    </div>
  );
}

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

export default Tooltip;
