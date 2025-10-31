import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPiece, removePiece } from '../../../features/textris/textrisSlice';

const TextrisPiecesModal = () => {
  const dispatch = useDispatch();
  const pieces = useSelector((state) => state.puzzles.textris.setup.pieces);
  const [grid, setGrid] = useState(Array(5).fill(null).map(() => Array(5).fill('')));
  const [selectedPieceId, setSelectedPieceId] = useState('');

  useEffect(() => {
    if (!selectedPieceId && pieces.length > 0) {
      setSelectedPieceId(pieces[0].id);
    }
    if (selectedPieceId && !pieces.find(p => p.id === selectedPieceId)) {
        setSelectedPieceId(pieces.length > 0 ? pieces[0].id : '');
    }
  }, [pieces, selectedPieceId]);

  const handleCellChange = (y, x, value) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (rowIndex === y && colIndex === x) {
          return value.slice(0, 1); // Limit to a single character
        }
        return cell;
      })
    );
    setGrid(newGrid);
  };

  const trimShape = (shape) => {
    if (!shape || shape.length === 0) {
      return [];
    }

    let minX = shape[0].length, maxX = -1, minY = shape.length, maxY = -1;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }
    
    if (maxX === -1) { // Empty shape
        return [];
    }

    return shape.slice(minY, maxY + 1).map(row => row.slice(minX, maxX + 1).map(cell => cell || null));
  };


  const handleAddPiece = () => {
    const shape = trimShape(grid);
    if(shape.length > 0 && shape[0].length > 0) {
        dispatch(addPiece({ shape }));
        setGrid(Array(5).fill(null).map(() => Array(5).fill('')));
    }
  };

  const handleRemovePiece = () => {
    if (selectedPieceId) {
      dispatch(removePiece(selectedPieceId));
    }
  };

  const handlePieceSelectionChange = (e) => {
    setSelectedPieceId(e.target.value);
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 30px)',
    gap: '5px',
    marginBottom: '1rem',
  };

  const cellStyle = {
    width: '30px',
    height: '30px',
    textAlign: 'center',
    border: '1px solid #ccc',
  };

  const pieceIds = pieces.map((p) => p.id);
  const selectedPiece = pieces.find((p) => p.id === selectedPieceId);

  return (
    <div>
      <h3>Create New Piece</h3>
      <div style={gridStyle}>
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <input
              key={`${y}-${x}`}
              type="text"
              value={cell}
              onChange={(e) => handleCellChange(y, x, e.target.value)}
              maxLength="1"
              style={cellStyle}
            />
          ))
        )}
      </div>
      <button onClick={handleAddPiece}>Add Piece</button>
      <hr />
      <h3>Existing Pieces</h3>
      {pieces.length > 0 ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <select value={selectedPieceId} onChange={handlePieceSelectionChange}>
              {pieceIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
            <button onClick={handleRemovePiece} disabled={!selectedPieceId}>
              Remove Selected Piece
            </button>
          </div>
          {selectedPiece && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedPiece.shape[0].length}, 20px)` }}>
                {selectedPiece.shape.map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`${y}-${x}`}
                      style={{
                        width: '20px',
                        height: '20px',
                        border: '1px solid #ccc',
                        backgroundColor: cell ? '#f0f0f0' : 'transparent',
                        textAlign: 'center',
                      }}
                    >
                      {cell}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <p>No pieces exist yet. Create one above!</p>
      )}
    </div>
  );
};

export default TextrisPiecesModal;
