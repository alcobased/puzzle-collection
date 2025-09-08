import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCellStyle } from '../../reducers/cellReducer';
import { openModal } from '../../reducers/uiReducer';

const ControlsCells = () => {
  const dispatch = useDispatch();
  const cellStyle = useSelector(state => state.cells.cellStyle);

  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    dispatch(setCellStyle({ width: size, height: size }));
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
          min="15"
          max="40"
          value={cellStyle.width}
          onChange={handleSizeChange}
        />
      </label>
      <button onClick={handleManageQueues}>Manage Queues</button>
    </fieldset>
  );
};

export default ControlsCells;
