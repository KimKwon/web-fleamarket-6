import { useContext } from 'react';
import {
  ToastContentType,
  ToastContext,
  ToastContextInfo,
  ToastCssType,
} from '../context/ToastContext';
import { getTimestamp } from '../utils';

function createToastContent(
  toastCssType: ToastCssType,
  toastContent: ToastContentType,
): ToastContextInfo {
  return {
    id: toastCssType + getTimestamp(),
    toastCssType,
    toastContent,
  };
}

function useToast() {
  const toastList = useContext(ToastContext.data);
  const toastDispatch = useContext(ToastContext.dispatch);

  const fire = (toastCssType: ToastCssType) => {
    return (toastContent: ToastContentType) => {
      toastDispatch({
        type: 'add',
        payload: createToastContent(toastCssType, toastContent),
      });
    };
  };

  const remove = (toastId: string) => {
    toastDispatch({
      type: 'remove',
      payload: { id: toastId },
    });
  };

  const clear = () => {
    toastDispatch({
      type: 'clear',
    });
  };

  return {
    toastList,
    notice: fire('notice'),
    error: fire('error'),
    warn: fire('warn'),
    clear,
    remove,
  };
}

export default useToast;
