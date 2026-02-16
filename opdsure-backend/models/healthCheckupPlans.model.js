const mongoose = require("mongoose");

const HealtCheckupPlanSchema = new mongoose.Schema(
  {    
    checkup_code: {
      type:String,
      unique:true,
      unique: true  
    },    
    name: {
      type:String,
      unique:true,   
    },    
    base_price: {
      type:Number, 
      required: true,      
    },
    discounted_price: {
      type:Number, 
      required: true,      
    },
    parameters: {
      type:Number, 
      required: true,      
    },
    test_details: {
        type:Array,
        required: false,      
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("healthCheckupPlans", HealtCheckupPlanSchema);
