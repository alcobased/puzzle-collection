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

const ModalWords = () => {
    const dispatch = useDispatch();
    const { lists, activeList } = useSelector((state) => state.words);
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
        <div>
            {/* Word List Management */}
            <fieldset style={{ marginBottom: '15px' }}>
                <legend>Word Lists</legend>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Active List:
                        <select value={activeList || ''} onChange={handleSetActiveList}>
                            {listIds.map(id => (
                                <option key={id} value={id}>{id}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <button onClick={handleAddList} style={{ marginBottom: '10px' }}>Add New Word List</button>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {listIds.map(id => (
                        <li key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <span>{id} (Words: {lists[id].length})</span>
                            <button
                                onClick={() => handleRemoveList(id)}
                                disabled={listIds.length <= 1}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </fieldset>

            {/* Word Management for Active List */}
            <fieldset>
                <legend>Words in "{activeList}"</legend>
                <form onSubmit={handleAddWord} style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={newWord}
                        onChange={(e) => setNewWord(e.target.value.toUpperCase())}
                        placeholder="Add one word"
                    />
                    <button type="submit">Add Word</button>
                </form>
                <div style={{ marginBottom: '10px' }}>
                    <textarea
                        value={textAreaValue}
                        onChange={(e) => setTextAreaValue(e.target.value)}
                        placeholder="Or paste a list of words (separated by space, comma, or new line)"
                        style={{ width: '95%', minHeight: '80px', margin: '5px 0' }}
                    />
                    <button onClick={handleAddFromTextArea}>Add From List</button>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, maxHeight: '150px', overflowY: 'auto' }}>
                    {activeWords.map((word, index) => (
                        <li key={`${word}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <span>{word}</span>
                            <button onClick={() => handleRemoveWord(word)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </fieldset>
        </div>
    );
};

export default ModalWords;
