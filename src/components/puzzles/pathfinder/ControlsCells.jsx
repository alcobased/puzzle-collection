import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCellStyle } from '../../../features/pathfinder/pathfinderSlice.js';
import { showModal } from '../../../features/ui/uiSlice.js';

const ControlsCells = () => {
    const dispatch = useDispatch();
    const cellStyle = useSelector(state => state.puzzles.pathfinder.cells.cellStyle);

    const handleSizeChange = (e) => {
        const size = parseInt(e.target.value, 10);
        // Keep font size proportional to cell size
        const fontSize = Math.floor(size * 0.8);
        dispatch(setCellStyle({ width: size, height: size, fontSize: fontSize }));
    };

    const openQueueManager = () => {
        // Dispatch with the new object-based format
        dispatch(showModal({ type: 'QUEUE_MANAGER', props: {} }));
    };

    return (
        <div className="control-section">
            <h4>Cells</h4>
            <label>
                <div className="label-row">
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
            <button onClick={openQueueManager}>Manage Queues</button>
        </div>
    );
};

export default ControlsCells;
