import { useState } from 'react';

type eventType =
  | React.MouseEvent<HTMLElement, MouseEvent>
  | React.FormEvent<HTMLFormElement>;

export function useModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (event?: eventType) => {
    if (event) {
      event.stopPropagation();
    }

    setIsModalOpen(() => true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return { isModalOpen, openModal, closeModal };
}
