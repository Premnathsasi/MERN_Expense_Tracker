/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import classes from "./SignUp.module.css";

const SignUp = () => {
  const [isUserExist, setUserExist] = useState(false);
  const [isError, setError] = useState(false);

  const Navigate = useNavigate();

  const nameInput = useRef();
  const emailInput = useRef();
  const passwordInput = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();
    const obj = {
      name: nameInput.current.value,
      email: emailInput.current.value,
      password: passwordInput.current.value,
    };
    try {
      const res = await axios
        .post("http://localhost:4000/user/signup", obj)
        .then((res) => {
          console.log(res);
          alert(res.data.message);
          Navigate("/");
        })
        .catch((err) => {
          console.log(err);
          setError(true);
          if (err.response.data.error.name) {
            setError(true);
            setUserExist(true);
          }
        });
    } catch (err) {
      console.log(err);
    }
    setTimeout(() => {
      setError(false);
      setUserExist(true);
    }, 4000);

    nameInput.current.value = "";
    emailInput.current.value = "";
    passwordInput.current.value = "";
  };

  return (
    <section className={classes.auth}>
      <div className={classes.main}>
        <h2>Sign Up</h2>
        {isError && (
          <h4 style={{ textAlign: "center", color: "White" }}>
            {isUserExist ? "User already Exists" : "Something went wrong!"}
          </h4>
        )}
        <div className={classes.msg}></div>
        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <input
              type="text"
              id="name"
              required
              ref={nameInput}
              placeholder="Username"
              className="form-control"
            ></input>
          </div>
          <div className={classes.control}>
            <input
              type="email"
              id="email"
              required
              ref={emailInput}
              placeholder="Email"
              className="form-control"
            ></input>
          </div>
          <div className={classes.control}>
            <input
              type="password"
              id="password"
              required
              ref={passwordInput}
              placeholder="Password"
              className="form-control"
            ></input>
          </div>
          <div className={classes.actions}>
            <button>Sign Up</button>
          </div>
        </form>
        <div className={classes.toggle}>
          Already have an account ?{" "}
          <a
            className={classes.anchor}
            onClick={() => {
              Navigate("/");
            }}
          >
            {" "}
            Login
          </a>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
