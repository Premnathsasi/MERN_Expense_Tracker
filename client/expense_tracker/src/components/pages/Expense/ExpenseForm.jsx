/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useRef, useEffect, useCallback, useState } from "react";
import ExpenseList from "./ExpenseList";
import axios from "axios";
import { expenseActions } from "../../store/ExpenseSlice";
import { useDispatch, useSelector } from "react-redux";

import classes from "./ExpenseForm.module.css";

const ExpenseForm = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(2);
  const expenseList = useSelector((state) => state.expense.expense);
  const dispatch = useDispatch();
  const amountRef = useRef();
  const descriptionRef = useRef();
  const typeRef = useRef();

  const token = localStorage.getItem("token");

  const getList = async (page) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/expense/getexpense?page=${page}&pageSize=${pageSize}`,
        {
          headers: { Authorization: token },
        }
      );
      console.log(res);
      let newList = [];
      for (const i in res.data.data) {
        newList.push(res.data.data[i]);
      }
      dispatch(expenseActions.getExpense({ expense: newList }));
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getList(currentPage);
  }, [currentPage, pageSize]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    let updatedList = {
      expenseamount: amountRef.current.value,
      expensetype: typeRef.current.value,
      expensedescription: descriptionRef.current.value,
    };
    try {
      const data = await axios
        .post("http://localhost:4000/expense/addexpense", updatedList, {
          headers: { Authorization: token },
        })
        .then((res) => {
          console.log(res.data.data);
          dispatch(expenseActions.addExpense({ expense: res.data.data }));
        });
    } catch (err) {
      console.log(err);
    }
    amountRef.current.value = "";
    typeRef.current.value = "";
    descriptionRef.current.value = "";
  };

  const deleteHandler = (item) => {
    dispatch(expenseActions.deleteExpense({ expense: item }));
  };

  const newExpenseList = expenseList.map((item) => (
    <ExpenseList item={item} key={Math.random()} onDelete={deleteHandler} />
  ));

  return (
    <section className={classes.bg}>
      <div className={classes.main}>
        <form onSubmit={submitHandler} className={classes.forms}>
          <div className={classes.control}>
            <label htmlFor="expenseamount">Expense Amount</label>
            <input
              id="expenseamount"
              type="number"
              style={{ marginTop: "15px" }}
              className="form-control"
              ref={amountRef}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="expensetype">Expense Type</label>
            <select className="form-select ms-3" id="expensetype" ref={typeRef}>
              <option>Food</option>
              <option>Shopping</option>
              <option>Entertainment</option>
              <option>Education</option>
              <option>Tour</option>
              <option>Others</option>
            </select>
          </div>
          <div className={classes.control}>
            <label htmlFor="expensedescription">Expense Description</label>
            <textarea
              type="text"
              id="expensedescription"
              className="form-control"
              ref={descriptionRef}
            />
          </div>
          <div className={classes.actions}>
            <button type="submit">Add Expense</button>
          </div>
        </form>
      </div>

      <div>
        {expenseList.length > 0 && (
          <h3 className={classes.expense}>Expenses</h3>
        )}
        {newExpenseList}
        <div className={classes.pagination}>
          <button
            className={
              currentPage === 1 ? classes.disable : classes.paginationBtn
            }
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            prev
          </button>
          <span>{currentPage}</span>
          <button
            className={
              currentPage === totalPages
                ? classes.disable
                : classes.paginationBtn
            }
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            next
          </button>
        </div>
        <div className={classes.selectPageSize}>
          <div>Rows per page:</div>
          <select id="rowsize" onChange={(e) => setPageSize(e.target.value)}>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="8">8</option>
            <option value="10">10</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default ExpenseForm;
