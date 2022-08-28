import { useContext } from 'react';
import { UserInfoContext } from '../context/UserInfoContext';
import { remote } from '../lib/api';
import { useSearchParams } from '../lib/Router';
import { ChatRoom } from '../types/chatRoom';
import useQuery from './useQuery';

function useChatRooms() {
  const userInfo = useContext(UserInfoContext);
  const searchParams = useSearchParams();
  const userId = searchParams('userId');
  const productId = searchParams('productId');

  const { data: chatRooms } = useQuery(
    ['chatroom', userId, productId],
    async () => {
      if (!userInfo.userId) return [];

      const userQueryString = userId
        ? `userId=${userId}&`
        : `userId=${userInfo.userId}&`;
      const productQueryString = productId ? `productId=${productId}&` : '';

      const { data: chatRooms } = await remote.get<ChatRoom[]>(
        'chat?' + userQueryString + productQueryString,
      );

      return chatRooms;
    },
  );

  return { chatRooms };
}

export default useChatRooms;
