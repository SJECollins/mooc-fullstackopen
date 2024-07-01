import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilter(state, action) {
      return action.payload.filter;
    },
  },
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;

// const filterReducer = (state = "", action) => {
//   switch (action.type) {
//     case "SET_FILTER":
//       return action.data.filter;
//     default:
//       return state;
//   }
// };

// export const setFilter = (filter) => {
//   return {
//     type: "SET_FILTER",
//     data: { filter },
//   };
// };

// export default filterReducer;
