const mongoose = require("mongoose");
const { CONSTANTS } = require("../Constant");

const UpdateMemberSchema = new mongoose.Schema(
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
        require: true
    },
    dob: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: false,
    },
    member_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "families",
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    file: {
        type: String,
        required: true,
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
        default: CONSTANTS.REVIEW_STATUS.PENDING
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("updatemembers", UpdateMemberSchema);
