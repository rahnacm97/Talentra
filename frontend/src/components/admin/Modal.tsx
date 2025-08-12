import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onApprove: () => void;
  onCancel: () => void;
  actionType: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onApprove, onCancel, actionType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
        <p className="mb-4">Are you sure you want to {actionType} this item?</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onApprove} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Approve
          </button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;