const mongoose = require("mongoose");
const {CONSTANTS} = require("../Constant");

const AuditTrailsSchema = new mongoose.Schema(
  {    
    name: {
      type:String,
      maxlenght:150,
      unique:true,
      required: [true, "Please provide a name"],      
    },
    address: {
      type:String,
      maxlenght:150,
      required: [true, "Please provide a address"],      
    },
    state: {
      type:Number,
      min:0,
      max:35,
      required: [true, "Please provide state"],      
    },
    status: {
      type:Number,
      required: [true, "Please provide a status"],      
    },
    email: {
      type:String,
      maxlenght:150,
      required: [true, "Please provide a address"], 
      validate: CONSTANTS.REGEX.EMAIL,
    },
    phone: {
      type:String,
      maxlenght:150,
      required: [true, "Please provide a phone "],   
      validate: CONSTANTS.REGEX.PHONE,   
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("auditTrails", AuditTrailsSchema);
