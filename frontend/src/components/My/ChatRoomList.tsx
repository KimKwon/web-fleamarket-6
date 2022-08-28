import styled from 'styled-components';
import useChatRooms from '../../hooks/useChatRooms';
import { useNavigate } from '../../lib/Router';
import { StyledGuideMessage } from '../../pages/My';
import colors from '../../styles/colors';
import { textSmall } from '../../styles/fonts';
import ThumbnailImage from '../commons/ThumbnailImage';

function ChatRoomList() {
  const { chatRooms } = useChatRooms();
  const navigate = useNavigate();
  const isNotEmpty = chatRooms?.length;

  const openChatRoom = (roomId: number) => {
    navigate(`/chat/${roomId}`);
  };

  return isNotEmpty ? (
    <ul>
      {chatRooms?.map((item) => (
        <StyledChatList key={item.id} onClick={() => openChatRoom(item.id)}>
          <div className="your-info">
            <div className="your-name">{item.buyerName || item.sellerName}</div>
            <div className="last-message">{item.lastChatMessage}</div>
          </div>
          <ThumbnailImage
            className="product-thumbnail"
            url={item.thumbnails[0]}
          />
        </StyledChatList>
      ))}
    </ul>
  ) : (
    <StyledGuideMessage>채팅 기록이 없습니다.</StyledGuideMessage>
  );
}

export default ChatRoomList;

const StyledChatList = styled.li`
  padding: 1rem;
  border-bottom: 1px solid ${colors.gray300};
  display: flex;

  .your-info {
    flex: 1;
  }

  .last-message {
    ${textSmall}
    color: ${colors.gray100};
  }

  .product-thumbnail {
    width: 3rem;
    height: 3rem;
    border: 1px solid ${colors.gray300};
    border-radius: 6px;
  }
`;
