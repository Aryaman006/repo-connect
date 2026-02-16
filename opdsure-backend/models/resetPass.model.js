const mongoose = require("mongoose");

const resetPasswordSchema = new mongoose.Schema({
   email: {
    type: String,
    required: true
   },
   createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 10 
  },
   key: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("ResetPass", resetPasswordSchema);
