import { useSelector, useDispatch } from "react-redux";
import ControlPanel from "./components/Controls/Controls";
import Grid from "./components/Grid/Grid";
import Modal from "./components/Modal/Modal";
import { closeModal } from "./reducers/uiReducer";
import CellPropertiesModal from "./components/Modal/CellPropertiesModal";

function App() {
  const isModalOpen = useSelector((state) => state.ui.isModalOpen);
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  return (
    <>
      <ControlPanel />
      <Grid />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <CellPropertiesModal />
      </Modal>
    </>
  );
}

export default App;
