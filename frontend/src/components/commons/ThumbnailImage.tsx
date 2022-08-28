import React from 'react';
import { DEFAULT_THUMBNAIL } from '../../constants/defaultThumbnail';

function ThumbnailImage({
  url,
  className,
}: {
  url: string | undefined;
  className?: string;
}) {
  return (
    <img
      className={className}
      src={url || DEFAULT_THUMBNAIL}
      alt="post_images"
    />
  );
}

export default ThumbnailImage;
