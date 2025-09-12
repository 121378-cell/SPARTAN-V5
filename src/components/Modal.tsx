import React from 'react';
import ReactModal from 'react-modal';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

// Bind modal to your appElement
ReactModal.setAppElement('#root');

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="spartan-modal"
            overlayClassName="spartan-modal-overlay"
            contentLabel={title}
        >
            <div className="modal-header">
                <h2>{title}</h2>
                <button onClick={onClose} className="modal-close-button">&times;</button>
            </div>
            <div className="modal-content">
                {children}
            </div>
        </ReactModal>
    );
};
