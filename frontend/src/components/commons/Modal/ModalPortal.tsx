import React from 'react';
import ReactDOM from 'react-dom';

interface ModalPortalProps {
  children: React.ReactNode;
}

function ModalPortal({ children }: ModalPortalProps) {
  const modalElement = document.getElementById('modal') as Element;

  return ReactDOM.createPortal(children, modalElement);
}

export default ModalPortal;
