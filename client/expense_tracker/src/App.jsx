/* eslint-disable no-unused-vars */
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import ExpenseForm from "./components/pages/Expense/ExpenseForm";
import Header from "./components/pages/Header";
import LeaderBoard from "./components/pages/LeaderBoard";
import ForgotPassword from "./components/pages/ForgotPassword";
import DownloadHistory from "./components/pages/DownloadHistory";

function App() {
  const auth = useSelector((state) => state.auth.isAuthenticate);

  return (
    <>
      {auth && <Header />}
      <Routes>
        {!auth && <Route path="/" element={<Login />} />}

        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/downloadhistory" element={<DownloadHistory />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/signup" element={<SignUp />} />
        {auth && <Route path="/expense" element={<ExpenseForm />} />}
        {!auth ? (
          <Route path="*" element={<Navigate to="/" />} />
        ) : (
          <Route path="*" element={<Navigate to="/expense" />} />
        )}
      </Routes>
    </>
  );
}

export default App;
