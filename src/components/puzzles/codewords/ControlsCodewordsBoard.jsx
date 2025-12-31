import { useSelector, useDispatch } from "react-redux";
import { setBoardSize, setCellSize } from "../../../features/codewords/codewordsSlice";
import ControlSection from "../../common/Controls/ControlSection";

const ControlsCodewordsBoard = () => {
    const dispatch = useDispatch();
    const { grid, cellSize } = useSelector(state => state.puzzles.codewords);

    const handleWidthChange = (e) => {
        const width = parseInt(e.target.value, 10) || 1;
        dispatch(setBoardSize({ width, height: grid.height }));
    };

    const handleHeightChange = (e) => {
        const height = parseInt(e.target.value, 10) || 1;
        dispatch(setBoardSize({ width: grid.width, height }));
    };

    const handleCellSizeChange = (e) => {
        const size = parseInt(e.target.value, 10);
        dispatch(setCellSize(size));
    };

    return (
        <ControlSection title="Board Settings">
            <div className="control-subsection">
                <label>
                    Width:
                    <input type="number" value={grid.width} onChange={handleWidthChange} min="1" max="50" />
                </label>
            </div>
            <div className="control-subsection">
                <label>
                    Height:
                    <input type="number" value={grid.height} onChange={handleHeightChange} min="1" max="50" />
                </label>
            </div>
            <div className="control-subsection">
                <label>
                    Cell Size: {cellSize}px
                    <input
                        type="range"
                        value={cellSize}
                        onChange={handleCellSizeChange}
                        min="20"
                        max="80"
                        step="2"
                    />
                </label>
            </div>
        </ControlSection>
    );
};

export default ControlsCodewordsBoard;
