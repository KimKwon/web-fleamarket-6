import { useContext, useState } from 'react';
import { UserInfoContext } from '../context/UserInfoContext';
import { remote } from '../lib/api';
import { useSearchParams } from '../lib/Router';
import { ProductPreviewType } from '../types/product';

function useGetProducts() {
  const [products, setProducts] = useState<ProductPreviewType[]>([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const [page, setPage] = useState(1);
  const { userId } = useContext(UserInfoContext);
  const searchParams = useSearchParams();
  const categoryId = searchParams('categoryId');

  const getProducts = async () => {
    setPage((prev) => prev + 1);
    const userQueryString = userId ? `userId=${userId}&` : '';
    const categoryQueryString = categoryId ? `categoryId=${categoryId}&` : '';
    const pageQueryString = `page=${page}`;
    const { data } = await remote.get(
      '/product?' + categoryQueryString + userQueryString + pageQueryString,
    );
    const lastPage = Math.ceil(data.totalCount / 10);
    console.log(
      lastPage,
      data.totalCount,
      `/product?${categoryQueryString}${userQueryString}${pageQueryString}`,
    );
    setProducts((prev) => [...prev, ...data.data]);
    setIsLastPage(lastPage === page);
  };

  return { products, isLastPage, getProducts };
}

export default useGetProducts;
