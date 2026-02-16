const mongoose = require("mongoose");

const signupOTPSchema = new mongoose.Schema({
   phone: {
    type: String,
    required: true
   },
   createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 10 
  },
   otp: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("SignupOTP", signupOTPSchema);
