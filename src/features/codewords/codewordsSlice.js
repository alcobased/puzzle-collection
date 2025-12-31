import { createSlice } from '@reduxjs/toolkit';
import { AppConfig } from '../../config';

const initialState = {
    mode: 'setup', // 'setup' or 'solve'
    boardMode: 'grid', // 'grid' or 'image'
    alphabetType: 'EN', // 'EN' or 'LT'
    grid: { width: AppConfig.codewordsDefaults.width, height: AppConfig.codewordsDefaults.height },
    cells: {},
    mappings: {},
    solution: {},
    selectedCell: null,
    errors: [],
    disabledLetters: [], // Array of letters that are disabled
    cellSize: AppConfig.codewordsDefaults.cellSize,
};

const ALPHABETS = {
    EN: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    LT: 'AĄBCČDEĘĖFGHIĮYJKLMNOPRSŠTUŲŪVZŽ'.split('')
};

const codewordsSlice = createSlice({
    name: 'codewords',
    initialState,
    reducers: {
        setMode: (state, action) => {
            state.mode = action.payload;
        },
        toggleDisabledLetter: (state, action) => {
            const letter = action.payload;
            if (state.disabledLetters.includes(letter)) {
                state.disabledLetters = state.disabledLetters.filter(l => l !== letter);
            } else {
                state.disabledLetters.push(letter);
                // Also clear any existing mappings for this letter if it's being disabled
                Object.keys(state.mappings).forEach(num => {
                    if (state.mappings[num] === letter) {
                        delete state.mappings[num];
                    }
                });
            }
        },
        setAlphabetType: (state, action) => {
            state.alphabetType = action.payload;
        },
        setCodewordsState: (state, action) => {
            return { ...state, ...action.payload };
        },
        /**
         * Initializes the codeword grid from a 2D array.
         * @param {Object} action.payload - Contains grid data.
         * @param {number[][]} action.payload.grid - 2D array where 0 is a black cell, 
         * and any other number is a white cell with that codeword number.
         * @param {Object} [action.payload.mappings] - Optional mapping of numbers to letters.
         */
        initializeGrid: (state, action) => {
            const gridData = action.payload.grid;
            state.mappings = action.payload.mappings || {};
            state.cells = {};

            console.log(gridData);

            state.grid.height = gridData.length;
            state.grid.width = gridData[0].length;

            for (let y = 0; y < state.grid.height; y++) {
                for (let x = 0; x < state.grid.width; x++) {
                    const id = `${x},${y}`;
                    const val = gridData[y][x];
                    state.cells[id] = {
                        id,
                        x,
                        y,
                        number: val || 1,
                        isBlack: val === 0
                    };
                }
            }
            console.log(state.cells);
        },
        setBoardSize: (state, action) => {
            const { width, height } = action.payload;
            state.grid.width = width;
            state.grid.height = height;

            // Ensure all cells in range are initialized
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const id = `${x},${y}`;
                    if (!state.cells[id]) {
                        state.cells[id] = { id, x, y, number: 1, isBlack: false };
                    }
                }
            }
        },
        toggleCell: (state, action) => {
            const { id } = action.payload;
            if (state.cells[id]) {
                if (state.selectedCell === id) {
                    state.selectedCell = null;
                } else {
                    state.cells[id].isBlack = !state.cells[id].isBlack;
                    // If we toggled to white, ensure it has a valid number
                    if (!state.cells[id].isBlack && !state.cells[id].number) {
                        state.cells[id].number = 1;
                    }
                    state.selectedCell = id;
                }
            }
        },
        setCellNumber: (state, action) => {
            const { id, number } = action.payload;
            if (state.cells[id]) {
                state.cells[id].number = number;
                state.cells[id].isBlack = false;
            }
        },
        setBoardMode: (state, action) => {
            state.boardMode = action.payload;
        },
        selectCell: (state, action) => {
            state.selectedCell = state.selectedCell === action.payload ? null : action.payload;
        },
        setMapping: (state, action) => {
            const { number, letter } = action.payload;
            state.mappings[number] = letter;
        },
        clearMapping: (state, action) => {
            const { number } = action.payload;
            delete state.mappings[number];
        },
        setCellSize: (state, action) => {
            state.cellSize = action.payload;
        }
    },
});

export const {
    setMode,
    setAlphabetType,
    setCodewordsState,
    toggleDisabledLetter,
    initializeGrid,
    setBoardSize,
    toggleCell,
    setCellNumber,
    setBoardMode,
    selectCell,
    setMapping,
    clearMapping,
    setCellSize
} = codewordsSlice.actions;

export { ALPHABETS };
export default codewordsSlice.reducer;
