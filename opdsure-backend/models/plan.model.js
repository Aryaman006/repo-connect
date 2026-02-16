const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema(
  {    
    name: {
      type:String,
      unique:false,   
    },    
    frequency: {
      type:Number, 
      required: true,      
    },
    subscriber_type: {
      type:Number, 
      required: true,      
    },
    corporate:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Corporates",
      required:false,
    },
    claim_combination: {
      type:Number, 
      required: true,      
    },
    opd_max_discount: {
      type:Number, 
      required: true,      
    },
    opd_precent_discount: {
      type:Number, 
      required: true,      
    },
    lab_max_discount: {
      type:Number, 
      required: false,      
    },
    lab_precent_discount: {
      type:Number, 
      required: false,      
    },
    pharmacy_max_discount: {
      type:Number, 
      required: false,      
    },
    pharmacy_precent_discount: {
      type:Number, 
      required: false,      
    },
    combined_lab_plus_test_max_discount: {
      type:Number, 
      required: false,      
    },
    combined_lab_plus_test_percent: {
      type:Number, 
      required: false,      
    },
    plan_benefits: {
      type:Array,
      required: false,      
    },
    membership_options: {
      type:Array,
      required: false,      
    },
    files: {
      type: [String],
      required: false,      
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plans", PlanSchema);
