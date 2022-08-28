import React from 'react';
import styled from 'styled-components';
import { useModal } from '../hooks/useModal';
import useRegionSearch from '../hooks/useRegionSearch';
import colors from '../styles/colors';
import { RegionType } from '../types/region';
import Modal from './commons/Modal/Modal';
import CustomInput from './CustomInput';

interface RegionSearchContainerProps {
  selectedRegion: RegionType;
  setSelectedRegion: React.Dispatch<React.SetStateAction<RegionType>>;
}

function RegionSearchContainer({
  selectedRegion,
  setSelectedRegion,
}: RegionSearchContainerProps) {
  const { isModalOpen, openModal, closeModal } = useModal();
  const { regions, query, handleSearchRegion, handleSelectRegion } =
    useRegionSearch({ closeModal, setSelectedRegion });

  return (
    <>
      <CustomInput
        placeholder="시∙구 제외, 동만 입력"
        type="text"
        id="region"
        value={selectedRegion.name}
        readOnly
        onClick={openModal}
      />
      <Modal isModalOpen={isModalOpen} closeModal={closeModal}>
        <StyledModalContent>
          <CustomInput
            type="text"
            placeholder="검색할 지역을 입력하세요."
            onChange={handleSearchRegion}
          />
          <ul className="region-list">
            {regions
              ?.filter((item: RegionType) => item.name.includes(query))
              .map((item: RegionType) => (
                <li
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelectRegion(item)}
                  className="region-item"
                  key={item.id}
                >
                  {item.name}
                </li>
              ))}
          </ul>
        </StyledModalContent>
      </Modal>
    </>
  );
}

export default RegionSearchContainer;

const StyledModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  width: 80vw;

  input {
    margin-bottom: 1rem;
  }

  .region-list {
    height: 30vh;
    overflow-y: scroll;

    .region-item {
      padding: 0.5rem 0;
      border-bottom: 1px solid ${colors.gray300};
    }
  }
`;
