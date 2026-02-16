const mongoose = require("mongoose");

const PurchasedHealthCheckupPlanSchema = new mongoose.Schema({
    health_plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "healthCheckupPlans",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
        required: false
    },
    paid_price: {
        type: Number,
        default: 0,
        required: true
    },
    patient_name:{
        type: String,
        required:false
    },
    age:{
        type: Number,
        required:false
    },
    gender:{
        type: Number,
        required:false
    },
    address:{
        type: String,
        required:false
    },
    pincode:{
        type: Number,
        required:false
    },
    appointment:{
        type: String,
        required:false
    },
    details_submitted:{
        type: Boolean,
        default:false

    }
}, { timestamps: true });

module.exports = mongoose.model("purchasedHealthCheckupPlans",PurchasedHealthCheckupPlanSchema);