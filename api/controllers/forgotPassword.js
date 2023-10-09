const Sib = require("sib-api-v3-sdk");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const ForgotPassword = require("../models/forgotPassword");

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const client = Sib.ApiClient.instance;

    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SENDIBLUE_API_KEY;

    const user = await User.findOne({ email: email });
    if (user) {
      const id = uuid.v4();
      const forgotpassword = new ForgotPassword({
        id: id,
        isActive: true,
        userId: user._id,
      });
      forgotpassword.save().catch((err) => {
        throw new Error(err);
      });

      const tranEmailApi = new Sib.TransactionalEmailsApi();
      const sender = {
        email: "premnaths826@gmail.com",
      };

      const receiver = [
        {
          email: email,
        },
      ];

      tranEmailApi
        .sendTransacEmail({
          sender,
          to: receiver,
          subject: "Password Reset Link",
          textContent: `<a href="http://localhost:4000/password/resetpassword/${id}">Reset Password</a>`,
        })
        .then((result) => {
          return res
            .status(202)
            .json({ data: "reset link successfully sent", result });
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    ForgotPassword.findOne({ id: id }).then((result) => {
      if (result) {
        res.status(200).send(
          `<html>
          <script>
       function formsubmitted(e){
           e.preventDefault();
           console.log('called')
       }
       </script>
   <form action="/password/updatepassword/${id}" method="get">
       <label for="newpassword">Enter New Password</label>
       <input name="newpassword" type="password" required></input>
       <button>reset password</button>
   </form>`
        );
        res.end();
      }
    });
  } catch (err) {
    throw new Error(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { newpassword } = req.query;
    const { resetid } = req.params;
    const data = await ForgotPassword.findOne({ id: resetid });
    if (data.isActive) {
      const user = await User.findById(data.userId);
      if (user) {
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) {
            console.log(err);
            throw new Error(err);
          }

          bcrypt.hash(newpassword, salt, (err, hash) => {
            if (err) {
              console.log(err);
              throw new Error(err);
            }
            data.updateOne({ isActive: false }).then(() => {
              user.updateOne({ password: hash }).then(() => {
                res
                  .status(201)
                  .send({ message: "password successfully updated" });
              });
            });
          });
        });
      } else {
        return res
          .status(404)
          .json({ error: "No user Exists", success: false });
      }
    } else {
      res.status(400).send({ error: "Reset link expired" });
    }
  } catch (err) {
    return res.status(403).json({ error: err, success: false });
  }
};
