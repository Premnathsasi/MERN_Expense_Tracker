const express = require("express");

const userController = require("../controllers/user");
const expenseController = require("../controllers/expense");
const middleware = require("../middleware/auth");

const router = express.Router();

router.post("/signup", userController.postSignUp);
router.post("/login", userController.postLogin);
router.get("/getUser", middleware.authenticate, userController.getUser);
router.get("/getalluser", userController.getAllUsers);
router.get(
  "/download",
  middleware.authenticate,
  expenseController.downloadFile
);
router.get(
  "/downloadhistory",
  middleware.authenticate,
  userController.getDownloadHistory
);
module.exports = router;
