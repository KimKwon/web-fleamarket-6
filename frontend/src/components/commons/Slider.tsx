import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Arrow } from '../../assets/icons/icons';
import { useSlide } from '../../hooks/useSlide';
import colors from '../../styles/colors';
import ThumbnailImage from './ThumbnailImage';

interface SliderType {
  children: React.ReactNode | React.ReactNode[];
}

function Slider({ children }: SliderType) {
  const totalSlideLength = React.Children.count(children);

  const slideLimit = totalSlideLength - 1;
  const [currentSlide, nextSlide, prevSlide] = useSlide(slideLimit);
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!ulRef.current) return;

    ulRef.current.style.width = `${totalSlideLength}00%`;
    ulRef.current.style.transform = `translateX(-${
      (100 / totalSlideLength) * currentSlide
    }%)`;
  }, [ulRef, currentSlide, totalSlideLength]);

  if (!children) {
    return <></>;
  }

  return (
    <OuterContainer>
      <Container totalSlideLength={totalSlideLength}>
        <ul className="slider" ref={ulRef}>
          {totalSlideLength ? (
            children
          ) : (
            <li>
              <ThumbnailImage url={''} />
            </li>
          )}
        </ul>
      </Container>
      {totalSlideLength > 1 && (
        <>
          <button className="arrow prev" onClick={prevSlide}>
            <Arrow />
          </button>
          <button className="arrow next" onClick={nextSlide}>
            <Arrow />
          </button>
        </>
      )}
    </OuterContainer>
  );
}

export default Slider;

export const OuterContainer = styled.div`
  position: relative;

  .arrow {
    width: 2rem;
    height: 2rem;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    svg path {
      stroke: ${colors.black};
    }
  }

  .arrow.prev {
    left: 1rem;
  }

  .arrow.next {
    svg {
      transform: rotate(-180deg);
    }

    right: 1rem;
  }
`;

export const Container = styled.div<{ totalSlideLength: number }>`
  overflow: hidden;
  position: relative;

  .slider {
    display: grid;
    grid-template-columns: repeat(
      ${({ totalSlideLength }) => totalSlideLength},
      1fr
    );
    transition: transform 0.5s ease-in-out;

    img {
      margin: 0 auto;
      height: 40vh;
      width: 100vw;
      display: block;
      object-fit: contain;
    }
  }
`;
