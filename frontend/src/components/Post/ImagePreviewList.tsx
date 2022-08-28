import styled from 'styled-components';
import { CloseIcon } from '../../assets/icons/icons';
import colors from '../../styles/colors';

interface ImagePreviewListProps {
  thumbnails: string[];
  handleDeleteThumbnail: (url: string) => void;
}

function ImagePreviewList({
  thumbnails,
  handleDeleteThumbnail,
}: ImagePreviewListProps) {
  return (
    <StyledImagePreviewList>
      {thumbnails.map((url) => (
        <li className="image-preview-item" key={url}>
          <img className="post-image" src={url} alt="post_images" />
          <button
            className="image-preview-delete-btn"
            type="button"
            onClick={() => handleDeleteThumbnail(url)}
          >
            <CloseIcon />
          </button>
        </li>
      ))}
    </StyledImagePreviewList>
  );
}

export default ImagePreviewList;

const StyledImagePreviewList = styled.ul`
  display: flex;

  .image-preview-item {
    position: relative;

    .image-preview-delete-btn {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: -0.5rem;
      right: 0.5rem;
      border-radius: 50%;
      background-color: ${colors.black};

      svg path {
        stroke: ${colors.white};
      }
    }
  }
`;
