import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCell, toggleStartCell } from "../../../features/domino/dominoSlice.js";
import { hideModal } from "../../../features/ui/uiSlice.js";

const ModalDominoCell = () => {
  const dispatch = useDispatch();
  const { activeCell, grid } = useSelector((state) => state.puzzles.domino);
  const charInputRef = useRef(null);

  if (!activeCell) {
    return null;
  }
  
  const { x, y } = activeCell;
  const activeCellData = grid.data[y]?.[x];
  const [charInput, setCharInput] = useState("");

  useEffect(() => {
    if (activeCellData) {
      setCharInput(activeCellData || "");
    }
    if (charInputRef.current) {
      charInputRef.current.focus();
    }
  }, [activeCellData]);

  const handleCharChange = (e) => {
    const newChar = e.target.value.slice(0, 1).toUpperCase();
    setCharInput(newChar);
    dispatch(updateCell({ x, y, value: newChar }));
    if (newChar) {
      dispatch(hideModal());
    }
  };

  const handleToggleStartCell = () => {
    dispatch(toggleStartCell({ x, y }));
    dispatch(hideModal());
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
          <button onClick={handleToggleStartCell}>Toggle Start Cell</button>
      </div>
    </div>
  );
};

export default ModalDominoCell;
