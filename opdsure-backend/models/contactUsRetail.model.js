const mongoose = require("mongoose");

const ContactUsRetailSchema = new mongoose.Schema(
  {
   
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: false,
    },
    hear: {
        type: String,
        required: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("contactUsRetails", ContactUsRetailSchema);
