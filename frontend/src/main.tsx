import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastProvider } from './context/ToastContext';
import UserInfoProvider from './context/UserInfoContext';
import PathProvider from './lib/Router/providers/PathProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ToastProvider>
    <UserInfoProvider>
      <PathProvider>
        <App />
      </PathProvider>
    </UserInfoProvider>
  </ToastProvider>,
);
