import styled from 'styled-components';
import colors from '../../../styles/colors';
import ModalPortal from './ModalPortal';

interface ModalPropsType {
  isModalOpen: boolean;
  children: React.ReactNode | JSX.Element;
  closeModal: () => void;
}

function Modal({ isModalOpen, children, closeModal }: ModalPropsType) {
  if (!isModalOpen) {
    return null;
  }

  return (
    <ModalPortal>
      <ModalOverlay
        onClick={(event) => {
          event.stopPropagation();
          closeModal();
        }}
      ></ModalOverlay>
      <ModalContent>{children}</ModalContent>
    </ModalPortal>
  );
}

export default Modal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;

  background-color: ${colors.white};
`;
