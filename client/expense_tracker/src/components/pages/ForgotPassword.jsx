import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./ForgotPassword.module.css";
import axios from "axios";

const ForgotPassword = () => {
  const emailInput = useRef();
  const Navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      let forgotMail = {
        email: emailInput.current.value,
      };
      const data = await axios.post(
        "http://localhost:4000/password/forgotpassword",
        forgotMail
      );
      if (data) {
        alert(data.data.data);
        Navigate("/");
      }
    } catch (err) {
      alert(err.response.data.data);
    }
  };

  return (
    <section className={classes.container}>
      <div className={classes.main}>
        <form onSubmit={submitHandler}>
          <div className={classes.formControl}>
            <label>Reset your password</label>
            <input
              type="email"
              name="email"
              id="email"
              ref={emailInput}
              required
            />
          </div>
          <button type="submit">Get reset link</button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
