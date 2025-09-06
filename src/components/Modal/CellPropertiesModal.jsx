import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { enqueue, assignChar } from "../../reducers/cellReducer";

const CellPropertiesModal = () => {
  const dispatch = useDispatch();
  const { activeCell, cellSet } = useSelector((state) => state.cells);

  const activeCellData = cellSet.find((cell) => cell.id === activeCell);
  const [charInput, setCharInput] = useState("");

  useEffect(() => {
    if (activeCellData) {
      setCharInput(activeCellData.char || "");
    }
  }, [activeCellData]);

  if (!activeCellData) {
    return <div>No cell selected.</div>;
  }

  const handleAddToQueue = () => {
    dispatch(enqueue(activeCell));
  };

  const handleCharChange = (e) => {
    const newChar = e.target.value.slice(-1);
    setCharInput(newChar);
    dispatch(assignChar({ cellId: activeCell, char: newChar }));
  };

  return (
    <div>
      <h2>Cell Properties (ID: ...{activeCell.slice(-6)})</h2>
      <div>
        <label htmlFor="char-input">Character: </label>
        <input
          id="char-input"
          type="text"
          value={charInput}
          onChange={handleCharChange}
          maxLength="1"
          style={{ width: "30px", textAlign: "center" }}
        />
      </div>
      <br />
      <button onClick={handleAddToQueue}>Add to Queue</button>
    </div>
  );
};

export default CellPropertiesModal;
