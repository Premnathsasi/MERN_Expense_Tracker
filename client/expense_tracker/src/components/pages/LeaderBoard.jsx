import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import classes from "./LeaderBoard.module.css";

const LeaderBoard = () => {
  const userList = useSelector((state) => state.leaderboard.userList);

  const Navigate = useNavigate();
  return (
    <>
      <button
        className={classes.backbtn}
        onClick={() => {
          Navigate("/expense");
        }}
      >
        Back
      </button>
      <section className={classes.container}>
        <div className={classes.leaderboard}>
          <h2>Leaderboard</h2>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.totalCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default LeaderBoard;
