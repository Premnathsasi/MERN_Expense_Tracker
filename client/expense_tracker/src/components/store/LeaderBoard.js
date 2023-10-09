import { createSlice } from "@reduxjs/toolkit";
const initialState = { userList: [] };

const UserSlice = createSlice({
  name: "userlist",
  initialState: initialState,
  reducers: {
    addExpense(state, action) {
      state.userList = action.payload.userList;
    },
  },
});

export const leaderboardActions = UserSlice.actions;

export default UserSlice.reducer;
