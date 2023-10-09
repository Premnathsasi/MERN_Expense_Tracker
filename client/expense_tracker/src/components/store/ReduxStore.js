import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./ExpenseSlice";
import authReducer from "./AuthSlice";
import userReducer from "./LeaderBoard";

const store = configureStore({
  reducer: {
    expense: expenseReducer,
    auth: authReducer,
    leaderboard: userReducer,
  },
});

export default store;
