const mongoose = require("mongoose");

const MfineSubSchema = new mongoose.Schema(
    {
        
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
               
    },
    { timestamps: true }
);

module.exports = mongoose.model("MfineSubs", MfineSubSchema);
