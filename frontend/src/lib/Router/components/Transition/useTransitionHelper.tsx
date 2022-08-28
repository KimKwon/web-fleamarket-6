import React, { useContext, useEffect, useRef, useState } from 'react';
import { PathContext } from '../../providers/PathProvider';
import { cloneChildren } from '../../utils';

export interface RouteInfo {
  element?: JSX.Element;
  locationInfo?: {
    search?: string;
    pathname?: string;
  };
}

interface CloneRouteInfo {
  children: React.ReactNode;
  locationInfo: RouteInfo['locationInfo'];
}

function useTransitionHelper({
  currentChildren,
}: {
  currentChildren: React.ReactNode;
}) {
  const path = useContext(PathContext);
  const isMount = useRef(false);

  const [isAnimationReady, setIsAnimationReady] = useState(false);

  const [currentRoute, setCurrentRoute] = useState<RouteInfo>({
    element: cloneChildren(currentChildren, {
      pathname: path,
      search: window.location.search,
    }),
    locationInfo: { pathname: path, search: window.location.search },
  });

  const [nextRoute, setNextRoute] = useState<RouteInfo>({});

  const changeRoute = (isNext: 'next' | 'current') => {
    const routeSetter = isNext === 'next' ? setNextRoute : setCurrentRoute;
    return (routeInfo: CloneRouteInfo) => {
      const { children, locationInfo } = routeInfo;
      routeSetter({
        element: cloneChildren(children, locationInfo),
        locationInfo,
      });
    };
  };

  const handleAnimationEnd = () => {
    setIsAnimationReady(false);
  };

  useEffect(() => {
    if (!isMount.current) {
      return;
    }

    const changeNextRouteInfo = changeRoute('next');

    changeNextRouteInfo({
      children: currentChildren,
      locationInfo: {
        pathname: path,
        search: window.location.search,
      },
    });
    setIsAnimationReady(true);

    window.scrollTo({ top: 0 });
  }, [currentChildren, path]);

  useEffect(() => {
    if (isMount.current && !isAnimationReady) {
      const { element, locationInfo } = nextRoute;

      const changeCurrentRouteInfo = changeRoute('current');
      changeCurrentRouteInfo({
        children: element,
        locationInfo,
      });
    }
  }, [isAnimationReady, nextRoute]);

  useEffect(() => {
    isMount.current = true;
  }, []);

  return {
    handleAnimationEnd,
    isAnimationReady,
    currentRoute,
    nextRoute,
  };
}

export default useTransitionHelper;
