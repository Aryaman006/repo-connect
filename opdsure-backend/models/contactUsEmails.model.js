const mongoose = require("mongoose");

const ContactUsEmailSchema = new mongoose.Schema(
  {
    email: {
        type: String,
        required: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("contactUsEmails", ContactUsEmailSchema);
