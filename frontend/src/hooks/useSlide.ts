import { useState } from 'react';

export const useSlide = (
  totalSlideLength: number,
): [number, () => void, () => void] => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    currentSlide >= totalSlideLength
      ? setCurrentSlide(0)
      : setCurrentSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    currentSlide <= 0
      ? setCurrentSlide(totalSlideLength)
      : setCurrentSlide(currentSlide - 1);
  };

  return [currentSlide, nextSlide, prevSlide];
};
