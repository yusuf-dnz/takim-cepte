import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  chats: {},
};

const counterSlice = createSlice({
  name: "msgCounter",
  initialState,
  reducers: {
    updateMsgCounter: (state, action) => {
      state.value = action.payload;
    },
    setChatData: (state, action) => {
      const jsonObj = JSON.parse(action.payload);
      const keys = Object.keys(jsonObj);
      state.chats[keys[0]] = jsonObj[keys[0]];
    },
    clearChatData: (state) => {
      state.value = 0;
      state.chats = {};
    },
  },
});

export const { updateMsgCounter, setChatData, clearChatData } =
  counterSlice.actions;

export default counterSlice.reducer;
