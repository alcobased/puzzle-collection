import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './LetterTracker.css';
import { ALPHABETS, toggleDisabledLetter } from '../../../features/codewords/codewordsSlice';

const LetterTracker = () => {
    const dispatch = useDispatch();
    const { mappings, alphabetType, mode, disabledLetters } = useSelector(state => state.puzzles.codewords);
    const letters = ALPHABETS[alphabetType] || ALPHABETS.EN;

    // Create reverse mapping: Letter -> Array of Numbers
    // (In case multiple numbers are mapped to same letter, though usually 1:1)
    const letterToNumbers = {};
    Object.entries(mappings).forEach(([num, letter]) => {
        if (letter) {
            if (!letterToNumbers[letter]) {
                letterToNumbers[letter] = [];
            }
            letterToNumbers[letter].push(num);
        }
    });

    const handleLetterClick = (letter) => {
        if (mode === 'setup') {
            dispatch(toggleDisabledLetter(letter));
        }
    };

    // Calculate how many rows we need to split alphabets into 2-3 columns
    return (
        <div className={`letter-tracker ${mode === 'setup' ? 'setup-mode' : ''}`}>
            <div className="letter-tracker-header">
                <h3>Alphabet ({alphabetType})</h3>
            </div>
            <div className="letter-grid">
                {letters.map(letter => {
                    const mappedNumbers = letterToNumbers[letter] || [];
                    const isUsed = mappedNumbers.length > 0;
                    const isDisabled = disabledLetters.includes(letter);

                    return (
                        <div
                            key={letter}
                            className={`letter-tile ${isUsed ? 'used' : 'unused'} ${isDisabled ? 'disabled' : ''}`}
                            onClick={() => handleLetterClick(letter)}
                            title={mode === 'setup' ? 'Toggle letter availability' : (isUsed ? `Mapped to: ${mappedNumbers.join(', ')}` : 'Not used')}
                        >
                            <span className="char">{letter}</span>
                            {isUsed && (
                                <div className="usage-badges">
                                    {mappedNumbers.map(num => (
                                        <span key={num} className="num-badge">{num}</span>
                                    ))}
                                </div>
                            )}
                            {isDisabled && <span className="disabled-icon">×</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LetterTracker;
