const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
      },
    payment: {
        type: {},
        required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("payments", PaymentSchema);
