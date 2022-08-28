import { useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import CustomInput from '../../components/CustomInput';
import PageHeader from '../../components/PageHeader/PageHeader';
import { NICKNAME, PASSWORD } from '../../constants/validation';
import { UserInfoDispatch } from '../../context/UserInfoContext';
import useTextInputs from '../../hooks/useTextInputs';
import { credentialRemote } from '../../lib/api';
import { Link, useNavigate } from '../../lib/Router';
import colors from '../../styles/colors';
import { textMedium, textSmall } from '../../styles/fonts';
import loginBanner from '../../assets/login-banner.png';
import { appearFromBottom, bannerAnimation } from '../../styles/keyframes';

function SignIn() {
  const dispatch = useContext(UserInfoDispatch);
  const navigate = useNavigate();
  const { inputs, handleChange } = useTextInputs<{
    nickname: string;
    password: string;
  }>({
    initialValue: {
      nickname: '',
      password: '',
    },
  });

  const [isBasicInputOpen, setIsBasicInputOpen] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!(inputs.nickname && inputs.password)) {
      return;
    }

    const { data } = await credentialRemote.post('auth/signin', {
      nickname: inputs.nickname,
      password: inputs.password,
    });

    if (!data) {
      alert('로그인에 실패했습니다.');

      return;
    }

    dispatch({
      type: 'USERINFO/SET_USER',
      payload: {
        userId: data.id,
        name: data.nickname,
        region: data.regionName,
        regionId: data.regionId,
      },
    });

    navigate('/');
  };

  return (
    <>
      <PageHeader pageName="로그인" />
      <StyledLoginBanner src={loginBanner} alt="login-banner" />

      <StyledSignInForm onSubmit={handleLogin}>
        {!isBasicInputOpen && (
          <StyledGithubOAuthLink
            href={`https://github.com/login/oauth/authorize?client_id=${
              import.meta.env.VITE_CLIENT_ID
            }`}
          >
            깃허브로 로그인
          </StyledGithubOAuthLink>
        )}
        {isBasicInputOpen && (
          <InputHideBox>
            <CustomInput
              type="text"
              name="nickname"
              placeholder="닉네임을 입력하세요"
              value={inputs.nickname}
              onChange={handleChange('nickname')}
              autoComplete="off"
              validation={NICKNAME.REGEX}
              error={NICKNAME.ERROR_MESSAGE}
            />
            <CustomInput
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={inputs.password}
              onChange={handleChange('password')}
              validation={PASSWORD.REGEX}
              error={PASSWORD.ERROR_MESSAGE}
            />
          </InputHideBox>
        )}
        <StyledBasicLoginButton
          type="submit"
          onClick={() => setIsBasicInputOpen((prev) => !prev)}
        >
          플리마켓 로그인
        </StyledBasicLoginButton>
        <Link className="signup-link" to="/auth/sign-up">
          회원가입
        </Link>
      </StyledSignInForm>
    </>
  );
}

export default SignIn;

const StyledSignInForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  padding-top: 3rem;
  text-align: center;

  input {
    margin-bottom: 1rem;
  }

  .signup-link {
    margin-top: 15px;
    ${textSmall};
  }
`;

const LoginCss = css`
  display: block;
  padding: 0.625rem 0;

  color: ${colors.white};
  border-radius: 8px;
  margin-bottom: 1rem;

  ${textMedium};
`;

const StyledGithubOAuthLink = styled.a`
  ${LoginCss};

  background-color: ${colors.gray0};
`;

const StyledBasicLoginButton = styled.button`
  ${LoginCss};
  background-color: ${colors.primary};
`;

const StyledLoginBanner = styled.img`
  display: block;
  width: 60%;
  margin: 0 auto;
  margin-top: 1rem;
  border-radius: 4px;
  opacity: 0.5;

  animation: ${bannerAnimation} infinite 1.5s ease;
`;

const InputHideBox = styled.div`
  width: 100%;

  & > input {
    width: 100%;
  }

  animation: ${appearFromBottom} forwards 0.5s ease-in-out;
`;
