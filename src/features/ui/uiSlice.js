import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isControlsVisible: true,
  notification: {
    message: null,
    type: 'info', // info, success, warning, error
  },
  modal: {
    type: null,
    props: {}
  }
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleControls: (state) => {
      state.isControlsVisible = !state.isControlsVisible;
    },
    setNotification: (state, action) => {
      state.notification = { ...state.notification, ...action.payload };
    },
    clearNotification: (state) => {
      state.notification.message = null;
    },
    showModal: (state, action) => {
        state.modal.type = action.payload.type;
        state.modal.props = action.payload.props;
    },
    hideModal: (state) => {
        state.modal.type = null;
        state.modal.props = {};
    }
  },
});

export const { toggleControls, setNotification, clearNotification, showModal, hideModal } = uiSlice.actions;

export default uiSlice.reducer;
