import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Piece from './TextrisPiece';
import Board from './TextrisBoard';
import { selectPiece } from '../../../features/textris/solverSlice';
import './TextrisWorkspace.css';

const TextrisWorkspace = () => {
  const dispatch = useDispatch();
  const { setup, solver } = useSelector((state) => state.puzzles.textris);
  const { pieces, phase } = setup;
  const { placedPieces, selectedPieceId } = solver;

  const handlePieceClick = (pieceId) => {
    dispatch(selectPiece(pieceId));
  };

  const unplacedPieces = pieces.filter((p) => !placedPieces[p.id]);

  return (
    <div className="textris-workspace">
      <Board />
      {phase === 'solve' && (
        <div className="pieces-container">
          {unplacedPieces.map((piece) => (
            <div key={piece.id} onClick={() => handlePieceClick(piece.id)}>
              <Piece piece={piece} selected={piece.id === selectedPieceId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextrisWorkspace;
