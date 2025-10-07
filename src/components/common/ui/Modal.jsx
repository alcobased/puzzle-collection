import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../../features/ui/uiSlice';
import ModalManager from './ModalManager';
import './Modal.css';

const Modal = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.ui);

  const handleClose = () => {
    dispatch(closeModal());
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <ModalManager />
        <button className="close-button" onClick={handleClose}>X</button>
      </div>
    </div>
  );
};

export default Modal;
