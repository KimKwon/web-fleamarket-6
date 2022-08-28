import notFoundBanner from '../assets/notfound-banner.png';
import styled from 'styled-components';
import { Link } from '../lib/Router';
import colors from '../styles/colors';
import PageHeader from '../components/PageHeader/PageHeader';
import { bannerAnimation } from '../styles/keyframes';

function NotFound() {
  return (
    <>
      <PageHeader pageName="404" />
      <StyledNotFound>
        <img src={notFoundBanner} alt="notfound-banner" />
        <ContentArea>
          <h2>404 Not Found</h2>
          <p>죄송해요.</p>
          <p>요청한 웹페이지를 찾을 수 없어요.</p>
          <Link to="/">메인으로 돌아가기</Link>
        </ContentArea>
      </StyledNotFound>
    </>
  );
}

const StyledNotFound = styled.main`
  width: 100%;
  height: calc(100vh - 3.5rem);
  padding: 1rem 2rem;

  display: flex;
  flex-direction: column;

  & > img {
    width: 100%;
    max-height: 50%;
    object-fit: cover;
    border-radius: 30px;
    display: block;

    margin-bottom: 2rem;

    animation: ${bannerAnimation} 4s ease-in-out infinite;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

  & > h2 {
    font-size: 2rem;
    font-family: Impact;
    color: ${colors.red};
  }

  & > a {
    display: block;
    text-align: center;

    padding: 1rem;
    margin-top: auto;
    margin-bottom: 1rem;
    border-radius: 8px;

    color: white;
    background-color: ${colors.primary};
  }
`;

export default NotFound;
