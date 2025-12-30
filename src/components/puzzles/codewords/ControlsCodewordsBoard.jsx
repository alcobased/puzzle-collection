import { useSelector, useDispatch } from "react-redux";
import { setBoardSize } from "../../../features/codewords/codewordsSlice";
import ControlSection from "../../common/Controls/ControlSection";

const ControlsCodewordsBoard = () => {
    const dispatch = useDispatch();
    const { grid } = useSelector(state => state.puzzles.codewords);

    const handleWidthChange = (e) => {
        const width = parseInt(e.target.value, 10) || 1;
        dispatch(setBoardSize({ width, height: grid.height }));
    };

    const handleHeightChange = (e) => {
        const height = parseInt(e.target.value, 10) || 1;
        dispatch(setBoardSize({ width: grid.width, height }));
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
        </ControlSection>
    );
};

export default ControlsCodewordsBoard;
