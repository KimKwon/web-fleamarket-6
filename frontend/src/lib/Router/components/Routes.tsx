import React, {
  Children,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { PathContext } from '../providers/PathProvider';
import {
  getPathParams,
  isMatchedRoute,
  isValidChild,
  removeQueryString,
  throwError,
  transformPathVariables,
} from '../utils';
import { LocationDispatch, LocationInfo } from '../providers/LocationProvider';
import NotFound from '../../../pages/NotFound';

function Routes({
  children,
  locationInfo,
}: PropsWithChildren<{
  locationInfo?: {
    pathname: string;
    search: string;
  };
}>) {
  const path = useContext(PathContext);
  const changeLocation = useContext(LocationDispatch);
  const currentPath = locationInfo?.pathname || path;

  const nextLocation = useRef<LocationInfo>();
  const currentRoute = useRef(<NotFound />);

  Children.forEach(children, (child: React.ReactNode) => {
    if (!isValidChild(child)) {
      throwError('올바른 Route 컴포넌트가 아닙니다.');
      return;
    }

    const { path: routePath, element: routeElement } = child.props;

    const { parsedPath, params } = transformPathVariables(
      removeQueryString(routePath),
    );

    if (isMatchedRoute(parsedPath, removeQueryString(currentPath))) {
      currentRoute.current = routeElement;

      nextLocation.current = {
        pathname: currentPath,
        params: getPathParams({
          currentPath,
          pathRegex: parsedPath,
          paramArray: params,
        }),
        search: locationInfo?.search || '',
      };
    }
  });
  useEffect(() => {
    if (nextLocation.current) {
      changeLocation(nextLocation.current);
    }
  }, []);

  return <>{currentRoute.current}</>;
}

export default Routes;
