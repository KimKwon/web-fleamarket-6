import { useContext, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { HeartIcon } from '../../assets/icons/icons';
import PageHeader from '../../components/PageHeader/PageHeader';
import ImageSlider from '../../components/Post/ImageSlider';
import { UserInfoContext } from '../../context/UserInfoContext';
import useManageDropdown from '../../hooks/useManageDropdown';
import useProductLike from '../../hooks/useProductLike';
import useQuery from '../../hooks/useQuery';
import useToast from '../../hooks/useToast';
import { remote } from '../../lib/api';
import { useNavigate, usePathParams } from '../../lib/Router';
import colors from '../../styles/colors';
import {
  textLarge,
  textMedium,
  textSmall,
  textXSmall,
} from '../../styles/fonts';
import mixin from '../../styles/mixin';
import { ProductDetail } from '../../types/product';
import { parseDateFromNow } from '../../utils/parse';

function PostDetail() {
  const navigate = useNavigate();
  const { warn } = useToast();
  const { userId } = useContext(UserInfoContext);
  const { productId } = usePathParams();
  const { authorOnlyDropDown } = useManageDropdown(Number(productId));
  const { data: postDetail, errorCode } = useQuery<ProductDetail>(
    ['postDetail' + productId, productId],
    async () => {
      const { data } = await remote(`/product/${productId}`);

      return data;
    },
    { skip: !productId },
  );

  const { optimisticLikeInfo, handleLikeProduct } = useProductLike(
    { isLiked: Boolean(postDetail?.isLiked), likeCount: 0 },
    productId ? +productId : 0,
    userId,
  );

  useEffect(() => {
    if (!postDetail && (errorCode === 404 || errorCode === 400))
      navigate('/404', { replace: true });
  }, [postDetail, errorCode, navigate]);

  if (!postDetail) {
    return <PageHeader pageName="상품 상세" />;
  }

  const {
    name,
    price,
    isSold,
    authorId,
    authorName,
    description,
    createdAt,
    categoryName,
    viewCount,
    chatCount,
    likeCount,
    regionName,
    thumbnails,
  } = postDetail;

  const isAuthorOfProduct = userId === authorId;
  const chatLinkText = isAuthorOfProduct
    ? `채팅 목록 보기 ${chatCount > 0 ? `(${chatCount})` : ''}`
    : '문의하기';

  const handleRequestChat = async () => {
    if (!userId) {
      warn('로그인이 필요해요');
      return;
    }

    if (isAuthorOfProduct) {
      navigate(`/my?tab=1&userId=${userId}&productId=${productId}`);
      return;
    }

    const { data: existRoom } = await remote(
      `chat/check?userId=${userId}&productId=${productId}`,
    );

    if (existRoom) {
      navigate(`/chat/${existRoom.roomId}`);

      return;
    }

    const {
      data: { roomId },
    } = await remote.post(`chat`, {
      buyerId: userId,
      sellerId: authorId,
      productId,
    });

    navigate(`/chat/${roomId}`);
  };

  return (
    <>
      <PageHeader
        pageName="상품 상세보기"
        extraButton={isAuthorOfProduct && authorOnlyDropDown}
      />
      <ImageSlider>
        {thumbnails.map((item) => (
          <li key={item}>
            <img src={item} alt="product_images" />
          </li>
        ))}
      </ImageSlider>
      <StyledPostDetail>
        <div className="sale-status">{isSold ? '판매완료' : '판매중'}</div>
        <h1>{name}</h1>
        <BoxWithDelimiter>
          <span>{categoryName}</span>
          <i className="delimiter" />
          <span>{parseDateFromNow(createdAt)}</span>
        </BoxWithDelimiter>
        <p>{description}</p>
        <BoxWithDelimiter>
          <span>관심 {likeCount}</span>
          <i className="delimiter" />
          <span>조회 {viewCount}</span>
        </BoxWithDelimiter>
        <SellerInfo>
          <span>판매자 정보</span>
          <span className="product-author">{authorName}</span>
          <span className="product-region">{regionName}</span>
        </SellerInfo>
      </StyledPostDetail>
      <PostFooter isLiked={optimisticLikeInfo.isLiked}>
        <div>
          <button type="button" onClick={handleLikeProduct}>
            <HeartIcon />
          </button>
          <span className="delimiter-vertical" />
          <span className="product-price">{price.toLocaleString()}</span>
        </div>
        <button type="button" onClick={handleRequestChat}>
          {chatLinkText}
        </button>
      </PostFooter>
    </>
  );
}

const StyledPostDetail = styled.main`
  display: flex;
  flex-direction: column;

  padding: 1.5rem 1rem;

  & > h1 {
    ${textLarge};
    ${mixin.textEllipsis(1)}
    margin: 1rem 0 0.5rem 0;
  }
  & > p {
    ${textMedium};
    margin: 1rem 0 1.5rem 0;
  }

  .sale-status {
    width: fit-content;
    padding: 0.625rem 1rem;
    border: 1px solid ${colors.gray300};
    border-radius: 8px;
    ${textSmall};
  }
`;

const BoxWithDelimiter = styled.div`
  display: flex;
  align-items: center;

  & > span {
    ${textXSmall};
    color: ${colors.gray100};
  }
  & > .delimiter {
    background-color: ${colors.gray100};
    width: 0.2rem;
    height: 0.2rem;
    border-radius: 50%;
    margin: 0 0.25rem;
  }
`;

const SellerInfo = styled.div`
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
  background-color: ${colors.offWhite};

  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;

  & > span:first-child {
    margin-right: auto;
  }

  & > span {
    ${textSmall};
    font-weight: 500;
  }

  & > span.product-region {
    ${textXSmall};
    color: ${colors.gray100};
  }
`;

const PostFooter = styled.footer<{ isLiked: boolean }>`
  position: sticky;
  bottom: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1rem;
  border: 1px solid ${colors.gray200};
  border-left-width: 0;
  border-right-width: 0;

  ${mixin.shadow.normal};

  background-color: white;

  svg {
    ${({ isLiked }) =>
      isLiked &&
      css`
        fill: ${colors.pink};
        & path {
          stroke: ${colors.pink};
        }
      `};
  }

  & > div {
    display: flex;
    align-items: center;

    .delimiter-vertical {
      width: 1px;
      height: 2rem;
      background-color: ${colors.gray200};
      margin: 0 1rem;
    }

    .product-price {
      ${textSmall};
      ${mixin.concatWonUnit};
    }
  }

  & .chat-link {
    ${textSmall};
    padding: 0.625rem 1.5rem;
    background-color: ${colors.primary};
    color: ${colors.white};
    border-radius: 8px;
  }
`;

export default PostDetail;
