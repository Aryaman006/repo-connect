const mongoose = require("mongoose");

const CouponUsagesSchema = new mongoose.Schema({
    coupon : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"coupons",
        required: true
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: true
    },
    plan : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Plans",
        required: false,
        default:null
    },
    health_plan : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"healthCheckupPlans",
        required: false,
        default:null
    },
    amount: {
        type: Number,
        required:false,
    },
    discount: {
        type: Number,
        required:false,
    }
},{ timestamps: true });

module.exports = new mongoose.model("couponUsages", CouponUsagesSchema);