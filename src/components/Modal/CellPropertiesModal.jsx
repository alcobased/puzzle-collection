import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { enqueue, assignChar } from "../../reducers/cellReducer";

const CellPropertiesModal = () => {
  const dispatch = useDispatch();
  const { activeCell, cellSet } = useSelector((state) => state.cells);

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
  }, [activeCellData]);

  if (!activeCellData) {
    return <div>Cell not found. This can happen if the cell was just deleted.</div>;
  }

  const handleAddToQueue = () => {
    dispatch(enqueue(activeCell));
  };

  const handleCharChange = (e) => {
    const newChar = e.target.value.slice(0, 1).toUpperCase();
    setCharInput(newChar);
    dispatch(assignChar({ cellId: activeCell, char: newChar }));
  };

  return (
    <div>
      <h3>Cell Properties (ID: {activeCell.substring(0, 8)}...)</h3>
      <div className="cell-properties-controls">
          <span>Character:</span>
          <input
            type="text"
            value={charInput}
            onChange={handleCharChange}
            maxLength="1"
            className="char-input"
          />
          <button onClick={handleAddToQueue}>Add to Queue</button>
      </div>
    </div>
  );
};

export default CellPropertiesModal;
