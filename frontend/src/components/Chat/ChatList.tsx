import { forwardRef } from 'react';
import styled from 'styled-components';

type Props = { children: React.ReactNode };

const ChatList = forwardRef<HTMLOListElement, Props>((props, ref) => (
  <StyledChatList ref={ref}>{props.children}</StyledChatList>
));

ChatList.displayName = 'ChatList';

export default ChatList;

const StyledChatList = styled.ol`
  padding: 1rem;
  flex: 1 1 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;
