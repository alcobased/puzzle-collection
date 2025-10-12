import { useSelector } from 'react-redux';

const Lines = ({ rendered }) => {
  const { cellSet, activeQueue, queueSet } = useSelector(state => state.puzzles.pathfinder.cells);
  const { width, height } = rendered;

  if (!width || !height || !activeQueue || !queueSet[activeQueue]) {
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
          x1={cell1.normalizedPosition.x * width}
          y1={cell1.normalizedPosition.y * height}
          x2={cell2.normalizedPosition.x * width}
          y2={cell2.normalizedPosition.y * height}
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
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {lines}
    </svg>
  );
};

export default Lines;
