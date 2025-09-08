import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../reducers/uiReducer';

const ControlsWords = () => {
  const dispatch = useDispatch();
  const { activeWordSet, wordSet } = useSelector(state => state.words);
  const activeWords = wordSet[activeWordSet] || [];

  const handleManageWords = () => {
    dispatch(openModal({ modalType: 'WORD_MANAGER' }));
  };

  return (
    <fieldset>
      <legend>Words</legend>
      <div>Active Set: <strong>{activeWordSet}</strong></div>
      <div>Word Count: {activeWords.length}</div>
      <button onClick={handleManageWords}>Manage Words</button>
    </fieldset>
  );
};

export default ControlsWords;
