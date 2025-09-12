import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../features/ui/uiSlice.js';

const ControlsWords = () => {
  const dispatch = useDispatch();
  const { activeList, lists } = useSelector(state => state.words);
  const activeWords = lists[activeList] || [];

  const handleManageWords = () => {
    dispatch(openModal({ modalType: 'WORD_MANAGER' }));
  };

  return (
    <fieldset>
      <legend>Words</legend>
      <div>Active List: <strong>{activeList}</strong></div>
      <div>Word Count: {activeWords.length}</div>
      <button onClick={handleManageWords}>Manage Words</button>
    </fieldset>
  );
};

export default ControlsWords;
