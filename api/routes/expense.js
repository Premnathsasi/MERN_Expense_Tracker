const express = require("express");
const expenseController = require("../controllers/expense");
const userAuthenticate = require("../middleware/auth");

const router = express.Router();

router.post(
  "/addexpense",
  userAuthenticate.authenticate,
  expenseController.addExpense
);

router.delete(
  "/deleteExpense/:_id",
  userAuthenticate.authenticate,
  expenseController.deleteExpense
);

router.get(
  "/getexpense",
  userAuthenticate.authenticate,
  expenseController.getAllExpense
);

module.exports = router;
