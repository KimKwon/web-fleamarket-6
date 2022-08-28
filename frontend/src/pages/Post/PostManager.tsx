import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { CheckIcon, ImageIcon, MapPinIcon } from '../../assets/icons/icons';
import withCheckLogin from '../../components/HOC/withCheckLogin';
import PageHeader from '../../components/PageHeader/PageHeader';
import ImagePreviewList from '../../components/Post/ImagePreviewList';
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
} from '../../constants/limit';
import { UserInfoContext } from '../../context/UserInfoContext';
import useQuery from '../../hooks/useQuery';
import useToast from '../../hooks/useToast';
import { remote } from '../../lib/api';
import memoryCache from '../../lib/MemoryCache';
import { useNavigate, useSearchParams } from '../../lib/Router';
import colors from '../../styles/colors';
import { textSmall, textMedium } from '../../styles/fonts';
import { CategoryType } from '../../types/category';
import { ProductDetail } from '../../types/product';
import { parseLocaleStringToNumber } from '../../utils/parse';

interface ProductInputsType {
  title: string;
  description: string;
  selectedCategory: number;
  price: number;
  thumbnails: string[];
}

function PostManager() {
  const userInfo = useContext(UserInfoContext);
  const searchParams = useSearchParams();
  const productId = searchParams('productId');
  const navigate = useNavigate();
  const { warn, notice, error } = useToast();

  const { data: categories } = useQuery<CategoryType[]>(
    ['category'],
    async () => {
      const result = await remote('/category');
      return result.data;
    },
  );

  const { data: prevProductDetail, errorCode: prevProductDetailErrorCode } =
    useQuery<ProductDetail>(
      ['postDetail' + productId, productId],
      async () => {
        const { data } = await remote(`/product/${productId}`);
        return data;
      },
      { skip: !productId },
    );

  const [productInputs, setProductInputs] = useState<ProductInputsType>({
    title: '',
    description: '',
    selectedCategory: 0,
    price: 0,
    thumbnails: [],
  });

  const { title, price, description, selectedCategory, thumbnails } =
    productInputs;

  const isFormSubmitable =
    title.trim() !== '' &&
    description.trim() !== '' &&
    selectedCategory > 0 &&
    price > 0;

  const isEditMode = prevProductDetail !== undefined;

  const handleChange = <T extends keyof ProductInputsType>(
    inputName: T,
    value: ProductInputsType[T],
  ) => {
    setProductInputs((prev) => ({
      ...prev,
      [inputName]: value,
    }));
  };

  const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) {
      return;
    }

    if (files.length + productInputs.thumbnails.length > 10) {
      warn('사진을 10개 넘게 올릴 수 없습니다.');
      return;
    }

    const formData = new FormData();
    [...files].forEach((file) => formData.append('thumbnails', file));

    const res = await remote.post('product/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    handleChange('thumbnails', [...thumbnails, ...res.data]);
  };

  const handleSubmitPost = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    if (!isFormSubmitable) {
      warn('모든 필수 값이 입력되어야 합니다.');
      return;
    }

    const post = {
      name: title,
      price,
      description,
      thumbnails: JSON.stringify(thumbnails),
      categoryId: selectedCategory,
      authorId: userInfo.userId,
    };

    const submitMethod = isEditMode ? remote.patch : remote.post;
    const submitUrl = isEditMode
      ? `/product/${prevProductDetail.id}`
      : '/product/write';

    try {
      const response = await submitMethod(submitUrl, post);

      const productId = prevProductDetail?.id || response?.data?.productId;
      const returnUrl = isEditMode ? -1 : `/post/${productId}`;

      memoryCache.removeCacheData('postDetail' + productId);
      notice(isEditMode ? '수정되었어요.' : '업로드되었어요.');

      navigate(returnUrl, {
        replace: true,
      });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 422) {
          error('상품을 수정해주세요.');
          return;
        }

        error('문제가 생겼어요. 다시 시도해주세요.');
      }
    }
  };

  const handleDeleteThumbnail = (url: string) => {
    setProductInputs((prev) => ({
      ...prev,
      thumbnails: prev.thumbnails.filter((thumbnail) => thumbnail !== url),
    }));
  };

  useEffect(() => {
    const fallback = () => {
      const fallbackUrl = prevProductDetail
        ? `/post/${prevProductDetail.id}`
        : '/';
      navigate(fallbackUrl, { replace: true });
    };

    if (prevProductDetailErrorCode === 404) {
      fallback();
      return;
    }

    if (!prevProductDetail) {
      return;
    }

    if (prevProductDetail.authorId !== userInfo.userId) {
      fallback();
      return;
    }

    const { name, description, categoryId, thumbnails, price } =
      prevProductDetail;

    setProductInputs({
      title: name,
      description,
      selectedCategory: categoryId,
      thumbnails,
      price,
    });
  }, [prevProductDetail, prevProductDetailErrorCode, userInfo, navigate]);

  return (
    <StyledWrapper>
      <PageHeader
        pageName={isEditMode ? '수정하기' : '글쓰기'}
        extraButton={
          <SubmitButton
            type="submit"
            onClick={handleSubmitPost}
            isSubmitable={isFormSubmitable}
          >
            <CheckIcon />
          </SubmitButton>
        }
      />
      <StyledPostForm>
        <div className="image-section">
          <label htmlFor="post_image" className="image-upload">
            <ImageIcon />
            <span>{`${thumbnails?.length}/10`}</span>
          </label>
          <input
            id="post_image"
            type="file"
            onChange={onFileUpload}
            accept="image/*"
            multiple
          />
          <ImagePreviewList
            thumbnails={thumbnails}
            handleDeleteThumbnail={handleDeleteThumbnail}
          />
        </div>
        <div className="content-section">
          <div className="post-meta">
            <input
              className="post-title"
              type="text"
              placeholder="글 제목"
              value={title}
              maxLength={MAX_TITLE_LENGTH}
              onChange={({ target: { value } }) => handleChange('title', value)}
            />
            <div className="category-guide">
              (필수) 카테고리를 선택해주세요.
            </div>
            <ul className="categories">
              {categories?.map(({ id, name }) => (
                <li
                  className={`category-item ${
                    selectedCategory === id && 'selected'
                  }`}
                  key={id}
                  onClick={() => handleChange('selectedCategory', id)}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
          <div className="post-price">
            <span>₩</span>
            <input
              className="post-input"
              type="text"
              placeholder="가격(선택사항)"
              value={price.toLocaleString()}
              onChange={({ target: { value } }) =>
                handleChange('price', parseLocaleStringToNumber(value))
              }
            />
          </div>
          <textarea
            name="description"
            id="description"
            className="description"
            placeholder="게시글 내용을 작성해주세요"
            value={description}
            maxLength={MAX_DESCRIPTION_LENGTH}
            onChange={({ target: { value } }) =>
              handleChange('description', value)
            }
          />
        </div>
      </StyledPostForm>
      <footer>
        <MapPinIcon />
        <span className="region-name">{userInfo.region}</span>
      </footer>
    </StyledWrapper>
  );
}

export default withCheckLogin(PostManager);

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  footer {
    display: flex;
    align-items: center;
    border-top: 1px solid ${colors.gray300};
    padding: 0.5rem 1rem;

    .region-name {
      margin-left: 0.25rem;
    }
  }
`;

const StyledPostForm = styled.form`
  flex: 1 1 100%;
  display: flex;
  flex-direction: column;
  padding: 0 1rem 1.5rem 1rem;

  input[type='file'] {
    display: none;
  }

  .image-section {
    width: 100%;
    padding: 1.5rem 0;
    overflow-y: scroll;
    display: flex;

    .image-upload {
      flex-shrink: 0;
      width: 5.25rem;
      height: 5.25rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: ${colors.offWhite};
      border: 1px solid ${colors.gray300};
      border-radius: 8px;
      margin-right: 1rem;
    }

    .post-image {
      width: 5.25rem;
      height: 5.25rem;
      border: 1px solid ${colors.gray300};
      border-radius: 8px;
      margin-right: 1rem;
    }
  }

  .content-section {
    flex: 1 1 100%;
    display: flex;
    flex-direction: column;

    & > input {
      padding: 1.5rem 0;
    }

    .description {
      all: unset;
      padding: 1.5rem 0;
      flex: 1 1 100%;
    }
  }

  .post-meta {
    border-top: 1px solid ${colors.gray300};
    border-bottom: 1px solid ${colors.gray300};
    padding: 1.5rem 0;
    .post-title {
      width: 100%;
      padding-bottom: 1rem;
      ${textMedium}
    }

    .category-guide {
      margin-bottom: 0.5rem;
      ${textSmall}
      color: ${colors.gray100};
    }

    .categories {
      display: flex;
      overflow-y: scroll;
    }

    .category-item {
      flex: 1 0 auto;
      padding: 0.25rem 1rem;
      border: 1px solid ${colors.gray300};
      color: ${colors.gray100};
      border-radius: 999px;
      margin-right: 0.25rem;
    }

    .category-item.selected {
      background-color: ${colors.primary};
      color: ${colors.white};
    }
  }

  .post-price {
    padding: 1.5rem 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${colors.gray300};

    .post-input {
      margin-left: 0.25rem;
      ${textMedium}
      width: 100%;
    }
  }
`;

const SubmitButton = styled.button<{ isSubmitable: boolean }>`
  & > svg > path {
    stroke: ${({ isSubmitable }) => isSubmitable && colors.mint};
  }
`;
