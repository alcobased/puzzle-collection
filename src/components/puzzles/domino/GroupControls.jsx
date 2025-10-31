import { useDispatch } from "react-redux";
import { resetGroups } from "../../../features/domino/dominoSlice";

const GroupControls = () => {
  const dispatch = useDispatch();

  const handleResetGroups = () => {
    dispatch(resetGroups());
  };

  return (
    <div className="control-section">
      <h4>Groups</h4>
      <button onClick={handleResetGroups}>Reset groups</button>
    </div>
  );
};

export default GroupControls;
