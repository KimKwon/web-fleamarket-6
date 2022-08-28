import React from 'react';
import Slider from '../commons/Slider';

function ImageSlider({ children }: { children: React.ReactNode[] }) {
  return <Slider>{children}</Slider>;
}

export default ImageSlider;
