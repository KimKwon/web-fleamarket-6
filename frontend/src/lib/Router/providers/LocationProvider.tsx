import {
  Children,
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { cloneChildren } from '../utils';

type ParamsType = {
  [pathParam: string]: string;
};

export interface LocationInfo {
  pathname: string;
  search: string;
  params: ParamsType;
}

interface LocationDispatch {
  (_partialLocation: Partial<LocationInfo>): void;
}

export const LocationContext = createContext<LocationInfo>({
  pathname: '',
  search: '',
  params: {},
});
export const LocationDispatch = createContext<LocationDispatch>(
  (_partialLocation) => undefined,
);

function LocationProvider({
  children,
  locationInfo,
}: PropsWithChildren<{
  locationInfo?: {
    search?: string;
    pathname?: string;
  };
}>) {
  const [location, setLocation] = useState<LocationInfo>({
    pathname: '',
    search: '',
    params: {},
  });

  const changeLocation = useCallback(
    (partialLocation: Partial<LocationInfo>) => {
      setLocation((prevLocation) => ({ ...prevLocation, ...partialLocation }));
      return;
    },
    [],
  );

  useEffect(() => {
    if (!locationInfo?.pathname || location.pathname) return;

    setLocation((prevLocation) => ({ ...prevLocation, ...locationInfo }));
  }, [locationInfo, location]);

  return (
    <LocationContext.Provider value={location}>
      <LocationDispatch.Provider value={changeLocation}>
        {Children.map(children, (child) => cloneChildren(child, locationInfo))}
      </LocationDispatch.Provider>
    </LocationContext.Provider>
  );
}

export default LocationProvider;
