import ToastContainer from './components/commons/Toast/ToastContainer';
import useToken from './hooks/useToken';
import { Route, Router, Routes } from './lib/Router';
import OAuthRedirect from './pages/Auth/OAuthRedirect';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import Category from './pages/Category';
import ChatList from './pages/Chat/ChatList';
import ChatRoom from './pages/Chat/ChatRoom';
import Home from './pages/Home';
import My from './pages/My';
import PostDetail from './pages/Post/PostDetail';
import PostManager from './pages/Post/PostManager';
import RegionInfo from './pages/RegionInfo';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  useToken();

  return (
    <>
      <GlobalStyles />
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my" element={<My />} />
          <Route path="/region" element={<RegionInfo />} />
          <Route path="/category" element={<Category />} />
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />
          <Route path="/auth/OAuth-redirect" element={<OAuthRedirect />} />
          <Route path="/post/:productId" element={<PostDetail />} />
          <Route path="/post/manage" element={<PostManager />} />
          <Route path="/chat" element={<ChatList />} />
          <Route path="/chat/:chatId" element={<ChatRoom />} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
