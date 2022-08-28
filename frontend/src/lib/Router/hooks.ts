import { useContext } from 'react';
import { LocationContext } from './providers/LocationProvider';
import { PathDispatch } from './components/../providers/PathProvider';
import { getQueryString } from './utils';

export function useLocation() {
  const location = useContext(LocationContext);
  return location;
}

export function usePathParams() {
  const { params } = useLocation();

  return params;
}

export function useNavigate() {
  const pathDispatch = useContext(PathDispatch);

  return pathDispatch;
}

export function useSearchParams() {
  const { search } = useLocation();
  const queryStringMap = getQueryString(search);
  return (querystring: string) => {
    return queryStringMap[querystring];
  };
}

export function useHistoryState() {
  const currentState = window.history.state;
  if (!currentState) {
    return null;
  }

  return currentState;
}
