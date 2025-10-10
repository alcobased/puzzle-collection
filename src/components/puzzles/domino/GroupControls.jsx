import { useDispatch } from "react-redux";
import { resetGroups } from "../../../features/domino/dominoSlice";

const GroupControls = () => {
  const dispatch = useDispatch();

  const handleResetGroups = () => {
    dispatch(resetGroups());
  };

  return (
    <div className="controls-group">
      <h3>Groups</h3>
      <div className="btn-group">
        <button onClick={handleResetGroups}>Reset groups</button>
      </div>
    </div>
  );
};

export default GroupControls;