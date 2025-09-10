import React from 'react';

const Modal = ({ isOpen, onClose, title, message, onConfirm, showConfirmButton = false, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full z-50">
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">{title}</h2>
        {children ? (
          <div className="mb-6">{children}</div>
        ) : (
          <div className="mb-6" dangerouslySetInnerHTML={{ __html: message }}></div>
        )}
        <div className="flex justify-between">
          {showConfirmButton && (
            <button
              onClick={onConfirm}
              className="botton-submit"
            >
              Confirmar Reserva
            </button>
          )}
          <button
            onClick={onClose}
            className="botton-submit"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
