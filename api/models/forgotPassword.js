const { Schema, model } = require("mongoose");

const forgotPasswordSchema = new Schema({
  id: String,
  isActive: Boolean,
  expireBy: Date,
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = model("ForgotPassword", forgotPasswordSchema);
