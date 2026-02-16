var mongoose = require("mongoose");

var tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    token: {
      type: String,
      required: true,
      trim: true
    },
    otp: {
      type: Number,
      required: true,
      trim: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("tokens", tokenSchema);