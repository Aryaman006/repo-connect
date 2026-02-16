const mongoose = require("mongoose");

const ContactUsCorporateSchema = new mongoose.Schema(
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
    designation: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    },
    employees: {
        type: Number,
        required: true,
    },
    hear: {
        type: String,
        required: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("contactUsCorporates", ContactUsCorporateSchema);
