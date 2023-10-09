/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import classes from "./Header.module.css";
import { authActions } from "../store/AuthSlice";
import useRazorpay from "react-razorpay";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { leaderboardActions } from "../store/LeaderBoard";
import axios from "axios";
import download from "../../assets/download.png";
import { useEffect, useState } from "react";

const Header = (props) => {
  const token = localStorage.getItem("token");
  const [ispremium, setPremium] = useState(false);
  const [Razorpay] = useRazorpay();
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  useEffect(() => {
    async function getUsers() {
      const data = await axios.get("http://localhost:4000/user/getUser", {
        headers: { Authorization: token },
      });
      if (data.data.data.isPremiumUser) {
        setPremium(true);
      }
    }
    getUsers();
  }, []);

  const handlePayment = async (e) => {
    const response = await axios.get(
      "http://localhost:4000/purchase/membership",
      { headers: { Authorization: token } }
    );
    console.log(response);

    const options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      handler: async function (res) {
        const data = await axios.post(
          "http://localhost:4000/purchase/updateStatus",
          {
            order_id: options.order_id,
            payment_id: res.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );

        alert("you are a Premium User Now");
        console.log(data);
        setPremium(true);
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on("payment.failed", function (response) {
      console.log(response);
      alert("Something went wrong");
    });
  };

  const leaderboardHandler = async () => {
    try {
      const data = await axios.get("http://localhost:4000/user/getalluser");

      let newList = [];
      data.data.data.map((item) => {
        newList.push(item);
      });
      Navigate("/leaderboard");
      console.log(newList);
      dispatch(leaderboardActions.addExpense({ userList: newList }));
    } catch (err) {
      console.log(err);
    }
  };

  const downloadHandler = async () => {
    try {
      const data = await axios.get("http://localhost:4000/user/download", {
        headers: { Authorization: token },
      });
      if (data.status === 200) {
        const a = document.createElement("a");
        a.href = data.data.fileURL;
        a.setAttribute("download", "Expense.txt");
        console.log(a);
        a.click();
      }
      Navigate("/downloadhistory");
    } catch (err) {
      alert(err.message);
      Navigate("/downloadhistory");
    }
  };

  const logoutHandler = () => {
    dispatch(authActions.logout());
    localStorage.removeItem("token");
    Navigate("/");
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.title}>
        <h2>Expense Tracker</h2>
        {ispremium && (
          <div>
            <span>Download</span>
            <img
              onClick={downloadHandler}
              className={classes.dbtn}
              src={download}
            ></img>
          </div>
        )}
      </div>

      <div className={classes.feature}>
        {!ispremium ? (
          <button className={classes.premium} onClick={handlePayment}>
            Buy Premium
          </button>
        ) : (
          <h5>
            You are a Premium User{" "}
            <button
              onClick={leaderboardHandler}
              className={classes.leaderboard}
            >
              Leaderboard
            </button>
          </h5>
        )}
        <button className={classes.logout} onClick={logoutHandler}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Header;
