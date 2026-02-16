const mongoose = require("mongoose");

const PlanRenewSchema = new mongoose.Schema({
    plan_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plans",
        required: true
    },
    membership_id: {
        type: Number,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    activated: {
        type: Boolean,
        default: false,
        required: false
    },
    paid_price: {
        type: Number,
        default: 0,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("planRenewList",PlanRenewSchema);