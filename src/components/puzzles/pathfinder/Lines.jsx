import { useSelector } from 'react-redux';

const Lines = ({ rendered }) => {
  const { cellSet, activeQueue, queueSet } = useSelector(state => state.puzzles.pathfinder.cells);
  const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = useSelector(state => state.image.rendered)

  if (!offsetWidth || !offsetHeight || !activeQueue || !queueSet[activeQueue]) {
    return null;
  }
  
  const activeCells = queueSet[activeQueue];

  const lines = [];
  for (let i = 0; i < activeCells.length - 1; i++) {
    const cell1Id = activeCells[i];
    const cell2Id = activeCells[i + 1];
    const cell1 = cellSet[cell1Id];
    const cell2 = cellSet[cell2Id];

    if (cell1 && cell2) {
      lines.push(
        <line
          key={`${cell1.id}-${cell2.id}`}
          x1={cell1.normalizedPosition.x * offsetWidth}
          y1={cell1.normalizedPosition.y * offsetHeight}
          x2={cell2.normalizedPosition.x * offsetWidth}
          y2={cell2.normalizedPosition.y * offsetHeight}
          stroke="white"
          strokeWidth="2"
        />
      );
    }
  }

  return (
    <svg
      style={{
        position: 'absolute',
        top: `${offsetTop}px`,
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
        height: `${offsetHeight}px`,
        pointerEvents: 'none',
      }}
    >
      {lines}
    </svg>
  );
};

export default Lines;
