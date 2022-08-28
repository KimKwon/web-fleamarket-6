import { useContext, useState } from 'react';
import styled from 'styled-components';
import CustomInput from '../../components/CustomInput';
import PageHeader from '../../components/PageHeader/PageHeader';
import RegionSearchContainer from '../../components/RegionSearchContainer';
import { NICKNAME, PASSWORD } from '../../constants/validation';
import { UserInfoDispatch } from '../../context/UserInfoContext';
import useTextInputs from '../../hooks/useTextInputs';
import useToast from '../../hooks/useToast';
import { credentialRemote } from '../../lib/api';
import { useHistoryState, useNavigate } from '../../lib/Router/hooks';
import colors from '../../styles/colors';
import { initialRegionValue, RegionType } from '../../types/region';

function SignUp() {
  const [selectedRegion, setSelectedRegion] = useState<RegionType>({
    ...initialRegionValue,
  });
  const githubUser = useHistoryState();
  const dispatch = useContext(UserInfoDispatch);
  const navigate = useNavigate();
  const { warn } = useToast();
  const { inputs, handleChange } = useTextInputs<{
    nickname: string;
    password: string;
  }>({
    initialValue: {
      nickname: '',
      password: '',
    },
  });

  const isFormSubmitable =
    inputs.nickname && inputs.password && selectedRegion?.id;

  const signupWithGithub = async () => {
    const userInfo = { ...githubUser, regionId: selectedRegion.id };

    const { data } = await credentialRemote.post('/auth/signup', {
      ...userInfo,
    });

    dispatch({
      type: 'USERINFO/SET_USER',
      payload: {
        userId: data.id,
        name: data.nickname,
        region: selectedRegion.name,
        regionId: selectedRegion.id,
      },
    });
  };

  const signup = async () => {
    const userInfo = {
      nickname: inputs.nickname,
      password: inputs.password,
      regionId: selectedRegion.id,
    };

    const { data } = await credentialRemote.post('auth/signup', userInfo);

    dispatch({
      type: 'USERINFO/SET_USER',
      payload: {
        userId: data.id,
        name: data.nickname,
        region: selectedRegion.name,
        regionId: selectedRegion.id,
      },
    });
  };

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormSubmitable) {
      warn('필수값을 모두 입력해주세요.');
      return;
    }

    if (githubUser) {
      await signupWithGithub();
      navigate('/');
      return;
    }

    signup();
    navigate('/');
  };

  return (
    <>
      <PageHeader pageName="회원가입" prevUrl="/" />
      <StyledSignupForm onSubmit={handleSignup}>
        {!githubUser && (
          <>
            <CustomInput
              name="nickname"
              type="text"
              value={inputs.nickname}
              onChange={handleChange('nickname')}
              placeholder="영문, 숫자 조합 10자 이하"
              validation={NICKNAME.REGEX}
              error={NICKNAME.ERROR_MESSAGE}
              autoComplete="off"
            />
            <CustomInput
              name="password"
              type="password"
              value={inputs.password}
              onChange={handleChange('password')}
              placeholder="영문/특문/숫자 조합 16자 이하"
              validation={PASSWORD.REGEX}
              error={PASSWORD.ERROR_MESSAGE}
            />
          </>
        )}
        <RegionSearchContainer
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />
        <button disabled={!isFormSubmitable} type="submit">
          회원가입
        </button>
      </StyledSignupForm>
    </>
  );
}

export default SignUp;

const StyledSignupForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 1rem;

  button[type='submit'] {
    padding: 0.625rem 0;
    background-color: ${colors.primary};
    color: ${colors.white};
    border-radius: 8px;
  }

  button:disabled {
    opacity: 0.5;
  }
`;
