import { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import useToast from '../../../hooks/useToast';
import ToastContent from './ToastContent';

function ToastPortal({ children }: PropsWithChildren) {
  const toastElement = document.getElementById('toast');
  if (!toastElement) return <>{children}</>;

  return createPortal(children, toastElement);
}

function ToastContainer() {
  const { toastList } = useToast();
  return (
    <ToastPortal>
      <ToastBox>
        <ToastSection>
          {toastList.map(({ id, toastContent, toastCssType }) => (
            <ToastContent key={id} toastId={id} toastCssType={toastCssType}>
              {toastContent}
            </ToastContent>
          ))}
        </ToastSection>
      </ToastBox>
    </ToastPortal>
  );
}

const ToastBox = styled.div`
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translate(-50%, 100%);

  width: 80%;

  pointer-events: none;
`;

const ToastSection = styled.ol`
  height: 25vh;
  overflow-y: hidden;
  transform: translateY(-100%);

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.5rem;
`;

export default ToastContainer;
