import { useSelector } from "react-redux";
import GridLine from "./GridLine";

const GridLines = () => {
  const { rendered } = useSelector((state) => state.image);
  const { cellSet, queueSet, activeQueue } = useSelector(
    (state) => state.puzzles.pathfinder.cells
  );

  const lines = [];
  const currentQueue = queueSet[activeQueue] || [];

  if (currentQueue.length > 1 && rendered.width && rendered.height) {
    for (let i = 0; i < currentQueue.length - 1; i++) {
      const fromCellId = currentQueue[i];
      const toCellId = currentQueue[i + 1];

      const fromCell = cellSet[fromCellId];
      const toCell = cellSet[toCellId];

      if (fromCell && toCell) {
        const from = {
          x: fromCell.normalizedPosition.x * rendered.width,
          y: fromCell.normalizedPosition.y * rendered.height,
        };
        const to = {
          x: toCell.normalizedPosition.x * rendered.width,
          y: toCell.normalizedPosition.y * rendered.height,
        };
        lines.push({ from, to, id: `${fromCellId}-${toCellId}` });
      }
    }
  }

  return (
    <svg className="grid-lines">
      {lines.map((line) => (
        <GridLine key={line.id} from={line.from} to={line.to} />
      ))}
    </svg>
  );
};

export default GridLines;
