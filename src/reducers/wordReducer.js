import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const defaultWordSetId = `words-${uuidv4().substring(0, 8)}`;

const wordSlice = createSlice({
  name: "words",
  initialState: {
    // A collection of word lists
    wordSet: {
      [defaultWordSetId]: ["HELLO", "WORLD"],
    },
    // The ID of the currently active word list
    activeWordSet: defaultWordSetId,
  },
  reducers: {
    // Reducer to create a new, empty word set
    addWordSet(state) {
      const newWordSetId = `words-${uuidv4().substring(0, 8)}`;
      state.wordSet[newWordSetId] = [];
    },
    // Reducer to remove a word set
    removeWordSet(state, action) {
      const idToRemove = action.payload;
      if (Object.keys(state.wordSet).length <= 1) {
        console.warn("Cannot remove the last word set.");
        return;
      }
      delete state.wordSet[idToRemove];
      // If the active set was deleted, assign a new active set
      if (state.activeWordSet === idToRemove) {
        state.activeWordSet = Object.keys(state.wordSet)[0];
      }
    },
    // Reducer to set the active word set
    setActiveWordSet(state, action) {
      if (state.wordSet[action.payload]) {
        state.activeWordSet = action.payload;
      }
    },
    // Reducer to add a word to the active set
    addWord(state, action) {
      const { word } = action.payload;
      if (state.activeWordSet && state.wordSet[state.activeWordSet]) {
        const upperWord = word.toUpperCase().trim();
        if (upperWord && !state.wordSet[state.activeWordSet].includes(upperWord)) {
          state.wordSet[state.activeWordSet].push(upperWord);
        }
      }
    },
    // Reducer to add multiple words to the active set
    addWords(state, action) {
        const { words } = action.payload; // expecting an array of strings
        if (state.activeWordSet && state.wordSet[state.activeWordSet]) {
            const targetSet = state.wordSet[state.activeWordSet];
            // Process new words: uppercase, trim, filter empties, and ensure uniqueness
            const uniqueNewWords = new Set(words.map(w => w.toUpperCase().trim()).filter(Boolean));

            // Add only the words that are not already in the list
            uniqueNewWords.forEach(word => {
                if (!targetSet.includes(word)) {
                    targetSet.push(word);
                }
            });
        }
    },
    // Reducer to remove a word from a specific set
    removeWord(state, action) {
      const { word, wordSetId } = action.payload;
      const targetWordSet = state.wordSet[wordSetId || state.activeWordSet];
      if (targetWordSet) {
        const index = targetWordSet.findIndex((w) => w === word);
        if (index !== -1) {
          targetWordSet.splice(index, 1);
        }
      }
    },
    // Reducer to replace all words in the active set
    setWords(state, action) {
      const { words } = action.payload;
      if (state.activeWordSet && state.wordSet[state.activeWordSet]) {
        state.wordSet[state.activeWordSet] = words;
      }
    },
    // Reducer to replace the entire collection of word sets
    setWordSet(state, action) {
      state.wordSet = action.payload;
    },
  },
});

export const {
  addWordSet,
  removeWordSet,
  setActiveWordSet,
  addWord,
  addWords,
  removeWord,
  setWords,
  setWordSet,
} = wordSlice.actions;

export default wordSlice.reducer;
