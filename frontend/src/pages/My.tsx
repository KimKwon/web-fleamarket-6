import { useContext } from 'react';
import styled from 'styled-components';
import PageHeader from '../components/PageHeader/PageHeader';
import TABS from '../constants/tabs';
import { UserInfoDispatch } from '../context/UserInfoContext';
import useMyPage from '../hooks/useMyPage';
import { credentialRemote } from '../lib/api';
import { useNavigate } from '../lib/Router';
import colors from '../styles/colors';
import { textSmall, textXSmall } from '../styles/fonts';
import mixin from '../styles/mixin';

function My() {
  const dispatch = useContext(UserInfoDispatch);
  const navigate = useNavigate();
  const { tab, selectTab, getTabContents } = useMyPage();

  const handleLogout = async () => {
    await credentialRemote.get('auth/logout');
    dispatch({ type: 'USERINFO/DELETE_USER' });
    navigate('/');
  };

  return (
    <>
      <PageHeader
        pageName="마이페이지"
        extraButton={
          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        }
      />
      <StyledMyPageTabs>
        {TABS.map((item) => (
          <li
            key={item}
            className={tab === item ? 'selected' : ''}
            onClick={() => selectTab(item)}
          >
            {item}
          </li>
        ))}
      </StyledMyPageTabs>
      <ul>{getTabContents()}</ul>
    </>
  );
}

export default My;

const StyledMyPageTabs = styled.ul`
  position: sticky;
  top: 3.5rem;
  z-index: 1;

  display: flex;
  justify-content: space-around;
  padding-top: 1rem;
  background-color: ${colors.offWhite};
  ${mixin.shadow.bottom};

  li {
    padding: 0 0.5rem 0.75rem 0.5rem;
    ${textXSmall};
  }

  .selected {
    color: ${colors.primary};
    border-bottom: 2px solid ${colors.primary};
  }
`;

export const StyledGuideMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  ${textSmall};
  color: ${colors.gray200};
`;

const LogoutButton = styled.button`
  ${textXSmall};
  letter-spacing: -0.1em;
  color: ${colors.gray100};
`;
