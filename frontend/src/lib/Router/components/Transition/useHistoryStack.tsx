import { useEffect, useRef, useState } from 'react';
import historyStack from '../../historyStack';

function useHistoryStack() {
  const [historySize, setHistorySize] = useState(historyStack.size);
  const prevHistorySize = useRef(-1);
  const [shouldMoveToBack, setShouldMoveToBack] = useState(false);

  useEffect(() => {
    const isPop = prevHistorySize.current > historySize;
    setShouldMoveToBack(isPop);

    return () => {
      prevHistorySize.current = historySize;
    };
  }, [historySize]);

  useEffect(() => {
    historyStack.observe(setHistorySize);
  }, []);

  return {
    shouldMoveToBack,
  };
}

export default useHistoryStack;
