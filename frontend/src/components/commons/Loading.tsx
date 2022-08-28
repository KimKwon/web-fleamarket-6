import React, { forwardRef } from 'react';
import styled from 'styled-components';
import colors from '../../styles/colors';
import { spinAnimation } from '../../styles/keyframes';

const Loading = forwardRef<HTMLDivElement>((_props, ref) => {
  return <LoadingSpinner ref={ref} />;
});

Loading.displayName = 'loading';

export default Loading;

export const LoadingSpinner = styled.div`
  padding: 1rem;
  width: 2rem;
  height: 2rem;
  margin: 0.75rem auto;
  border-radius: 50%;
  border: 0.25rem solid ${colors.gray300};
  border-top-color: ${colors.primary};
  animation: ${spinAnimation} 0.8s linear infinite;
`;
