import { createContext, PropsWithChildren, useReducer } from 'react';
import type { Dispatch } from 'react';

export type ToastContentType = JSX.Element | string;
export type ToastCssType = 'notice' | 'warn' | 'error';

export interface ToastContextInfo {
  toastCssType: ToastCssType;
  toastContent: ToastContentType;
  id: string;
}

type ToastActionType =
  | {
      type: 'add';
      payload: ToastContextInfo;
    }
  | {
      type: 'remove';
      payload: Partial<ToastContextInfo>;
    }
  | {
      type: 'clear';
    };

const initialToastList: ToastContextInfo[] = [];

export const ToastContext = {
  data: createContext<ToastContextInfo[]>(initialToastList),
  dispatch: createContext<Dispatch<ToastActionType>>(() => undefined),
};

function toastReducer(state: ToastContextInfo[], action: ToastActionType) {
  switch (action.type) {
    case 'add':
      if (!action.payload) return state;
      return [...state, action.payload];
    case 'remove':
      return state.filter(({ id }) => id !== action.payload?.id);
    case 'clear':
    default:
      return [...initialToastList];
  }
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [toastList, toastListDispatch] = useReducer(
    toastReducer,
    initialToastList,
  );

  return (
    <ToastContext.data.Provider value={toastList}>
      <ToastContext.dispatch.Provider value={toastListDispatch}>
        {children}
      </ToastContext.dispatch.Provider>
    </ToastContext.data.Provider>
  );
}
