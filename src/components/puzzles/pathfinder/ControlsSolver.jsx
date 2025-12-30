import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  findPaths,
  generateConnections,
  solveAllQueues,
} from "./lib/solver.js";
import {
  setSolutionChar,
  clearSolutionChars,
  setConnections,
  setPaths,
  toggleSolution,
  nextSolution,
  previousSolution,
} from "../../../features/pathfinder/pathfinderSlice.js";
import ControlSection from "../../common/Controls/ControlSection";

const ControlsSolver = () => {
  const dispatch = useDispatch();
  const { lists } = useSelector((state) => state.words);
  const { connections, paths, solutionVisible, currentSolutionIndex } =
    useSelector((state) => state.puzzles.pathfinder.solver);
  const { cellSet, queueSet, activeQueue } = useSelector(
    (state) => state.puzzles.pathfinder.cells
  );

  useEffect(() => {
    dispatch(clearSolutionChars());
    if (solutionVisible && paths.length > 0) {
      const currentSolution = paths[currentSolutionIndex];
      if (!currentSolution) return;

      const applyPathToQueue = (path, queue) => {
        if (queue && path.chain) {
          for (let i = 0; i < queue.length; i++) {
            dispatch(
              setSolutionChar({ cellId: queue[i], char: path.chain[i] })
            );
          }
        }
      };

      if (Array.isArray(currentSolution)) {
        // Solution for all queues
        const allQueues = Object.values(queueSet).filter(
          (q) => q && q.length > 0
        );
        currentSolution.forEach((path, index) => {
          applyPathToQueue(path, allQueues[index]);
        });
      } else if (currentSolution.path && currentSolution.chain) {
        // Single path
        applyPathToQueue(currentSolution, queueSet[activeQueue]);
      }
    }
  }, [
    solutionVisible,
    currentSolutionIndex,
    paths,
    dispatch,
    queueSet,
    activeQueue,
  ]);

  const handleGenerateConnections = () => {
    if (lists) {
      const connectionsSet = generateConnections(lists);
      dispatch(setConnections(connectionsSet));
    }
  };

  const handleFindPaths = () => {
    if (activeQueue) {
      const queue = queueSet[activeQueue];
      if (queue && queue.length > 0) {
        const pathsForQueue = findPaths(connections, queue, cellSet);
        dispatch(setPaths(pathsForQueue));
      }
    }
  };

  const handleSolveAllQueues = () => {
    const allQueues = Object.values(queueSet).filter((q) => q && q.length > 0);
    if (allQueues.length > 0) {
      const solutions = solveAllQueues(allQueues, connections, cellSet);
      dispatch(setPaths(solutions));
    }
  };

  const handleToggleSolution = () => {
    dispatch(toggleSolution());
  };

  const handleNextSolution = () => {
    dispatch(nextSolution());
  };

  const handlePreviousSolution = () => {
    dispatch(previousSolution());
  };

  return (
    <ControlSection title="Solver">
      <button onClick={handleGenerateConnections}>Generate Connections</button>
      <button onClick={handleFindPaths} disabled={!activeQueue}>
        Find Paths for Active Queue
      </button>
      <button onClick={handleSolveAllQueues}>Solve All Queues</button>

      <div className="label-row">
        <span>Connections:</span>
        <strong>{Object.keys(connections).length}</strong>
      </div>

      <div className="label-row">
        <span>Solutions:</span>
        <strong>{paths.length}</strong>
      </div>

      {paths.length > 0 && (
        <div className="solution-controls">
          <button onClick={handleToggleSolution}>
            {solutionVisible ? "Hide" : "Show"} Solution
          </button>
          {solutionVisible && (
            <div className="solution-nav">
              <button onClick={handlePreviousSolution}>&lt;</button>
              <span>
                {currentSolutionIndex + 1} of {paths.length}
              </span>
              <button onClick={handleNextSolution}>&gt;</button>
            </div>
          )}
        </div>
      )}
    </ControlSection>
  );
};

export default ControlsSolver;
