import { useContext, useEffect } from 'react';
import { UserInfoDispatch } from '../context/UserInfoContext';
import { credentialRemote } from '../lib/api';

function useToken() {
  const dispatch = useContext(UserInfoDispatch);

  useEffect(() => {
    (async function () {
      dispatch({
        type: 'USERINFO/SET_AUTHORIZING',
        payload: {
          isAuthorizing: true,
        },
      });
      const { data } = await credentialRemote('auth');
      dispatch({
        type: 'USERINFO/SET_AUTHORIZING',
        payload: {
          isAuthorizing: false,
        },
      });

      if (!data) {
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
    })();
  }, [dispatch]);
}

export default useToken;
