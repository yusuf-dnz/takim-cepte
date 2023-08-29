import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
  userData:null,

};

const authentication = createSlice({
  name: "authStatus",
  initialState,
  reducers: {
    setAuthId: (state, action) => {
      state.value = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = JSON.parse(action.payload);
    }
  },
});


export const { setAuthId ,setUserData } = authentication.actions;

export default authentication.reducer;