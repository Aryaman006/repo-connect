const mongoose = require("mongoose");
const {CONSTANTS} = require("../Constant");

const CorporatesSchema = new mongoose.Schema(
  {    
    name: {
      type:String,
      required: true,      
    },
    address: {
      type:String,
      required: true,      
    },
    state: {
      type:Number,     
      required: true,      
    },
    status: {
      type:Number,
      required: true,      
    },
    email: {
      type:String,    
      required: true,       
    },
    phone: {
      type:String,
      required: true,   
    },
    mobile: {
      type:String,
      required: false,   
    },
    country_code: {
      type:String,
      required: true,   
    },
    contact_person:{
      type:String,
      required:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Corporates", CorporatesSchema);
