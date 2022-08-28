import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import historyStack from '../historyStack';

export type NextPathType = string | -1;
export type PathDispatchOptions = {
  state?: any;
  replace?: boolean;
};

type PathDispatchType = (
  nextPath: NextPathType,
  options?: PathDispatchOptions,
) => void;

export const PathContext = createContext('/');
export const PathDispatch = createContext<PathDispatchType>(() => undefined);

function PathProvider({ children }: PropsWithChildren) {
  const [path, setPath] = useState(location.pathname);

  const handlePathChange = (
    nextPath: NextPathType,
    options?: PathDispatchOptions,
  ) => {
    if (nextPath === -1) {
      window.history.back();
      historyStack.pop();
      return;
    }

    setPath(nextPath);

    if (options?.replace) {
      window.history.replaceState(options?.state, '', nextPath);
      historyStack.update(nextPath);
      return;
    }

    window.history.pushState(options?.state, '', nextPath);
    historyStack.push(nextPath);
  };

  useEffect(() => {
    const handlePopState = () => {
      setPath(location.pathname);
      historyStack.pop();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <PathContext.Provider value={path}>
      <PathDispatch.Provider value={handlePathChange}>
        {children}
      </PathDispatch.Provider>
    </PathContext.Provider>
  );
}

export default PathProvider;
