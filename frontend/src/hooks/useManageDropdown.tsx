import styled from 'styled-components';
import { MoreVerticalIcon } from '../assets/icons/icons';
import DropDown from '../components/commons/Dropdown';
import Modal from '../components/commons/Modal/Modal';
import { remote } from '../lib/api';
import memoryCache from '../lib/MemoryCache';
import { useNavigate } from '../lib/Router';
import colors from '../styles/colors';
import { textMedium } from '../styles/fonts';
import { useModal } from './useModal';

function useManageDropdown(productId: number) {
  const navigate = useNavigate();
  const { isModalOpen, closeModal, openModal } = useModal();

  const handleDelete = async () => {
    try {
      await remote.delete(`/product/${productId}`);
      memoryCache.removeCacheData('products');
    } catch (error) {
      console.error(error);
    }
    navigate('/');
  };

  const handleModify = () => {
    navigate(`/post/manage?productId=${productId}`);
  };

  const handleCancle = (event: React.MouseEvent) => {
    event.stopPropagation();
    closeModal();
  };

  const productManageOptions = [
    {
      content: {
        text: '수정하기',
      },
      onClick: handleModify,
    },
    {
      content: {
        text: '삭제하기',
        style: { color: colors.red },
      },
      onClick: openModal,
    },
  ];

  const deleteConfirmModal = (
    <Modal isModalOpen={isModalOpen} closeModal={closeModal}>
      <DeleteConfirmBox>
        <strong>정말 삭제하시겠어요?</strong>
        <div>
          <CancelButton onClick={handleCancle}>취소하기</CancelButton>
          <DeleteButton onClick={handleDelete}>삭제하기</DeleteButton>
        </div>
      </DeleteConfirmBox>
    </Modal>
  );

  const authorOnlyDropDown = (
    <>
      <DropDown
        initialDisplay={<MoreVerticalIcon />}
        dropDownElements={productManageOptions}
      />
      {deleteConfirmModal}
    </>
  );

  return { authorOnlyDropDown };
}

const DeleteConfirmBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  width: 80vw;
  padding: 1rem;

  & > strong {
    all: unset;
    ${textMedium};
    font-weight: 500;
  }

  & > div {
    display: flex;
    gap: 1rem;
  }
`;

const BaseButton = styled.button`
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 8px;

  flex: 1;
`;

const DeleteButton = styled(BaseButton)`
  background-color: ${colors.red};
`;

const CancelButton = styled(BaseButton)`
  background-color: ${colors.gray200};
`;

export default useManageDropdown;
