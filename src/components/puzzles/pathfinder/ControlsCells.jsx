import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCellStyle } from '../../../features/pathfinder/pathfinderSlice.js';
import { openModal } from '../../../features/ui/uiSlice.js';

const ControlsCells = () => {
  const dispatch = useDispatch();
  const cellStyle = useSelector(state => state.puzzles.pathfinder.cells.cellStyle);

  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    const fontSize = Math.floor(size * 0.8);
    dispatch(setCellStyle({ width: size, height: size, fontSize: fontSize }));
  };

  const handleManageQueues = () => {
      dispatch(openModal({ modalType: 'QUEUE_MANAGER' }));
  }

  return (
    <fieldset>
      <legend>Cells</legend>
      <label style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span>Size:</span>
          <span>{cellStyle.width}px</span>
        </div>
        <input
          type="range"
          min="20"
          max="50"
          step="2"
          value={cellStyle.width}
          onChange={handleSizeChange}
        />
      </label>
      <button onClick={handleManageQueues}>Manage Queues</button>
    </fieldset>
  );
};

export default ControlsCells;
