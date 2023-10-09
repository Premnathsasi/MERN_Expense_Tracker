import { createSlice } from "@reduxjs/toolkit";

const loggedIn = !!localStorage.getItem("token");
const initialState = { isAuthenticate: loggedIn };

const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    login(state) {
      state.isAuthenticate = true;
    },
    logout(state) {
      state.isAuthenticate = false;
    },
  },
});

export const authActions = AuthSlice.actions;
export default AuthSlice.reducer;
