import PathProvider from '../providers/PathProvider';

function Router({ children }: { children: React.ReactNode }) {
  return <PathProvider>{children}</PathProvider>;
}

export default Router;
