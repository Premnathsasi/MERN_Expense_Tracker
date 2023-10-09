const path = require("path");
const fs = require("fs");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const forgotPasswordRoutes = require("./routes/forgotPassword");

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

dotenv.config({ path: "./.env" });
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(cors());
app.use(express.json({ extended: false }));

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/password", forgotPasswordRoutes);

mongoose
  .connect(
    "mongodb+srv://premnath:owZtrr10Xaj7YrRd@cluster0.nil9xf3.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`App is running at port 4000`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
