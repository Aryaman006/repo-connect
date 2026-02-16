const {mongoose} = require("mongoose");

const AdminNotificationSchema = new mongoose.Schema({

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

module.exports = mongoose.model("adminNotifications",AdminNotificationSchema);