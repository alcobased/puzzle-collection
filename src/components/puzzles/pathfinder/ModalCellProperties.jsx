import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { enqueue, assignChar } from "../../../features/pathfinder/pathfinderSlice.js";
import { hideModal } from "../../../features/ui/uiSlice.js";
import '../../common/Modal/Modal.css';

const ModalCellProperties = ({ cellId }) => {
  const dispatch = useDispatch();
  const { cellSet } = useSelector((state) => state.puzzles.pathfinder.cells);
  const charInputRef = useRef(null);

  // This should not happen if rendered correctly, but it's a good safeguard.
  if (!cellId) {
    return null;
  }
  
  const cellData = cellSet[cellId];
  const [charInput, setCharInput] = useState("");

  useEffect(() => {
    if (cellData) {
      setCharInput(cellData.char || "");
    }
    if (charInputRef.current) {
      charInputRef.current.focus();
      charInputRef.current.select();
    }
  }, [cellId, cellData]);

  if (!cellData) {
    return <div>Cell not found. This can happen if the cell was just deleted.</div>;
  }

  const handleAddToQueue = () => {
    dispatch(enqueue(cellId));
    dispatch(hideModal());
  };

  const handleCharSubmit = (e) => {
    e.preventDefault();
    const newChar = charInput.slice(0, 1).toUpperCase();
    dispatch(assignChar({ cellId: cellId, char: newChar }));
    if (newChar) {
        dispatch(hideModal());
    }
  };

  const handleCharChange = (e) => {
    setCharInput(e.target.value);
  }

  return (
    <>
      <div className="modal-section">
        <h3>Cell: {cellId}</h3>
        <form onSubmit={handleCharSubmit} className="modal-form-row">
            <label htmlFor="char-input">Character:</label>
            <input
              id="char-input"
              type="text"
              value={charInput}
              onChange={handleCharChange}
              maxLength="1"
              className="modal-input"
              ref={charInputRef}
              style={{width: '50px', textAlign: 'center'}}
            />
            <button type="submit" className="modal-button">Set</button>
        </form>
      </div>
      <div className="modal-section">
        <h3>Solver</h3>
        <button className="modal-button" onClick={handleAddToQueue}>Add to Queue</button>
      </div>
    </>
  );
};

export default ModalCellProperties;
