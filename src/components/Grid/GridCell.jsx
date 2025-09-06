import { useDispatch } from "react-redux";
import { setActiveCell } from "../../reducers/cellReducer";
import { openModal } from "../../reducers/uiReducer";

const GridCell = ({ id, style, char }) => {
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the GridCells container
    dispatch(setActiveCell(id));
    dispatch(openModal());
  };

  return (
    <div className="cell" style={style} onClick={handleClick}>
      {char}
    </div>
  );
};

export default GridCell;
