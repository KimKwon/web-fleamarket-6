import React from 'react';
import styled from 'styled-components';
import { AddIcon } from '../../assets/icons/icons';
import { useNavigate } from '../../lib/Router';
import colors from '../../styles/colors';

function PostAddButton() {
  const navigate = useNavigate();

  return (
    <StyledButton onClick={() => navigate('/post/manage')}>
      <AddIcon />
    </StyledButton>
  );
}

export default PostAddButton;

const StyledButton = styled.button`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background-color: ${colors.primary};
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;

  svg path {
    stroke: ${colors.white};
  }
`;
