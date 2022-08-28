import styled, { css, keyframes } from 'styled-components';
import { PropsWithChildren } from 'react';
import useTransitionHelper, { RouteInfo } from './useTransitionHelper';
import useHistoryStack from './useHistoryStack';

function Transition({ children }: PropsWithChildren): JSX.Element {
  const { isAnimationReady, currentRoute, nextRoute, handleAnimationEnd } =
    useTransitionHelper({
      currentChildren: children,
    });
  const { shouldMoveToBack } = useHistoryStack();

  const renderRouteElement = (route: RouteInfo) => {
    return route?.element ?? null;
  };

  return (
    <StyledAnimatingBox
      shouldMoveToBack={shouldMoveToBack}
      isAnimating={isAnimationReady}
      onAnimationEnd={handleAnimationEnd}
    >
      {isAnimationReady && shouldMoveToBack && (
        <Wrapper>{renderRouteElement(nextRoute)}</Wrapper>
      )}
      <Wrapper key={currentRoute.locationInfo?.pathname}>
        {renderRouteElement(currentRoute)}
      </Wrapper>
      {isAnimationReady && <Wrapper>{renderRouteElement(nextRoute)}</Wrapper>}
    </StyledAnimatingBox>
  );
}

const Wrapper = styled.div`
  flex-shrink: 0;
  width: 100%;
  height: 100%;
`;

const routeKeyframes = {
  right: keyframes`
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  `,
  left: keyframes`
  0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0);
    }`,
};

const StyledAnimatingBox = styled.div<{
  shouldMoveToBack: boolean;
  isAnimating?: boolean;
}>`
  ${({ isAnimating, shouldMoveToBack }) =>
    isAnimating &&
    css`
      display: flex;
      animation: ${shouldMoveToBack
          ? routeKeyframes.left
          : routeKeyframes.right}
        ease-in-out 0.5s forwards;
    `};
`;

export default Transition;
