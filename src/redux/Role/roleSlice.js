import { createSlice } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";

const token = localStorage.getItem("token");
let decodedRole = null;

if (token) {
  try {
    const decoded = jwtDecode(token);
    decodedRole = decoded.role;
  } catch (err) {
    console.error("Invalid token", err);
  }
}

const roleSlice = createSlice({
  name: "role",
  initialState: {
    role: decodedRole, // comes from JWT, not plain localStorage
  },
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    clearRole: (state) => {
      state.role = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setRole, clearRole } = roleSlice.actions;
export const selectRole = (state) => state.role.role;
export default roleSlice.reducer;
