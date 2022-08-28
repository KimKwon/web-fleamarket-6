import { throwError } from '../utils';

interface RouteProps {
  path: string;
  element: React.ReactNode;
}

function Route(_props: RouteProps) {
  throwError(
    'Route 컴포넌트는 Routes 컴포넌트의 자식이어야 합니다. 직접 호출하지마세요!',
  );

  return null;
}

export default Route;
