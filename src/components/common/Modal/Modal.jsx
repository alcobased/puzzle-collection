import React from 'react';
import './Modal.css';

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>
        {/* Children are now wrapped in modal-body to handle padding and scrolling */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
