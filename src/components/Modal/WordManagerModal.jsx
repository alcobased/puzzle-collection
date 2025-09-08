import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setActiveWordSet,
    addWordSet,
    removeWordSet,
    addWord,
    addWords,
    removeWord,
} from '../../reducers/wordReducer';

const WordManagerModal = () => {
    const dispatch = useDispatch();
    const { wordSet, activeWordSet } = useSelector((state) => state.words);
    const wordSetIds = Object.keys(wordSet);
    const activeWords = wordSet[activeWordSet] || [];

    const [newWord, setNewWord] = useState('');
    const [textAreaValue, setTextAreaValue] = useState('');

    const handleSetActiveWordSet = (e) => {
        dispatch(setActiveWordSet(e.target.value));
    };

    const handleAddWordSet = () => {
        dispatch(addWordSet());
    };

    const handleRemoveWordSet = (wordSetId) => {
        if (window.confirm(`Are you sure you want to delete word set "${wordSetId}"?`)) {
            dispatch(removeWordSet(wordSetId));
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
        dispatch(removeWord({ word: wordToRemove, wordSetId: activeWordSet }));
    };

    return (
        <div>
            <h3>Word Manager</h3>
            {/* Word Set Management */}
            <fieldset style={{ marginBottom: '15px' }}>
                <legend>Word Sets</legend>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Active Set:
                        <select value={activeWordSet || ''} onChange={handleSetActiveWordSet}>
                            {wordSetIds.map(id => (
                                <option key={id} value={id}>{id}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <button onClick={handleAddWordSet} style={{ marginBottom: '10px' }}>Add New Word Set</button>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {wordSetIds.map(id => (
                        <li key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <span>{id} (Words: {wordSet[id].length})</span>
                            <button
                                onClick={() => handleRemoveWordSet(id)}
                                disabled={wordSetIds.length <= 1}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </fieldset>

            {/* Word Management for Active Set */}
            <fieldset>
                <legend>Words in "{activeWordSet}"</legend>
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

export default WordManagerModal;
