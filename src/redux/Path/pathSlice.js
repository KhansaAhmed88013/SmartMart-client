import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  path: "",
};

const pathSlice = createSlice({
  name: "path",
  initialState,
  reducers: {
    setPath: (state, action) => {
      state.path = action.payload;
    },
    clearPath: (state) => {
      state.path = "";
    },
  },
});

export const { setPath, clearPath } = pathSlice.actions;
export default pathSlice.reducer;
