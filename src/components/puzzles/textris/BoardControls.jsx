import { useDispatch, useSelector } from "react-redux";
import { clearBoard, togglePhase, setBoardDimensions } from "../../../features/textris/textrisSlice";
import { showModal } from "../../../features/ui/uiSlice";

const BoardControls = () => {
  const dispatch = useDispatch();
  const { phase, board } = useSelector((state) => state.puzzles.textris.setup);
  const { width, height } = board;

  const handleClearBoard = () => {
    dispatch(clearBoard());
  };

  const handleTogglePhase = () => {
    dispatch(togglePhase());
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    const newDimensions = {
      width,
      height,
      [name]: parseInt(value, 10),
    };
    dispatch(setBoardDimensions(newDimensions));
  };

  const handleOpenPiecesManager = () => {
    dispatch(showModal({ type: 'TEXTRIS_PIECES_MANAGER' }));
  };

  return (
    <div className="control-section">
      <h4>Board Setup</h4>
      {phase === 'setup' && (
        <>
          <label htmlFor="width">Width</label>
          <input
            type="number"
            id="width"
            name="width"
            value={width || ''}
            onChange={handleDimensionChange}
            min="1"
          />
          <label htmlFor="height">Height</label>
          <input
            type="number"
            id="height"
            name="height"
            value={height || ''}
            onChange={handleDimensionChange}
            min="1"
          />
          <button onClick={handleClearBoard}>Clear Board</button>
          <button onClick={handleOpenPiecesManager}>Pieces</button>
        </>
      )}
      <button onClick={handleTogglePhase}>
        {phase === 'setup' ? 'Lock Board' : 'Unlock Board'}
      </button>
    </div>
  );
};

export default BoardControls;
