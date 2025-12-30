import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCellStyle,
  setQueueSet,
  toggleMarkingStartCell,
  setActiveQueue,
} from "../../../features/pathfinder/pathfinderSlice.js";
import { showModal } from "../../../features/ui/uiSlice.js";
import ControlSection from "../../common/Controls/ControlSection";

const ControlsCells = () => {
  const dispatch = useDispatch();
  const { cellStyle, cellSet, queueStartCell } = useSelector(
    (state) => state.puzzles.pathfinder.cells
  );

  const getNextDirection = (cell, cellSet, prevDirection = null) => {
    if (prevDirection) {
      if (
        // should try maintain the same direction
        cellSet[
        `${cell.gridPosition.x + prevDirection.x},${cell.gridPosition.y + prevDirection.y
        }`
        ]
      ) {
        return prevDirection;
      } else {
        // else try to find a valid alternative, no going back
        // determine if previous direction was horizontal or vertical
        if (prevDirection.x === 0) {
          // case for vertical previous direction
          // next direction can only be horizontal
          if (cellSet[`${cell.gridPosition.x - 1},${cell.gridPosition.y}`]) {
            return { x: -1, y: 0 };
          } else if (
            cellSet[`${cell.gridPosition.x + 1},${cell.gridPosition.y}`]
          ) {
            return { x: 1, y: 0 };
          } else {
            return null;
          }
        } else {
          // case for horizontal previous direction
          // next direction can only be vertical
          if (cellSet[`${cell.gridPosition.x},${cell.gridPosition.y - 1}`]) {
            return { x: 0, y: -1 };
          } else if (
            cellSet[`${cell.gridPosition.x},${cell.gridPosition.y + 1}`]
          ) {
            return { x: 0, y: 1 };
          } else {
            return null;
          }
        }
      }
    } else {
      // case for first cell
      // search in all 4 directions
      if (cellSet[`${cell.gridPosition.x},${cell.gridPosition.y - 1}`]) {
        return { x: 0, y: -1 };
      } else if (cellSet[`${cell.gridPosition.x},${cell.gridPosition.y + 1}`]) {
        return { x: 0, y: 1 };
      } else if (cellSet[`${cell.gridPosition.x - 1},${cell.gridPosition.y}`]) {
        return { x: -1, y: 0 };
      } else if (cellSet[`${cell.gridPosition.x + 1},${cell.gridPosition.y}`]) {
        return { x: 1, y: 0 };
      } else {
        // this is a case where start cell is isolated
        // normally this should not happen
        return null;
      }
    }
  };

  const generateQueuesSingle = (queueStartCell, cellSet) => {
    // This is a powerful action that takes cells in the cellSet
    // and auto generates queues, start point must be set queueStartCell
    if (!queueStartCell) {
      return;
    }
    const startCell = cellSet[`${queueStartCell.x},${queueStartCell.y}`];

    if (!startCell) {
      return;
    }

    // The queue generation algorithm will run until there are no more
    // cells to enqueue.
    // Start cell should have only one valid direction
    const startCellDirections = getNextDirection(startCell, cellSet);
    const queue = [startCell.id];
    let previousDirection = startCellDirections;
    let previousCell = startCell;
    let steps = 0;
    while (true) {
      if (steps > 200) {
        break;
      }

      const nextCellDirections = getNextDirection(
        previousCell,
        cellSet,
        previousDirection
      );
      if (!nextCellDirections) {
        // no more valid directions
        // queue is complete
        break;
      } else {
        previousDirection = nextCellDirections;
        previousCell =
          cellSet[
          `${previousCell.gridPosition.x + nextCellDirections.x},${previousCell.gridPosition.y + nextCellDirections.y
          }`
          ];
        queue.push(previousCell.id);
      }
      steps++;
    }
    return queue;
  };

  const generateQueuesMulti = (cellSet) => {
    const generateQueue = (cell, cellSet, direction) => {
      // generates a qeueu from a start cell
      // does not change direction
      let startCell = cell;
      const queue = [startCell.id];
      while (true) {
        const nextCell =
          cellSet[
          `${startCell.gridPosition.x + direction.x},${startCell.gridPosition.y + direction.y
          }`
          ];
        if (!nextCell) {
          return queue;
        } else {
          queue.push(nextCell.id);
          startCell = nextCell;
        }
      }
    };
    // Generates multiple queues
    // Start cell of a queue is determined by a rule
    const queueSet = {};
    Object.values(cellSet).forEach((cell) => {
      // cell has to be a valid start
      // case1: the cell down should exist and cell up should not
      if (
        cellSet[`${cell.gridPosition.x},${cell.gridPosition.y + 1}`] &&
        !cellSet[`${cell.gridPosition.x},${cell.gridPosition.y - 1}`]
      ) {
        const verticalQueue = generateQueue(cell, cellSet, { x: 0, y: 1 });
        const verticalQueueId = `queue-${cell.id}-vertical`;
        queueSet[verticalQueueId] = verticalQueue;
      }
      // case2: the cell right should exist and cell left should not
      if (
        cellSet[`${cell.gridPosition.x + 1},${cell.gridPosition.y}`] &&
        !cellSet[`${cell.gridPosition.x - 1},${cell.gridPosition.y}`]
      ) {
        const horizontalQueue = generateQueue(cell, cellSet, { x: 1, y: 0 });
        const horizontalQueueId = `queue-${cell.id}-horizontal`;
        queueSet[horizontalQueueId] = horizontalQueue;
      }
    });
    return queueSet;
  };

  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    // Keep font size proportional to cell size
    const fontSize = Math.floor(size * 0.8);
    dispatch(setCellStyle({ width: size, height: size, fontSize: fontSize }));
  };

  const openQueueManager = () => {
    // Dispatch with the new object-based format
    dispatch(showModal({ type: "QUEUE_MANAGER", props: {} }));
  };

  const handleGenerateQueuesSingle = () => {
    const queue = generateQueuesSingle(queueStartCell, cellSet);
    if (queue) {
      const id = "dummy-queue-id";
      const newQueueSet = {
        [id]: queue,
      };
      dispatch(setQueueSet(newQueueSet));
      dispatch(setActiveQueue(id));
    }
  };

  const handleGenerateQueuesMultiple = () => {
    const queueSet = generateQueuesMulti(cellSet);
    dispatch(setQueueSet(queueSet));
    dispatch(setActiveQueue(Object.keys(queueSet)[0]));
  };

  const handleToggleMarkingStartCell = () => {
    dispatch(toggleMarkingStartCell());
  };

  return (
    <ControlSection title="Cells">
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
      <div className="label-row">
        <span>Generate queues</span>
        <button onClick={handleGenerateQueuesSingle}>Single</button>
        <button onClick={handleGenerateQueuesMultiple}>Multiple</button>
      </div>
      <div className="label-row">
        <span>Queue start cell</span>
        <button onClick={handleToggleMarkingStartCell}>Mark Cell</button>
      </div>
    </ControlSection>
  );
};

export default ControlsCells;
