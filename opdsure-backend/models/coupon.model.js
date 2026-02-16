const mongoose = require("mongoose");
const { CONSTANTS } = require("../Constant");

const CouponSchema = new mongoose.Schema({

    coupon_type : {
        type : Number,
        required : true,
    },
    name : {
        type : String,
        required : true,
    },
    coupon_code : {
        type : String,
        required : true,
        lowercase: true
    },
    discount_type : {
        type : Number,
        required : true,
    },
    discount : {
        type : Number,
        required : true,
    },
    start_date : {
        type : Date,
        required : true,
    },
    end_date : {
        type : Date,
        required : true,
    },
    usage_type : {
        type : Number,
    },
    usage : {
        type : Number,
        default:1,
    },
    times_consumed : {
        type : Number,
        default:0,
    },
    terms : {
        type : String,
        required : true,
    },
    status : {
        type : Number,
    },
    corporate : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Corporates",
        required:false,
    }
})

module.exports = mongoose.model("coupons", CouponSchema);