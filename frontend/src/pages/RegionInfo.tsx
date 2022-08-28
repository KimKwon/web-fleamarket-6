import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import withCheckLogin from '../components/HOC/withCheckLogin';
import PageHeader from '../components/PageHeader/PageHeader';
import RegionSearchContainer from '../components/RegionSearchContainer';
import { UserInfoContext, UserInfoDispatch } from '../context/UserInfoContext';
import useToast from '../hooks/useToast';
import { remote } from '../lib/api';
import { useNavigate } from '../lib/Router';
import colors from '../styles/colors';
import { initialRegionValue } from '../types/region';

function RegionInfo() {
  const userInfo = useContext(UserInfoContext);
  const userInfoDispatch = useContext(UserInfoDispatch);

  const [selectedRegion, setSelectedRegion] = useState({
    ...initialRegionValue,
  });
  const navigate = useNavigate();
  const { warn } = useToast();

  const handleChangeRegion = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedRegion?.id) {
      warn('지역을 선택해주세요.');
      return;
    }

    await remote.patch('/region', {
      userId: userInfo.userId,
      regionId: selectedRegion.id,
    });

    userInfoDispatch({
      type: 'USERINFO/CHANGE_REGION',
      payload: { regionId: selectedRegion.id, region: selectedRegion.name },
    });

    navigate('/');
  };

  return (
    <>
      <PageHeader pageName="현재 지역 변경하기" />
      <StyledForm onSubmit={handleChangeRegion}>
        <div className="current-info">
          <div className="guide-ment">현재 설정된 동네</div>
          <div className="current-region">{userInfo.region}</div>
        </div>
        <label className="region-label" htmlFor="region">
          변경할 동네를 입력하세요
        </label>
        <RegionSearchContainer
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />
        <button disabled={!selectedRegion.id} type="submit">
          변경하기
        </button>
      </StyledForm>
    </>
  );
}

export default withCheckLogin(RegionInfo);

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;

  .current-info {
    margin-bottom: 3.5rem;

    .guide-ment {
      margin-bottom: 1.25rem;
    }

    .current-region {
      padding: 0.5rem;
      background-color: ${colors.orange};
      border-radius: 8px;
      text-align: center;
      color: ${colors.white};
    }
  }

  .region-label {
    margin-bottom: 1.25rem;
  }

  button[type='submit'] {
    margin-top: 1.25rem;
    padding: 0.625rem;
    background: ${colors.primary};
    opacity: 1;
    border-radius: 8px;
    color: ${colors.white};
  }

  button[type='submit']:disabled {
    opacity: 0.5;
  }

  .region-item {
    padding: 0.5rem;
    background-color: ${colors.gray200};
    border-bottom: 1px solid ${colors.white};
  }
`;
