const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema(
  {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
      },
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: Number,
      required: true
    },
    claim_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "claims",
      required: false
    },
    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plans",
      required: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("wallets", WalletSchema);
