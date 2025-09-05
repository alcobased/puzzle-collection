import { createSlice } from "@reduxjs/toolkit";

const cellSlice = createSlice({
    name: "cells",
    initialState: [],
    reducers: {
        setCells(state, action) {
            return action.payload;
        },
        addCell(state, action) {
            state.push(action.payload);
        },
        removeCell(state, action) {
            return state.filter((cell) => cell.id !== action.payload)
        }
    }
})

export const { setCells, addCell, removeCell } = cellSlice.actions;
export default cellSlice.reducer;