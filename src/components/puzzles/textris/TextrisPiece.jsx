import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import './TextrisPiece.css';

const TextrisPiece = ({ piece, selected }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { ...piece },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  if (!piece) {
    return null;
  }

  const { shape } = piece;

  const pieceStyle = {
    gridTemplateColumns: `repeat(${shape[0].length}, 20px)`,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={drag} className={`textris-piece ${selected ? 'selected' : ''}`} style={pieceStyle}>
      {shape.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className="piece-cell"
            style={{ backgroundColor: cell ? '#f0f0f0' : 'transparent' }}
          >
            {cell}
          </div>
        ))
      )}
    </div>
  );
};

export default TextrisPiece;
