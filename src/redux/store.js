import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "./Role/roleSlice"
 

export const store = configureStore({
  reducer: {
    role: roleReducer, // add role slice
 
  },
});
