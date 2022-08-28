import { useCallback, useContext, useState } from 'react';
import { UserInfoContext } from '../context/UserInfoContext';
import { remote } from '../lib/api';
import { useSearchParams } from '../lib/Router';
import { ProductPreviewType } from '../types/product';

interface dataType {
  totalCount: number;
  data: ProductPreviewType[];
}

function useGetProducts() {
  const [products, setProducts] = useState<ProductPreviewType[]>([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const [page, setPage] = useState(1);
  const { userId } = useContext(UserInfoContext);
  const searchParams = useSearchParams();
  const categoryId = searchParams('categoryId');

  const incrementPage = useCallback(
    (data: dataType) => {
      const lastPage = Math.ceil(data.totalCount / 10);
      setPage((prev) => prev + 1);
      setIsLastPage(lastPage === 0 || lastPage === page);
    },
    [page],
  );

  const getProducts = useCallback(async () => {
    const userQueryString = userId ? `userId=${userId}&` : '';
    const categoryQueryString = categoryId ? `categoryId=${categoryId}&` : '';
    const pageQueryString = `page=${page}`;
    const { data } = await remote.get(
      '/product?' + categoryQueryString + userQueryString + pageQueryString,
    );

    setProducts((prev) => [...prev, ...data.data]);
    incrementPage(data);
  }, [categoryId, incrementPage, page, userId]);

  const getProductsByUserId = useCallback(async () => {
    const userQueryString = userId ? `userId=${userId}&` : '';
    const filterQueryString = `filter=sale&`;
    const pageQueryString = `page=${page}`;

    if (!userId) {
      return;
    }

    const { data } = await remote.get(
      '/product?' + userQueryString + filterQueryString + pageQueryString,
    );

    setProducts((prev) => [...prev, ...data.data]);
    incrementPage(data);
  }, [userId, incrementPage, page]);

  const getProductsByUserLike = useCallback(async () => {
    const userQueryString = userId ? `userId=${userId}&` : '';
    const filterQueryString = `filter=like&`;
    const pageQueryString = `page=${page}`;

    if (!userId) {
      return;
    }

    const { data } = await remote.get(
      '/product?' + userQueryString + filterQueryString + pageQueryString,
    );

    setProducts((prev) => [...prev, ...data.data]);
    incrementPage(data);
  }, [userId, incrementPage, page]);

  return {
    products,
    isLastPage,
    getProducts,
    getProductsByUserId,
    getProductsByUserLike,
  };
}

export default useGetProducts;
