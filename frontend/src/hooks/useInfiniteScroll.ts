import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '../context/UserInfoContext';

interface useInfiniteScrollProps {
  loader: React.RefObject<HTMLDivElement>;
  asyncCallback: () => Promise<void>;
}

function useInfiniteScroll({ loader, asyncCallback }: useInfiniteScrollProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthorizing } = useContext(UserInfoContext);

  useEffect(() => {
    const onIntersect = async ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && !isLoading && !isAuthorizing) {
        setIsLoading(true);
        await asyncCallback();
        setIsLoading(false);
      }
    };

    let observer: IntersectionObserver;

    if (loader.current) {
      observer = new IntersectionObserver(onIntersect, {
        threshold: 1.0,
      });
      observer.observe(loader.current);
    }

    return () => {
      observer && observer.disconnect();
    };
  }, [loader, isLoading, isAuthorizing, asyncCallback]);

  return { isLoading };
}

export default useInfiniteScroll;
