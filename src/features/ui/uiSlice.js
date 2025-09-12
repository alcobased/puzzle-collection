import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isModalOpen: false,
    modalType: null, // This will determine which modal content to show
    notification: null,
  },
  reducers: {
    openModal(state, action) {
      state.isModalOpen = true;
      state.modalType = action.payload.modalType;
    },
    closeModal(state) {
      state.isModalOpen = false;
      state.modalType = null;
      // We also clear activeCell when any modal closes to avoid confusion
    },
    setNotification(state, action) {
      state.notification = action.payload;
    },
    clearNotification(state) {
      state.notification = null;
    }
  },
});

export const { openModal, closeModal, setNotification, clearNotification } = uiSlice.actions;
export default uiSlice.reducer;
