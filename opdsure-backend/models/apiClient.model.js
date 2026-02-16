const mongoose = require("mongoose");
const { CONSTANTS } = require("../Constant");

const ApiClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: Number,
      required: true,
      default: CONSTANTS.STATUS.ACTIVE,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admindetails",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("api_clients", ApiClientSchema);
