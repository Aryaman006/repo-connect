const mongoose = require("mongoose");
const {CONSTANTS} = require("../Constant");

const GeneralUserAuditTrailsSchema = new mongoose.Schema(
  {    
    path: {
      type:String,
      required: true,      
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,  
    },
    method: {
      type:String,
      required: true,      
    },
    program_id: {
      type:Number,
      required: false,      
    },
    program_name: {
      type:String,
      required: false,      
    },
    old_record:{
      type: String,
      required: true,
    },
    new_record:{
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("generalUsersAuditTrails", GeneralUserAuditTrailsSchema);