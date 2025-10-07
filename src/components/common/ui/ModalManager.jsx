import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';

const modalComponents = {
  CELL_PROPERTIES: lazy(() => import('../../puzzles/pathfinder/CellPropertiesModal')),
  QUEUE_MANAGER: lazy(() => import('../../puzzles/pathfinder/QueueManagerModal')),
  WORD_MANAGER: lazy(() => import('../../puzzles/words/WordManagerModal')),
};

const ModalManager = () => {
  const { modalType, modalProps } = useSelector((state) => state.ui);

  if (!modalType) {
    return null;
  }

  const SpecificModal = modalComponents[modalType];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {SpecificModal ? <SpecificModal {...modalProps} /> : null}
    </Suspense>
  );
};

export default ModalManager;
