import React, { useContext, useEffect } from 'react';
import { UserInfoDispatch } from '../../context/UserInfoContext';
import { credentialRemote } from '../../lib/api';
import { useNavigate, useSearchParams } from '../../lib/Router';

function OAuthRedirect() {
  const searchParams = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useContext(UserInfoDispatch);
  const code = searchParams('code');

  useEffect(() => {
    const isTransitioning = !location.pathname.includes('/auth/OAuth-redirect');
    if (!code || isTransitioning) {
      return;
    }

    (async function () {
      const { data } = await credentialRemote.post('auth/oauth/github', {
        code,
      });

      if (data.isExist) {
        dispatch({
          type: 'USERINFO/SET_USER',
          payload: {
            userId: data.user.id,
            name: data.user.nickname,
            region: data.user.regionName,
            regionId: data.user.regionId,
          },
        });
        navigate('/');

        return;
      }

      navigate('/auth/sign-up', { state: data.user });
    })();
  }, [navigate, dispatch, code]);

  return <div>OAuthRedirect</div>;
}

export default OAuthRedirect;
