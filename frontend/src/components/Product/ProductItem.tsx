import { HeartIcon, MessageSquareIcon } from '../../assets/icons/icons';
import { ProductPreviewType } from '../../types/product';
import { parseDateFromNow, parseNumberToLocaleString } from '../../utils/parse';
import styled, { css } from 'styled-components';
import colors from '../../styles/colors';
import { textMedium, textSmall } from '../../styles/fonts';
import { useContext } from 'react';
import { UserInfoContext } from '../../context/UserInfoContext';
import { Link as ProductDetailLink } from '../../lib/Router';
import useProductLike from '../../hooks/useProductLike';
import useManageDropdown from '../../hooks/useManageDropdown';
import mixin from '../../styles/mixin';
import ThumbnailImage from '../commons/ThumbnailImage';

function ProductItem({
  product,
  isAuthor,
}: {
  product: ProductPreviewType;
  isAuthor: boolean;
}) {
  const {
    id,
    likeCount,
    createdAt,
    name,
    regionName,
    price,
    chatCount,
    isLiked,
    thumbnails,
  } = product;

  const userInfo = useContext(UserInfoContext);
  const { optimisticLikeInfo, handleLikeProduct } = useProductLike(
    { likeCount, isLiked },
    id,
    userInfo.userId,
  );
  const { authorOnlyDropDown } = useManageDropdown(id);

  return (
    <ProductDetailLink to={`/post/${id}`}>
      <StyledProductItem isLiked={optimisticLikeInfo.isLiked}>
        <div>
          <ThumbnailImage url={thumbnails[0]} />
        </div>
        <div className="product-meta">
          <h4 className="product-name">{name}</h4>
          <div className="product-time-region">
            <span>{regionName}</span>
            <span className="delimiter"></span>
            <span>{parseDateFromNow(createdAt)}</span>
          </div>
          <strong className="product-price">
            {parseNumberToLocaleString(price)}
          </strong>
          <div className="product-count-group">
            {chatCount > 0 && (
              <span>
                <MessageSquareIcon /> {chatCount}
              </span>
            )}
            {optimisticLikeInfo.likeCount > 0 && (
              <span>
                <HeartIcon /> {optimisticLikeInfo.likeCount}
              </span>
            )}
          </div>
        </div>

        {isAuthor ? (
          <div className="tool-button">{authorOnlyDropDown}</div>
        ) : (
          <button
            className="tool-button like-button"
            type="button"
            onClick={handleLikeProduct}
          >
            <HeartIcon />
          </button>
        )}
      </StyledProductItem>
    </ProductDetailLink>
  );
}

const StyledProductItem = styled.li<{ isLiked: boolean }>`
  position: relative;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid ${colors.gray300};

  .product-name {
    width: 80%;
    ${textMedium};
    ${mixin.textEllipsis(2)};

    word-break: keep-all;
    font-weight: 500;
  }

  .product-time-region {
    ${textSmall};
    color: ${colors.gray100};
    display: flex;
    align-items: center;

    .delimiter {
      background-color: ${colors.gray100};
      width: 0.2rem;
      height: 0.2rem;
      border-radius: 50%;
      margin: 0 0.25rem;
    }
  }

  .product-price {
    font-weight: 500;
    ${textSmall};
    ${mixin.concatWonUnit};
  }

  .tool-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .like-button {
    ${({ isLiked }) =>
      isLiked
        ? css`
            svg {
              fill: ${colors.pink};
              path {
                stroke: ${colors.pink};
              }
            }
          `
        : css`
            svg {
              fill: transparent;
            }
          `};
  }

  .product-meta {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1 1 100%;
  }

  .product-count-group {
    align-self: flex-end;
    display: flex;
    gap: 1rem;
    span {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }
  }

  img {
    width: 106px;
    height: 106px;
    border: 1px solid ${colors.gray300};
    border-radius: 10px;
  }
`;

export default ProductItem;
