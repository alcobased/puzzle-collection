import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const defaultListId = `list-${uuidv4().substring(0, 8)}`;

const wordSlice = createSlice({
  name: "words",
  initialState: {
    lists: {
      [defaultListId]: ["HELLO", "WORLD"],
    },
    activeList: defaultListId,
  },
  reducers: {
    addList(state) {
      const newListId = `list-${uuidv4().substring(0, 8)}`;
      state.lists[newListId] = [];
    },
    removeList(state, action) {
      const idToRemove = action.payload;
      if (Object.keys(state.lists).length <= 1) {
        console.warn("Cannot remove the last word list.");
        return;
      }
      delete state.lists[idToRemove];
      if (state.activeList === idToRemove) {
        state.activeList = Object.keys(state.lists)[0];
      }
    },
    setActiveList(state, action) {
      if (state.lists[action.payload]) {
        state.activeList = action.payload;
      }
    },
    addWord(state, action) {
      const { word } = action.payload;
      if (state.activeList && state.lists[state.activeList]) {
        const upperWord = word.toUpperCase().trim();
        if (upperWord && !state.lists[state.activeList].includes(upperWord)) {
          state.lists[state.activeList].push(upperWord);
        }
      }
    },
    addWords(state, action) {
        const { words } = action.payload;
        if (state.activeList && state.lists[state.activeList]) {
            const targetList = state.lists[state.activeList];
            const uniqueNewWords = new Set(words.map(w => w.toUpperCase().trim()).filter(Boolean));
            uniqueNewWords.forEach(word => {
                if (!targetList.includes(word)) {
                    targetList.push(word);
                }
            });
        }
    },
    removeWord(state, action) {
      const { word, listId } = action.payload;
      const targetList = state.lists[listId || state.activeList];
      if (targetList) {
        const index = targetList.findIndex((w) => w === word);
        if (index !== -1) {
          targetList.splice(index, 1);
        }
      }
    },
    setWords(state, action) {
      const { words } = action.payload;
      if (state.activeList && state.lists[state.activeList]) {
        state.lists[state.activeList] = words;
      }
    },
    setWordsState(state, action) {
      const { lists, activeList } = action.payload;
      if (lists && activeList && lists[activeList]) {
        state.lists = lists;
        state.activeList = activeList;
      }
    },
  },
});

export const {
  addList,
  removeList,
  setActiveList,
  addWord,
  addWords,
  removeWord,
  setWords,
  setWordsState,
} = wordSlice.actions;

export default wordSlice.reducer;
