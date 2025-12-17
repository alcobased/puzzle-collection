import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  setActiveQueue,
  addQueue,
  removeQueue,
  popAndPurge,
  setFlashingCurrentQueue,
} from "../../../features/pathfinder/pathfinderSlice.js";
import "./ModalCellQueue.css";

const ModalCellQueue = () => {
  const dispatch = useDispatch();
  const { queueSet, activeQueue } = useSelector(
    (state) => state.puzzles.pathfinder.cells
  );
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
    if (window.confirm(`Are you sure you want to delete queue "${queueId}"?`)) {
      dispatch(removeQueue(queueId));
    }
  };

  const handlePopFromQueue = () => {
    dispatch(popAndPurge());
  };

  const handleSetFlashingCurrentQueue = (id) => {
    dispatch(setFlashingCurrentQueue(id));
  };

  return (
    <>
      <div className="modal-section">
        <h3>Manage Queues</h3>
        <div className="queue-controls">
          <select
            className="modal-select"
            value={activeQueue || ""}
            onChange={handleSetActiveQueue}
          >
            {queueIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
          <button className="modal-button" onClick={handleAddQueue}>
            New Queue
          </button>
          <button
            className="modal-button"
            onClick={handlePopFromQueue}
            disabled={activeQueueItems.length === 0}
          >
            Pop Last Cell
          </button>
        </div>
      </div>

      <div className="modal-section">
        <h3>All Queues</h3>
        <ul className="modal-list">
          {queueIds.map((id) => (
            <li key={id} className="modal-list-item">
              <span>
                {id} (Items: {queueSet[id].length})
              </span>
              <button
                className="modal-list-remove-btn"
                onClick={() => handleRemoveQueue(id)}
                disabled={queueIds.length <= 1}
              >
                &times;
              </button>
              <button onClick={() => handleSetFlashingCurrentQueue(id)}>
                Flash queue
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ModalCellQueue;
