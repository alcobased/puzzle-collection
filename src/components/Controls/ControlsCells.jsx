import { useDispatch } from "react-redux";
import { openModal } from "../../reducers/uiReducer";

const ControlsCells = () => {
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    dispatch(openModal());
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Open Modal</button>
    </div>
  );
};

export default ControlsCells;
