import { PropsWithChildren, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { ToastCssType } from '../../../context/ToastContext';
import useToast from '../../../hooks/useToast';
import colors from '../../../styles/colors';
import {
  appearFromLeft,
  disappearWithOpacity,
} from '../../../styles/keyframes';

const TOAST_EXPIRE_TIME = 2000;

function ToastContent({
  children,
  toastCssType,
  toastId,
}: PropsWithChildren<{ toastCssType: ToastCssType; toastId: string }>) {
  const { remove } = useToast();

  useEffect(() => {
    const timerId = setTimeout(() => {
      remove(toastId);
    }, TOAST_EXPIRE_TIME);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <StyledToastContent type={toastCssType}>{children}</StyledToastContent>
  );
}

const ToastCss = {
  notice: css`
    background-color: ${colors.primary};
    color: ${colors.white};

    &::before {
      content: '✅ ';
      margin-right: 0.3rem;
    }
  `,
  warn: css`
    background-color: ${colors.gray200};
    color: ${colors.white};

    &::before {
      content: '⚠️ ';
      margin-right: 0.3rem;
    }
  `,
  error: css`
    background-color: ${colors.red};
    color: ${colors.white};

    &::before {
      content: '❕ ';
      margin-right: 0.3rem;
    }
  `,
};

const StyledToastContent = styled.li<{ type: ToastCssType }>`
  ${({ type }) => ToastCss[type]};

  width: 100%;
  border-radius: 8px;
  margin: 0 auto;
  padding: 0.5rem 1rem;

  animation: ${appearFromLeft} ease-out 0.3s forwards;
  animation: ${disappearWithOpacity} ${TOAST_EXPIRE_TIME}ms forwards;
`;
export default ToastContent;
