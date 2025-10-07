import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../features/ui/uiSlice';
import CellPropertiesModal from '../pathfinder/CellPropertiesModal';
import QueueManagerModal from '../pathfinder/QueueManagerModal';
import WordManagerModal from '../words/WordManagerModal';

const MODAL_COMPONENTS = {
  CELL_PROPERTIES: CellPropertiesModal,
  QUEUE_MANAGER: QueueManagerModal,
  WORD_MANAGER: WordManagerModal,
};

const ModalManager = () => {
  const dispatch = useDispatch();
  const { modalType, modalProps } = useSelector((state) => state.ui.modal);

  if (!modalType) {
    return null;
  }

  const SpecificModal = MODAL_COMPONENTS[modalType];

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={handleClose}>X</button>
        <SpecificModal {...modalProps} />
      </div>
    </div>
  );
};

export default ModalManager;
