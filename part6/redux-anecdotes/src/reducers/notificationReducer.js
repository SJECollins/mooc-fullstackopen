import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload.notification;
    },
    resetNotification(state) {
      return initialState;
    },
  },
});

export const { setNotification, resetNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

export const updateNotification = (notification, time) => {
  return async (dispatch) => {
    dispatch(setNotification({ notification }));
    setTimeout(() => {
      dispatch(resetNotification());
    }, time * 1000);
  };
};
