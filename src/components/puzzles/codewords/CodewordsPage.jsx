import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { initializeGrid, setMapping, clearMapping, setCellNumber, ALPHABETS } from '../../../features/codewords/codewordsSlice';
import CodewordsBoard from './CodewordsBoard';
import './Codewords.css';
import ControlPanel from '../../common/Controls/ControlPanel';
import PuzzleBoard from '../../common/PuzzleBoard/PuzzleBoard';
import ControlsCodewordsMode from './ControlsCodewordsMode';
import ControlsCodewordsBoard from './ControlsCodewordsBoard';
import ControlSection from '../../common/Controls/ControlSection';
import LetterTracker from './LetterTracker';
import ControlsStorage from '../../common/Controls/ControlsStorage';

const CodewordsPage = () => {
    const dispatch = useDispatch();
    const { mode, cells, selectedCell, alphabetType, disabledLetters } = useSelector(state => state.puzzles.codewords);
    const currentAlphabet = ALPHABETS[alphabetType] || ALPHABETS.EN;

    // Track partial numeric input for setup mode
    const [numInput, setNumInput] = React.useState("");

    useEffect(() => {
        // Temporary test grid initialization
        // 0 = black, 1-26 = numbers
        const testGrid = [
            [1, 2, 3, 0, 4, 5, 6, 7],
            [8, 0, 9, 0, 10, 0, 11, 0],
            [1, 12, 1, 13, 1, 14, 1, 0],
            [0, 0, 15, 0, 0, 0, 16, 0],
            [17, 18, 19, 20, 21, 22, 23, 24]
        ];

        dispatch(initializeGrid({
            grid: testGrid,
            mappings: { 1: 'A', 2: 'B' } // Test initial mappings
        }));
    }, [dispatch]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedCell) return;
            const cell = cells[selectedCell];
            if (!cell) return;

            if (mode === 'solve') {
                if (cell.isBlack) return;
                const number = cell.number;

                const key = e.key.toUpperCase();
                if (currentAlphabet.includes(key) && !disabledLetters.includes(key)) {
                    dispatch(setMapping({ number, letter: key }));
                } else if (e.key === 'Backspace' || e.key === 'Delete') {
                    dispatch(clearMapping({ number }));
                }
            } else if (mode === 'setup') {
                if (e.key >= '0' && e.key <= '9') {
                    // Update number. Reset if we type after a delay? 
                    // Let's just append then apply
                    const val = numInput + e.key;
                    const num = parseInt(val, 10);
                    if (num <= 26) {
                        setNumInput(val);
                        dispatch(setCellNumber({ id: selectedCell, number: num }));
                    } else {
                        // Reset if over 26
                        setNumInput(e.key);
                        dispatch(setCellNumber({ id: selectedCell, number: parseInt(e.key, 10) }));
                    }
                } else if (e.key === 'Backspace' || e.key === 'Delete') {
                    setNumInput("");
                    dispatch(setCellNumber({ id: selectedCell, number: 1 }));
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dispatch, selectedCell, cells, mode, numInput]);

    // Clear numInput when selection changes
    useEffect(() => {
        setNumInput("");
    }, [selectedCell]);

    return (
        <>
            <PuzzleBoard>
                <CodewordsBoard />
                <LetterTracker />
            </PuzzleBoard>
            <ControlPanel>
                <ControlsCodewordsMode />
                <ControlsCodewordsBoard />
                <ControlsStorage puzzleName="codewords" />
                <ControlSection title="Instructions">
                    <div className="instructions">
                        {mode === 'setup' ? (
                            <>
                                <p><strong>Setup Mode:</strong></p>
                                <p>Click a cell to toggle between Black and Numbered.</p>
                                <p>With a cell selected, type 1-26 to set its number.</p>
                            </>
                        ) : (
                            <>
                                <p><strong>Solve Mode:</strong></p>
                                <p>Click a cell to select it.</p>
                                <p>Type A-Z to assign a letter to that number.</p>
                            </>
                        )}
                        <p>Backspace/Delete to clear.</p>
                    </div>
                </ControlSection>
            </ControlPanel>
        </>
    );
};

export default CodewordsPage;
