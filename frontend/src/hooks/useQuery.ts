import axios from 'axios';
import { useEffect, useState } from 'react';
import memoryCache from '../lib/MemoryCache';

export type QueryKey = string;
export type QueryFn<T> = () => Promise<T>;
export type RefetchArgs = any[];

/**
 * queryKeyWithArgs: 캐시 데이터의 unique key와 refetchArgs를 담고 있는 튜플.
 * -> refetchArgs: queryFn에 사용되는 파라미터가 변경되었을 때 refetch 하기 위한 도구.
 * queryFn: 데이터 패칭용 함수 -> 추후에 refetchOnFocus 기능 구현 시 사용 예정
 * expireTime: 캐시의 만료기한을 명시적으로 지정하고 싶을 때 주는 옵션
 */

function useQuery<T>(
  queryKeyWithArgs: [QueryKey, ...RefetchArgs],
  queryFn: QueryFn<T>,
  queryOptions?: {
    expireTime?: number;
    skip?: boolean;
  },
) {
  const [queryKey, ...refetchArgs] = queryKeyWithArgs;
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState(0);

  useEffect(() => {
    async function fetchFromRemote() {
      try {
        setIsLoading(true);

        const result = await queryFn();

        memoryCache.setCacheData(queryKey, queryFn, {
          fetchedData: result,
          refetchArgs,
          expireTime: queryOptions?.expireTime,
        });

        setData(result);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          setErrorCode(e.response?.status ?? 0);
        }
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }

    if (queryOptions?.skip) return;

    const cacheData = memoryCache.getCacheData(queryKey, refetchArgs);
    if (!cacheData) {
      fetchFromRemote();
      return;
    }

    setData(cacheData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, ...refetchArgs, queryOptions?.skip]);

  return { data, isLoading, errorCode };
}

export default useQuery;
