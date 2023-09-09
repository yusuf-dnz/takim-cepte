import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  messages: null,
};

const counterSlice = createSlice({
  name: "msgCounter",
  initialState,
  reducers: {
    updateMsgCounter: (state, action) => {
      state.value = action.payload;
    },
    setMessagesData: (state,action) =>{
      state.messages = JSON.parse(action.payload);

    }
  },
});

export const { updateMsgCounter } = counterSlice.actions;

export default counterSlice.reducer;
