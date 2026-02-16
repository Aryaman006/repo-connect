const mongoose = require("mongoose");
const { CONSTANTS } = require("../Constant");

const HealthCheckSchema = new mongoose.Schema(
  {
    health_checkup_id: {
      type: String,
      required: true
    },
    message: {
        type: String,
        required: false
    },
    checkup_for: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tests",
        required: true,
      }
    ],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    member_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "families",
        required: true
    },
    status: {
      type: Number,
      default: CONSTANTS.HEALTH_CHECKUP.STATUS.PENDING
    },
    appointment:{
      type: Date,
      required:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("healthchecks", HealthCheckSchema);
