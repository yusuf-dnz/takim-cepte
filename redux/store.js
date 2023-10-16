import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./messages";
import authReducer from "./authentication";

export const store = configureStore({
  reducer: {
    msgCounter: counterReducer,
    authStatus: authReducer,
  },
});
