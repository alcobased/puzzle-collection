import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { setActiveQueue, addQueue, removeQueue, popFromActiveQueue } from '../../../features/pathfinder/pathfinderSlice.js';

const QueueManagerModal = () => {
    const dispatch = useDispatch();
    const { queueSet, activeQueue } = useSelector((state) => state.puzzles.pathfinder.cells);
    const queueIds = Object.keys(queueSet);
    const activeQueueItems = queueSet[activeQueue] || [];

    const handleSetActiveQueue = (e) => {
        dispatch(setActiveQueue(e.target.value));
    };

    const handleAddQueue = () => {
        const newQueueId = `queue-${uuidv4().substring(0, 8)}`;
        dispatch(addQueue({ id: newQueueId }));
    };

    const handleRemoveQueue = (queueId) => {
        if (window.confirm(`Are you sure you want to delete queue \"${queueId}\"?`)) {
            dispatch(removeQueue(queueId));
        }
    };

    const handlePopFromQueue = () => {
        dispatch(popFromActiveQueue());
    };

    return (
        <div>
            <h3>Queue Manager</h3>
            <div style={{ marginBottom: '10px' }}>
                <label>
                    Active Queue:
                    <select value={activeQueue || ''} onChange={handleSetActiveQueue}>
                        {queueIds.map(id => (
                            <option key={id} value={id}>{id}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
                <button onClick={handleAddQueue}>Add New Queue</button>
                <button 
                    onClick={handlePopFromQueue}
                    disabled={activeQueueItems.length === 0}
                >
                    Pop Last Cell
                </button>
            </div>
            <div>
                <h4>All Queues:</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {queueIds.map(id => (
                        <li key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <span>{id} (Items: {queueSet[id].length})</span>
                            <button 
                                onClick={() => handleRemoveQueue(id)}
                                disabled={queueIds.length <= 1}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default QueueManagerModal;
