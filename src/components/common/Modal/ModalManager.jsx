import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideModal } from "../../../features/ui/uiSlice";
import Modal from "./Modal"; // Generic Modal wrapper
import ModalCellProperties from "../../puzzles/pathfinder/ModalCellProperties";
import ModalWords from "./ModalWords";
import ModalCellQueue from "../../puzzles/pathfinder/ModalCellQueue";
import ModalDominoCell from "../../puzzles/domino/ModalDominoCell";
import ModalTextrisShapes from "../../puzzles/textris/ModalShapes";

// Map modal types to their respective components
const MODAL_COMPONENTS = {
  CELL_PROPERTIES: ModalCellProperties,
  WORD_MANAGER: ModalWords,
  QUEUE_MANAGER: ModalCellQueue,
  DOMINO_CELL: ModalDominoCell,
  TEXTRIS_SHAPES: ModalTextrisShapes,
};

// Map modal types to their titles
const MODAL_TITLES = {
  CELL_PROPERTIES: "Cell Properties",
  WORD_MANAGER: "Word Manager",
  QUEUE_MANAGER: "Queue Manager",
  DOMINO_CELL: "Domino Cell",
  TEXTRIS_SHAPES: "Textris Shapes",
};

const ModalManager = () => {
  const dispatch = useDispatch();
  // Destructure type and props from the modal state
  const { type, props } = useSelector((state) => state.ui.modal);

  const handleClose = () => {
    dispatch(hideModal());
  };

  // If no modal type is set, render nothing
  if (!type) {
    console.log("No modal type set");

    return null;
  }

  // Look up the component and title based on the type
  const SpecificModalComponent = MODAL_COMPONENTS[type];
  const modalTitle = MODAL_TITLES[type];

  return (
    <Modal title={modalTitle} onClose={handleClose}>
      {/* Render the specific modal component and pass the props to it */}
      <SpecificModalComponent {...props} onClose={handleClose} />
    </Modal>
  );
};

export default ModalManager;
