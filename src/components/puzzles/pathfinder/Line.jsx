import React from 'react';

const Line = ({ from, to }) => {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="#f00"
      strokeWidth="2"
    />
  );
};

export default Line;
