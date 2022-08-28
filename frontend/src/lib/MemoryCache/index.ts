import { QueryFn, QueryKey, RefetchArgs } from '../../hooks/useQuery';

const CACHE_EXPIRE = 1000 * 30;

interface QueryCache {
  [queryKey: QueryKey]: {
    updateFn: () => Promise<any>;
    cacheData: any;
    prevRefetchArgs?: string;
  };
}

interface TimerMap {
  [queryKey: QueryKey]: number;
}

class MemoryCache {
  private queryCache: QueryCache;
  private timerMap: TimerMap;
  constructor() {
    this.queryCache = {};
    this.timerMap = {};
  }

  private registerExpire(queryKey: QueryKey, expireTime?: number) {
    if (this.timerMap[queryKey]) {
      clearTimeout(this.timerMap[queryKey]);
    }

    this.timerMap[queryKey] = setTimeout(() => {
      this.removeCacheData(queryKey);
    }, expireTime || CACHE_EXPIRE);
  }

  private isStaleCache(queryKey: QueryKey, refetchArgs?: RefetchArgs) {
    if (!refetchArgs) return false;

    const prevRefetchArgs = this.queryCache[queryKey]?.prevRefetchArgs;

    return prevRefetchArgs !== this.serializeRefetchArgs(refetchArgs);
  }

  private serializeRefetchArgs(refetchArgs?: RefetchArgs) {
    return refetchArgs?.every((arg) => Boolean(arg))
      ? JSON.stringify(refetchArgs)
      : undefined;
  }

  getCacheData(queryKey: QueryKey, refetchArgs?: RefetchArgs) {
    if (this.isStaleCache(queryKey, refetchArgs)) return null;

    return this.queryCache[queryKey]?.cacheData;
  }

  setCacheData<T>(
    queryKey: QueryKey,
    queryFn: QueryFn<T>,
    dataInfo: {
      fetchedData: T;
      refetchArgs?: RefetchArgs;
      expireTime?: number;
    },
  ) {
    const { fetchedData, refetchArgs, expireTime } = dataInfo;

    this.queryCache[queryKey] = {
      updateFn: queryFn,
      cacheData: fetchedData,
      prevRefetchArgs: this.serializeRefetchArgs(refetchArgs),
    };

    this.registerExpire(queryKey, expireTime);
  }

  removeCacheData(queryKey: QueryKey) {
    if (!this.queryCache[queryKey]) return;
    delete this.queryCache[queryKey];
    delete this.timerMap[queryKey];
  }
}

const memoryCache = new MemoryCache();

export default memoryCache;
