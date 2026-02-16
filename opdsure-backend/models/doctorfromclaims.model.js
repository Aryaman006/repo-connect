const mongoose = require("mongoose");
const { CONSTANTS } = require("../Constant");

const DoctorFromClaimsSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    reg_no : {
        type : String,
        required : true,
    },
    specialization : {
        type : String,
        required : false,
    },
    hospital : {
        type : String,
        required : false,
    },
    address : {
        type : String,
        required : false,
    },
    mobile : {
        type : String,
        required : false,
    },
    country_code : {
        type : String,
        required : false,
    },
    email : {
        type : String,
        required : false,
        lowercase: true,
        trim: true,
    },
    city : {
        type : String,
        required : false
    },
    pincode: {
        type: String,     
        required: false,
    },
},{ timestamps:true })

module.exports = mongoose.model("doctorsfromclaims", DoctorFromClaimsSchema);