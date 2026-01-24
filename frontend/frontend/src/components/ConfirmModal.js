import React from 'react';

const ConfirmModal = ({ show, onConfirm, onCancel, message }) => {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{message}</p>
        <button onClick={onConfirm} className="btn btn-danger">OK</button>
        <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmModal;
