import React, { useState } from 'react';
import { remote } from '../lib/api';
import { RegionType } from '../types/region';
import debounce from '../utils/debounce';
import useQuery from './useQuery';

interface useRegionSearchType {
  closeModal: () => void;
  setSelectedRegion: React.Dispatch<React.SetStateAction<RegionType>>;
}

function useRegionSearch({
  closeModal,
  setSelectedRegion,
}: useRegionSearchType) {
  const { data: regions } = useQuery(['region'], async () => {
    const result = await remote('/region');
    return result.data;
  });
  const [query, setQuery] = useState('');

  const handleSelectRegion = (item: RegionType) => {
    setSelectedRegion(item);
    closeModal();
  };

  const handleSearchRegion = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setQuery(event.target.value),
    300,
  );

  return {
    regions,
    query,
    handleSearchRegion,
    handleSelectRegion,
  };
}

export default useRegionSearch;
