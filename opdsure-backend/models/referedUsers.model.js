const mongoose = require("mongoose");

const ReferedUsersSchema = new mongoose.Schema(
  {
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    refer_name: {
        type: String,
        required: true
    },
    refer_phone: {
        type: String,
        required: true,
    },
    refer_email: {
        type: String,
        required: false,
    },
    action_taken: {
        type: Boolean,
        required: false,
        default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("referedUsers", ReferedUsersSchema);
