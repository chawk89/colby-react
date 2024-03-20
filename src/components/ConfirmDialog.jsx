import React from 'react'

import ReactDOM from 'react-dom';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6">
                <p className="mb-4">{message}</p>
                <div className="flex justify-end">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={onConfirm}
                    >
                        OK
                    </button>
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmDialog;
