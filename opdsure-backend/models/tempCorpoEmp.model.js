const mongoose = require("mongoose");
const TempCorpoEmpSchema = new mongoose.Schema ({

    corporate : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Corporates",
        required : false,
    },
    employeeId : {
        type : String,
        required : false
    },
    name : {
        type : String,
        required : false
    },
    designation : {
        type : String,
        required : false
    },
    department : {
        type : String,
        required : false
    },
    address : {
        type : String,
        required : false
    },
    bank_name : {
        type : String,
        required : false
    },
    dob : {
        type : Date,
        required :  false
    },
    gender : {
        type : Number,        
        required : false
    },
    phone : {
        type : String,
        required : false,
    },
    country_code : {
        type : String,
        required : false
    },
    email : {
        type : String,
        required : false,
    },
    status : {
        type : Number,
        required : false
    },
    reason : {
        type : String,
        required : false
    },
},
{ timestamps:true }
);

module.exports = mongoose.model( "tempCorpoEmps", TempCorpoEmpSchema );