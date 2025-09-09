import { useSelector, useDispatch } from "react-redux";
import { findPaths, generateConnections } from "../../lib/solver.js";
import {
  setConnections,
  setPaths,
} from "../../reducers/solverReducer";

const ControlsSolver = () => {
  const dispatch = useDispatch();
  const { lists } = useSelector((state) => state.words);
  const connections = useSelector((state) => state.solver.connections);
  const { cellSet, queueSet, activeQueue } = useSelector((state) => state.cells);
  const paths = useSelector((state) => state.solver.paths);

  const handleGenerateConnections = () => {
    if (lists) {
      const connectionsSet = generateConnections(lists);
      dispatch(setConnections(connectionsSet));
    }
  };

  const handleFindPaths = () => {
    const queuesToSearch = activeQueue ? [activeQueue] : Object.keys(queueSet);
    let allPaths = [];

    queuesToSearch.forEach(queueId => {
      const queue = queueSet[queueId];

      const solverCellSet = {};
      queue.forEach((cellId, index) => {
        if (cellSet[cellId] && cellSet[cellId].char) {
          solverCellSet[index] = { char: cellSet[cellId].char };
        }
      });

      for (const listName in lists) {
        if (!connections[listName]) continue;
        for (const word of lists[listName]) {
          const foundPaths = findPaths(word, connections[listName], queue, solverCellSet);
          allPaths = [...allPaths, ...foundPaths];
        }
      }
    });

    dispatch(setPaths(allPaths));
  };

  return (
    <div>
      <button onClick={handleGenerateConnections}>Generate Connections</button>
      <button onClick={handleFindPaths}>Find Paths</button>
      {paths.length > 0 && (
        <pre>
          {JSON.stringify(paths, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default ControlsSolver;
