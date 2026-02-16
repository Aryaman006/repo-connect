const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TestSchema = new mongoose.Schema(
  {    
    name: {
      type:String,
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: 'Plans',
        required: [true, "Please provide plan id"],  
    },
    details: {
      type:String,
    },
    subscriber_type: {
      type:Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tests", TestSchema);
