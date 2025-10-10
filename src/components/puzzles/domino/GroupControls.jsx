import { useDispatch } from "react-redux";
import { resetGroups } from "../../../features/domino/dominoSlice";

const GroupControls = () => {
  const dispatch = useDispatch();

  const handleResetGroups = () => {
    dispatch(resetGroups());
  };

  return (
    <fieldset>
      <legend>Groups</legend>
      <div className="btn-group">
        <button onClick={handleResetGroups}>Reset groups</button>
      </div>
    </fieldset>
  );
};

export default GroupControls;
