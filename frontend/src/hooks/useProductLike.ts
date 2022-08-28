import { MouseEvent, useEffect, useRef, useState } from 'react';
import { remote } from '../lib/api';
import memoryCache from '../lib/MemoryCache';
import debounce from '../utils/debounce';

interface LikeInfo {
  likeCount: number;
  isLiked: boolean;
}

function useProductLike(
  initialLikeInfo: LikeInfo,
  productId: number,
  userId: number,
) {
  const [optimisticLikeInfo, setOptimisticLikeInfo] =
    useState<LikeInfo>(initialLikeInfo);

  const debouncedLikeHandler = useRef(
    debounce(async (currentIsLiked: boolean) => {
      try {
        await remote.post(`/product/${productId}/like`, {
          userId,
          isLiked: !currentIsLiked,
        });
        memoryCache.removeCacheData('products');
      } catch (e) {
        alert('좋아요 누르기에 실패했어요.');
        console.error(e);
      }
    }, 500),
  );

  const togglLikeInfo = () => {
    setOptimisticLikeInfo((prevData) => ({
      isLiked: !prevData.isLiked,
      likeCount: prevData.likeCount + (prevData.isLiked ? -1 : 1),
    }));
  };

  const handleLikeProduct = (e: MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      alert('로그인이 필요해요');
      return;
    }

    const likeOrDislikeProduct = debouncedLikeHandler.current;

    togglLikeInfo();
    likeOrDislikeProduct(optimisticLikeInfo.isLiked);
  };

  useEffect(() => {
    setOptimisticLikeInfo({
      likeCount: initialLikeInfo.likeCount,
      isLiked: initialLikeInfo.isLiked,
    });
  }, [initialLikeInfo.likeCount, initialLikeInfo.isLiked]);

  return { optimisticLikeInfo, handleLikeProduct };
}

export default useProductLike;
