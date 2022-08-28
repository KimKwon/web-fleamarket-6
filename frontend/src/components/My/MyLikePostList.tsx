import React, { useRef } from 'react';
import useGetProducts from '../../hooks/useGetProducts';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { StyledGuideMessage } from '../../pages/My';
import Loading from '../commons/Loading';
import ProductItem from '../Product/ProductItem';

function MyLikePostList() {
  const loader = useRef<HTMLDivElement>(null);
  const { products, isLastPage, getProductsByUserLike } = useGetProducts();
  const { isLoading } = useInfiniteScroll({
    loader,
    asyncCallback: getProductsByUserLike,
  });

  const isEmpty = !Boolean(products.length) && isLastPage && !isLoading;

  return (
    <>
      {isEmpty ? (
        <StyledGuideMessage>등록된 상품이 없습니다.</StyledGuideMessage>
      ) : (
        <ul>
          {products.map((item) => (
            <ProductItem isAuthor={false} key={item.id} product={item} />
          ))}
        </ul>
      )}
      {!isLastPage && <Loading ref={loader} />}
    </>
  );
}

export default MyLikePostList;
