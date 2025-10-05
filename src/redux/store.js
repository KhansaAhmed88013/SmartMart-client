import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "./Role/roleSlice"
import pathReducer from "./Path/pathSlice"

export const store = configureStore({
  reducer: {
    role: roleReducer, // add role slice
    path: pathReducer, // add path slice
  },
});
