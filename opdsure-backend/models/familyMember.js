const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { CONSTANTS } = require("../Constant");

const FamilySchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
    },
    country_code: {
        type: String,
        required: true,
    },
    gender: {
        type: Number,
        require: false
    },
    dob: {
        type: String,
        required: false,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    address: {
        type: String,
        required: false,
    },
    relation: {
        type: Number,
        required: true,
    },
    plan_status: {
        type: Number,
        require: true,
        default: CONSTANTS.PLAN_STATUS.UNPAID
    },
    review_status: {
        type: Number,
        require: true,
        default: CONSTANTS.REVIEW_STATUS.ACCEPTED
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("families", FamilySchema);
