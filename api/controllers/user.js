const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const FileLink = require("../models/fileLinks");

const genereteToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY);
};

exports.postSignUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      console.log(err);
      const user = new User({
        name: name,
        email: email,
        password: hash,
        totalCost: 0,
        isPremiumUser: false,
      });
      user
        .save()
        .then((result) => {
          return res.status(201).json({
            message: "Account successfully created",
            data: result,
          });
        })
        .catch((err) => {
          if (err) {
            return res.status(500).json({ error: err });
          }
        });
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    let id;
    const { email, password } = req.body;
    await User.findOne({ email: email }).then((resu) => {
      if (!resu) {
        return res.status(404).json({ data: "User not found" });
      }
      id = resu._id;
      bcrypt.compare(password, resu.password, (err, result) => {
        if (result) {
          return res.status(200).json({
            data: "User Successfully logged in",
            token: genereteToken(id),
          });
        } else {
          return res.status(401).json({ data: "Incorrect Password" });
        }
      });
    });
  } catch (err) {
    res.status(404).json({ data: "Something went wrong" });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    User.findById(req.user._id)
      .select("isPremiumUser")
      .then((result) => {
        return res.status(200).json({ data: result });
      })
      .catch((err) => res.status(404).json({ err: err }));
  } catch (err) {
    res.status(404).json({ err: err });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    await User.find()
      .select("name _id totalCost")
      .then((result) => {
        result.sort((a, b) => b.totalCost - a.totalCost);
        return res.status(200).json({ data: result });
      });
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

exports.getDownloadHistory = async (req, res, next) => {
  try {
    const data = await FileLink.find({ userId: req.user });

    if (data) {
      return res.status(200).json({ data });
    }
  } catch (err) {
    return res.status(404).json({ error: err });
  }
};
