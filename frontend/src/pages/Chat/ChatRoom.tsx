import { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { LogoutIcon, SendIcon } from '../../assets/icons/icons';
import ChatList from '../../components/Chat/ChatList';
import ChatMessage from '../../components/Chat/ChatMessage';
import Loading from '../../components/commons/Loading';
import Modal from '../../components/commons/Modal/Modal';
import ThumbnailImage from '../../components/commons/ThumbnailImage';
import CustomInput from '../../components/CustomInput';
import PageHeader from '../../components/PageHeader/PageHeader';
import { UserInfoContext } from '../../context/UserInfoContext';
import { useModal } from '../../hooks/useModal';
import useSocket from '../../hooks/useSocket';
import { remote } from '../../lib/api';
import { useNavigate, usePathParams } from '../../lib/Router';
import colors from '../../styles/colors';
import { textMedium, textSmall } from '../../styles/fonts';
import { ChatRoomInfo } from '../../types/chat';

function Chat() {
  const [message, setMessage] = useState('');
  const { chatId } = usePathParams();
  const [chatRoomInfo, setChatRoomInfo] = useState<ChatRoomInfo>();
  const userInfo = useContext(UserInfoContext);
  const [partner, setPartner] = useState<string>('partner');
  const chatListRef = useRef<HTMLOListElement>(null);
  const { isModalOpen, openModal, closeModal } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      if (!chatId) {
        return;
      }

      const result = await remote(`/chat/${chatId}`);

      if (!result.data.roomInfo) {
        navigate('/');
      }

      const { buyerId, sellerId } = result.data.roomInfo;
      const partnerId = buyerId === userInfo.userId ? sellerId : buyerId;
      const partner = await remote(`/auth/${partnerId}`);

      setPartner(partner.data.nickname);
      setChatRoomInfo(result.data);
    })();
  }, [chatId, userInfo, navigate]);

  const { isLoading, sendMessage, receivedData } = useSocket(chatRoomInfo);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!message) return;
    if (!chatRoomInfo?.roomInfo.buyerId) return;

    sendMessage({
      message,
      senderId: userInfo.userId,
    });

    setMessage('');
  };

  const handleExitChatRoom = async () => {
    await remote.delete(`/chat/${chatId}`);
    navigate('/my');
  };

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [receivedData]);

  return (
    <StyledWrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Modal isModalOpen={isModalOpen} closeModal={closeModal}>
            <DeleteConfirmBox>
              <strong>정말 나가시겠어요?</strong>
              <div>
                <CancelButton onClick={closeModal}>취소하기</CancelButton>
                <DeleteButton onClick={handleExitChatRoom}>나가기</DeleteButton>
              </div>
            </DeleteConfirmBox>
          </Modal>
          <PageHeader
            pageName={partner}
            extraButton={
              <button onClick={openModal}>
                <LogoutIcon />
              </button>
            }
          />
          <StyledProductInfo>
            <ThumbnailImage
              url={chatRoomInfo?.roomInfo.thumbnails[0]}
              className="post-image"
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
          <ChatList ref={chatListRef}>
            {receivedData.map((chatMessage) => (
              <ChatMessage
                key={chatMessage.id}
                chatMessage={chatMessage}
                isMine={chatMessage.senderId === userInfo.userId}
              />
            ))}
          </ChatList>
          <StyledChatForm onSubmit={handleSubmit}>
            <CustomInput
              type="text"
              placeholder="메시지를 입력하세요."
              value={message}
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
  width: 100%;
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

const DeleteConfirmBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  width: 80vw;
  padding: 1rem;

  & > strong {
    all: unset;
    ${textMedium};
    font-weight: 500;
  }

  & > div {
    display: flex;
    gap: 1rem;
  }
`;

const BaseButton = styled.button`
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 8px;

  flex: 1;
`;

const DeleteButton = styled(BaseButton)`
  background-color: ${colors.red};
`;

const CancelButton = styled(BaseButton)`
  background-color: ${colors.gray200};
`;
