const Expense = require("../models/expense");
const FileLink = require("../models/fileLinks");
const User = require("../models/user");
const s3service = require("../services/s3service");

exports.addExpense = async (req, res, next) => {
  let { expenseamount, expensetype, expensedescription } = req.body;

  const expense = new Expense({
    amount: expenseamount,
    type: expensetype,
    description: expensedescription,
    userId: req.user,
  });
  expense.save().then((result) => {
    User.findOneAndUpdate(
      { _id: req.user._id },
      { $inc: { totalCost: expenseamount } },
      { new: true }
    )
      .then((data) => {
        return res.status(201).json({ data: result, updated: data });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(500)
          .json({ error: "An internal server error occurred" });
      });
  });
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const id = req.params._id;
    const userId = req.user._id;
    const data = await Expense.findOne({ _id: id, userId: userId });

    if (!data) {
      return res.status(404).json({ error: "Expense not found" });
    }
    await data.deleteOne();
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $inc: { totalCost: -data.amount } }
    ).then((result) => {
      return res.status(200).json({ message: "Expense deleted successfully" });
    });
  } catch (err) {
    return res.status(500).json({ error: "An internal server error occurred" });
  }
};

exports.getAllExpense = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const pageSize = +req.query.pageSize || 2;

    const data = await Expense.find({ userId: req.user._id })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();
    if (data) {
      const totalCount = await Expense.countDocuments({ userId: req.user._id });
      const totalPages = Math.ceil(totalCount / pageSize);
      return res.status(200).json({
        data: data,
        totalPages: totalPages,
        currentPage: page,
      });
    } else {
      return res.status(400).json({ error: "No data found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "An internal server error occurred" });
  }
};

exports.downloadFile = async (req, res, next) => {
  try {
    const expense = await Expense.find({ userId: req.user });
    console.log(expense);
    const filename = `${req.user.name}/Expense${new Date().toLocaleString()}`;
    const fileURL = await s3service.uploadToS3(
      JSON.stringify(expense),
      filename
    );
    if (fileURL) {
      const createLink = new FileLink({
        fileUrl: fileURL,
        createdAt: new Date().toLocaleString(),
        userId: req.user,
      });
      createLink.save().then((result) => {
        return res.status(200).json({ fileURL });
      });
    } else {
      return res
        .status(500)
        .json({ error: "Internal server error", success: false });
    }
  } catch (err) {
    return res.status(400).json({ error: err, success: false });
  }
};
