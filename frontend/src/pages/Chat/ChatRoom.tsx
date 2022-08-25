import { FormEvent, useState } from 'react';
import styled from 'styled-components';
import { SendIcon } from '../../assets/icons/icons';
import ChatList from '../../components/Chat/ChatList';
import Loading from '../../components/commons/Loading';
import CustomInput from '../../components/CustomInput';
import PageHeader from '../../components/PageHeader/PageHeader';
import useQuery from '../../hooks/useQuery';
import useSocket from '../../hooks/useSocket';
import { remote } from '../../lib/api';
import { usePathParams } from '../../lib/Router';
import colors from '../../styles/colors';
import { textSmall } from '../../styles/fonts';
import { ChatRoomInfo } from '../../types/chat';

function Chat() {
  const [message, setMessage] = useState('');
  const { chatId } = usePathParams();
  const { data: chatRoomInfo } = useQuery<ChatRoomInfo>(
    ['chat', chatId],
    async () => {
      const result = await remote(`/chat/${chatId}`);

      console.log(result);
      return result.data;
    },
  );

  const { isLoading, sendMessage, receivedData } = useSocket(chatRoomInfo);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!chatRoomInfo?.roomInfo.buyerId) return;

    sendMessage({
      message,
      senderId: chatRoomInfo.roomInfo.buyerId,
    });

    setMessage('');
  };

  return (
    <StyledWrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <PageHeader pageName="상대유저" />
          <StyledProductInfo>
            <img
              className="post-image"
              src={chatRoomInfo?.roomInfo.thumbnails[0]}
              alt="post_images"
            />
            <div className="product-info">
              <div>{chatRoomInfo?.roomInfo.name}</div>
              <div className="product-price">
                {chatRoomInfo?.roomInfo.price}원
              </div>
            </div>
            <div>
              {
                <div className="sale-status">
                  {chatRoomInfo?.roomInfo.isSold ? '판매완료' : '판매중'}
                </div>
              }
            </div>
          </StyledProductInfo>
          <ChatList>
            {receivedData.map((chatRoomInfo) => (
              <li key={chatRoomInfo.message + chatRoomInfo.createdAt}>
                {chatRoomInfo.message}
              </li>
            ))}
          </ChatList>
          <StyledChatForm onSubmit={handleSubmit}>
            <CustomInput
              type="text"
              placeholder="메시지를 입력하세요."
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">
              <SendIcon />
            </button>
          </StyledChatForm>
        </>
      )}
    </StyledWrapper>
  );
}

export default Chat;

const StyledWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledProductInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 0.5rem;
  border-bottom: 1px solid ${colors.gray200};

  .post-image {
    display: block;
    width: 100px;
  }

  .product-info {
    flex: 1;
  }

  .product-price {
    color: ${colors.gray100};
  }

  .sale-status {
    width: fit-content;
    padding: 0.625rem 1rem;
    border: 1px solid ${colors.gray300};
    border-radius: 8px;
    ${textSmall};
  }
`;

const StyledChatForm = styled.form`
  display: flex;
  padding: 0.5rem;
  padding-right: 1rem;
  gap: 1rem;
  background-color: ${colors.offWhite};
  border-top: 1px solid ${colors.gray200};

  input {
    flex: 1;
  }

  button[type='submit'] {
    display: flex;
    align-items: center;

    svg path {
      stroke: ${colors.gray100};
    }
  }
`;
