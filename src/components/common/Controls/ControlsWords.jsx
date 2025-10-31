import React from 'react';
import { useDispatch } from 'react-redux';
import { showModal } from '../../../features/ui/uiSlice';

const ControlsWords = () => {
    const dispatch = useDispatch();

    const openWordManager = () => {
        // Dispatch with an empty props object to maintain a consistent state shape
        dispatch(showModal({ type: 'WORD_MANAGER', props: {} }));
    };

    return (
        <div className="control-section">
            <h4>Word Lists</h4>
            <button onClick={openWordManager}>Manage Words</button>
        </div>
    );
};

export default ControlsWords;
