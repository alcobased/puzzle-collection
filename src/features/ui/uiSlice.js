import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    modal: null, // This will determine which modal content to show, null means no modal (closed)
    notification: null,
  },
  reducers: {
    setModal(state, action) {
      state.modal = action.payload;
    },
    clearModal(state) {
      state.modal = null;
    },
    setNotification(state, action) {
      state.notification = action.payload;
    },
    clearNotification(state) {
      state.notification = null;
    }
  },
});

export const { setModal, clearModal, setNotification, clearNotification } = uiSlice.actions;
export default uiSlice.reducer;
