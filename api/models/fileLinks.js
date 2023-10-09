const { Schema, model } = require("mongoose");

const fileLinksSchema = new Schema({
  fileUrl: {
    type: String,
    required: true,
  },
  createdAt: Date,
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = model("FileLink", fileLinksSchema);
