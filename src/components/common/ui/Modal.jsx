import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactDOM from 'react-dom';
import { closeModal } from '../../../features/ui/uiSlice.js';
import { setActiveCell } from '../../../features/pathfinder/pathfinderSlice.js';
import CellPropertiesModal from '../../puzzles/pathfinder/CellPropertiesModal'
import QueueManagerModal from '../../puzzles/pathfinder/QueueManagerModal';
import WordManagerModal from '../../puzzles/words/WordManagerModal';
import './Modal.css';

const ModalContent = () => {
  const modalType = useSelector((state) => state.ui.modalType);

  switch (modalType) {
    case 'CELL_PROPERTIES':
      return <CellPropertiesModal />;
    case 'QUEUE_MANAGER':
      return <QueueManagerModal />;
    case 'WORD_MANAGER':
      return <WordManagerModal />;
    default:
      return null;
  }
};

const Modal = () => {
    const dispatch = useDispatch();
    const { isModalOpen, modalType } = useSelector((state) => state.ui);

    const handleClose = () => {
        dispatch(closeModal());
        dispatch(setActiveCell(null)); // Also reset the active cell
    };

    if (!isModalOpen) return null;

    const modalClass = `modal-content ${
        modalType ? `modal-type-${modalType.toLowerCase().replace(/_/g, '-')}` : ''
    }`;

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={handleClose}>
            <div className={modalClass} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={handleClose}>
                &times;
                </button>
                <ModalContent />
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default Modal;
