import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { startSelection, moveSelection, endSelection } from '../../../features/textris/textrisSlice';
import { placePiece } from '../../../features/textris/solverSlice';
import './TextrisBoard.css';

const TextrisBoard = () => {
  const dispatch = useDispatch();
  const { setup, solver } = useSelector((state) => state.puzzles.textris);
  const { board, phase, pieces } = setup;
  const { selectedPieceId, placedPieces } = solver;

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const boardRect = document.querySelector('.textris-board').getBoundingClientRect();
      const x = Math.floor((offset.x - boardRect.left) / 25);
      const y = Math.floor((offset.y - boardRect.top) / 25);
      
      if (phase === 'solve') {
        console.log("Placing piece");
        dispatch(placePiece({ pieceId: item.id, x, y }));
      }
    },
  }));

  const handleMouseDown = (x, y) => {
    if (phase === 'setup') {
      dispatch(startSelection({ x, y }));
    }
  };

  const handleMouseMove = (x, y) => {
    if (phase === 'setup' && board.selection.isActive) {
      dispatch(moveSelection({ x, y }));
    }
  };

  const handleMouseUp = () => {
    if (phase === 'setup') {
      dispatch(endSelection());
    }
  };

  const handleCellClick = (x, y) => {
    if (phase === 'solve' && selectedPieceId) {
        // TODO: Validate placement
        dispatch(placePiece({ pieceId: selectedPieceId, x, y }));
    }
  }

  const getCellClass = (x, y) => {
    let className = 'board-cell';
    if (board.data[y] && board.data[y][x]) {
      className += ' active';
    }

    if (phase === 'setup' && board.selection.isActive && board.selection.start && board.selection.end) {
      const minX = Math.min(board.selection.start.x, board.selection.end.x);
      const maxX = Math.max(board.selection.start.x, board.selection.end.x);
      const minY = Math.min(board.selection.start.y, board.selection.end.y);
      const maxY = Math.max(board.selection.start.y, board.selection.end.y);

      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        className += ' selected';
      }
    }
    return className;
  };

  const boardStyle = {
    gridTemplateColumns: `repeat(${board.width}, 25px)`,
    gridTemplateRows: `repeat(${board.height}, 25px)`,
  };

  const renderPlacedPieces = () => {
    return Object.entries(placedPieces).map(([pieceId, position]) => {
      const piece = pieces.find((p) => p.id === pieceId);
      if (!piece) return null;

      return piece.shape.map((row, y) => {
        return row.map((cell, x) => {
          if (!cell) return null;

          const cellStyle = {
            gridColumnStart: position.x + x + 1,
            gridRowStart: position.y + y + 1,
            backgroundColor: 'lightblue', // Example color
          };

          return <div key={`${pieceId}-${y}-${x}`} className="placed-piece-cell" style={cellStyle}>{cell}</div>;
        });
      });
    });
  };

  const cells = [];
  for (let y = 0; y < board.height; y++) {
    for (let x = 0; x < board.width; x++) {
      cells.push(
        <div
          key={`${y}-${x}`}
          className={getCellClass(x, y)}
          onMouseDown={() => handleMouseDown(x, y)}
          onMouseMove={() => handleMouseMove(x, y)}
          onClick={() => handleCellClick(x, y)}
        />
      );
    }
  }

  return (
    <div 
      ref={drop}
      className={`textris-board ${phase === 'solve' ? 'locked' : ''}`}
      style={boardStyle}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {cells}
      {phase === 'solve' && renderPlacedPieces()}
    </div>
  );
};

export default TextrisBoard;
