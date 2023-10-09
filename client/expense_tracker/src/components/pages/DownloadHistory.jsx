import { useEffect, useState } from "react";

import classes from "./DownloadHistory.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DownloadHistory = () => {
  const token = localStorage.getItem("token");
  const [list, setList] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/user/downloadhistory", {
        headers: { Authorization: token },
      })
      .then((res) => {
        const dataList = res.data.data;
        setList(dataList);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={classes.container}>
      <button
        className={classes.back}
        onClick={() => {
          Navigate("/");
        }}
      >
        Back
      </button>
      <h2>Downloaded History</h2>
      <div className={classes.main}>
        <div className={classes.downloadLink}>
          {list.map((item, index) => (
            <div key={item._id}>
              <span>{item.createdAt}</span>
              <a href={item.fileUrl}>Expense{index + 1}</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DownloadHistory;
