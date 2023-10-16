import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authId: null,
  userData: {},
};

const authentication = createSlice({
  name: "authStatus",
  initialState,
  reducers: {
    setAuthId: (state, action) => {
      state.authId = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = JSON.parse(action.payload);
    },
    updateUserData: (state, action) => {
      const jsonObj = JSON.parse(action.payload);
      const keys = Object.keys(jsonObj);
      state.userData[keys[0]] = jsonObj[keys[0]];
    },
    deleteAuthData: (state) => {
      state.authId = null;
      state.userData = {};
    },
  },
});

export const { setAuthId, setUserData, deleteAuthData, updateUserData } =
  authentication.actions;

export default authentication.reducer;
