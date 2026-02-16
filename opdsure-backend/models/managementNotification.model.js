const {mongoose} = require("mongoose");

const ManagementNotificationSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "managmentusers",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read : {
        type: Boolean,
        default: false,
        required: false
    }

},{ timestamps:true });

module.exports = mongoose.model("managementNotifications",ManagementNotificationSchema);