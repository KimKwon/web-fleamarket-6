import styled, { css } from 'styled-components';
import colors from '../../styles/colors';
import { MessageType } from '../../types/chat';
import { parseDateFromNow } from '../../utils/parse';

interface ChatMessageProps {
  chatMessage: MessageType;
  isMine: boolean;
}

function ChatMessage({ chatMessage, isMine }: ChatMessageProps) {
  return (
    <StyledChatMessageContainer isMine={isMine}>
      {isMine && (
        <span className="time-diff">
          {parseDateFromNow(chatMessage.createdAt)}
        </span>
      )}
      <span className="chat-message">{chatMessage.message}</span>
      {!isMine && (
        <span className="time-diff">
          {parseDateFromNow(chatMessage.createdAt)}
        </span>
      )}
    </StyledChatMessageContainer>
  );
}

export default ChatMessage;

const StyledChatMessageContainer = styled.li<{ isMine: boolean }>`
  margin-bottom: 1rem;
  padding: 0.5rem;

  .time-diff {
    font-size: 0.7rem;
    color: ${colors.gray100};
    margin: 0 0.25rem;
  }

  ${({ isMine }) =>
    isMine
      ? css`
          align-self: end;
        `
      : css`
          align-self: start;
        `}

  .chat-message {
    padding: 0.5rem;

    ${({ isMine }) =>
      isMine
        ? css`
            align-self: end;
            color: ${colors.white};
            background-color: ${colors.primary};
            border: none;
            border-radius: 8px 0px 8px 8px;
          `
        : css`
            align-self: start;
            color: ${colors.black};
            background-color: ${colors.white};
            border: 1px solid ${colors.primary};
            border-radius: 0px 8px 8px 8px;
          `}
  }
`;
