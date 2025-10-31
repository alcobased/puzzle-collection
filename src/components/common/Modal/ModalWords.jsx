import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setActiveList,
    addList,
    removeList,
    addWord,
    addWords,
    removeWord,
} from '../../../features/words/wordsSlice.js';
import './ModalWords.css'; // Keep for specific styles

const ModalWords = () => {
    const dispatch = useDispatch();
    const { lists, activeList } = useSelector(state => state.words);

    const listIds = Object.keys(lists);
    const activeWords = lists[activeList] || [];

    const [newWord, setNewWord] = useState('');
    const [textAreaValue, setTextAreaValue] = useState('');

    const handleSetActiveList = (e) => {
        dispatch(setActiveList(e.target.value));
    };

    const handleAddList = () => {
        dispatch(addList());
    };

    const handleRemoveList = (listId) => {
        if (window.confirm(`Are you sure you want to delete word list "${listId}"?`)) {
            dispatch(removeList(listId));
        }
    };

    const handleAddWord = (e) => {
        e.preventDefault();
        if (newWord.trim()) {
            dispatch(addWord({ word: newWord.trim() }));
            setNewWord('');
        }
    };

    const handleAddFromTextArea = () => {
        if (textAreaValue.trim()) {
            const words = textAreaValue.split(/[,\s\n]+/).filter(Boolean);
            dispatch(addWords({ words }));
            setTextAreaValue('');
        }
    };

    const handleRemoveWord = (wordToRemove) => {
        dispatch(removeWord({ word: wordToRemove, listId: activeList }));
    };

    return (
        <>
            <div className="modal-section">
                <h3>Manage Word Lists</h3>
                <div className="list-controls">
                    <select className="modal-select" onChange={handleSetActiveList} value={activeList}>
                        {listIds.map((id) => (
                            <option key={id} value={id}>
                                {id}
                            </option>
                        ))}
                    </select>
                    <button className="modal-button" onClick={handleAddList}>New List</button>
                    {listIds.length > 1 && (
                        <button className="modal-button" onClick={() => handleRemoveList(activeList)}>Remove Current List</button>
                    )}
                </div>
            </div>

            <div className="modal-section">
                <h3>Words in "{activeList}"</h3>
                <form onSubmit={handleAddWord} className="modal-form-row">
                    <input
                        type="text"
                        className="modal-input"
                        value={newWord}
                        onChange={(e) => setNewWord(e.target.value)}
                        placeholder="Add a new word"
                    />
                    <button type="submit" className="modal-button">Add</button>
                </form>

                <ul className="modal-list">
                    {activeWords.map((word) => (
                        <li key={word} className="modal-list-item">
                            {word}
                            <button className="modal-list-remove-btn" onClick={() => handleRemoveWord(word)}>&times;</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="modal-section">
                <h3>Add Multiple Words</h3>
                <textarea
                    className="modal-textarea"
                    value={textAreaValue}
                    onChange={(e) => setTextAreaValue(e.target.value)}
                    placeholder="Add words separated by commas, spaces, or new lines."
                    rows="4"
                ></textarea>
                <button className="modal-button" onClick={handleAddFromTextArea}>Add Words</button>
            </div>
        </>
    );
};

export default ModalWords;
