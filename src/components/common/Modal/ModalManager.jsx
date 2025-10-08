import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearModal } from "../../../features/ui/uiSlice";
import Modal from "./Modal";
import ModalCellProperties from "../../puzzles/pathfinder/ModalCellProperties";
import ModalWords from "./ModalWords";
import ModalCellQueue from "../../puzzles/pathfinder/ModalCellQueue";

const MODAL_COMPONENTS = {
  CELL_PROPERTIES: ModalCellProperties,
  WORD_MANAGER: ModalWords,
  QUEUE_MANAGER: ModalCellQueue,
};

const MODAL_TITLES = {
  CELL_PROPERTIES: "Cell Properties",
  WORD_MANAGER: "Word Manager",
  QUEUE_MANAGER: "Queue Manager",
};

const ModalManager = () => {
  const dispatch = useDispatch();
  const modalType = useSelector((state) => state.ui.modal);

  const handleClose = () => {
    dispatch(clearModal());
  };

  if (!modalType) {
    return null;
  }

  const SpecificModalComponent = MODAL_COMPONENTS[modalType];
  const modalTitle = MODAL_TITLES[modalType];

  return (
    <Modal onClose={handleClose} title={modalTitle}>
      <SpecificModalComponent onClose={handleClose} />
    </Modal>
  );
};

export default ModalManager;
