import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "msgCounter",
  initialState,
  reducers: {
    updateMsgCounter: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { updateMsgCounter } = counterSlice.actions;

export default counterSlice.reducer;
