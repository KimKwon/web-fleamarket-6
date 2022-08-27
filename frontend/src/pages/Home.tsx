import { useRef } from 'react';
import Loading from '../components/commons/Loading';
import HomeNavbar from '../components/HomeNavbar/HomeNavbar';
import PostAddButton from '../components/Post/PostAddButton';
import ProductItem from '../components/Product/ProductItem';
import useGetProducts from '../hooks/useGetProducts';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import useToast from '../hooks/useToast';
import { useHistoryState } from '../lib/Router/hooks';

function Home() {
  const loader = useRef<HTMLDivElement>(null);
  const { products, isLastPage, getProducts } = useGetProducts();
  useInfiniteScroll({ loader, asyncCallback: getProducts });
  const categoryIconURL = useHistoryState();
  const { notice } = useToast();

  return (
    <main>
      <HomeNavbar currentCategoryIcon={categoryIconURL} />
      <button onClick={() => notice('아이 반가워')}>토스트 띄우기</button>
      <ul>
        {products?.map((product) => (
          <ProductItem key={product.id} product={product} isAuthor={false} />
        ))}
      </ul>
      {!isLastPage && <Loading ref={loader} />}
      <PostAddButton />
    </main>
  );
}

export default Home;
