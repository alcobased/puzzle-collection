import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { enqueue, assignChar } from "../../../features/pathfinder/pathfinderSlice.js";
import { clearModal } from "../../../features/ui/uiSlice.js";

const ModalCellProperties = () => {
  const dispatch = useDispatch();
  const { activeCell, cellSet } = useSelector((state) => state.puzzles.pathfinder.cells);
  const charInputRef = useRef(null);

  // This should not happen if rendered correctly, but it's a good safeguard.
  if (!activeCell) {
    return null;
  }
  
  const activeCellData = cellSet[activeCell];
  const [charInput, setCharInput] = useState("");

  useEffect(() => {
    if (activeCellData) {
      setCharInput(activeCellData.char || "");
    }
    if (charInputRef.current) {
      charInputRef.current.focus();
    }
  }, [activeCellData]);

  if (!activeCellData) {
    return <div>Cell not found. This can happen if the cell was just deleted.</div>;
  }

  const handleAddToQueue = () => {
    dispatch(enqueue(activeCell));
    dispatch(clearModal());
  };

  const handleCharChange = (e) => {
    const newChar = e.target.value.slice(0, 1).toUpperCase();
    setCharInput(newChar);
    dispatch(assignChar({ cellId: activeCell, char: newChar }));
    if (newChar) {
      dispatch(clearModal());
    }
  };

  return (
    <div>
      <div className="cell-properties-controls">
          <span>Character:</span>
          <input
            type="text"
            value={charInput}
            onChange={handleCharChange}
            maxLength="1"
            className="char-input"
            ref={charInputRef}
          />
          <button onClick={handleAddToQueue}>Add to Queue</button>
      </div>
    </div>
  );
};

export default ModalCellProperties;
