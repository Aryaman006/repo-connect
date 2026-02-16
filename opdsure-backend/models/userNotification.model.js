const {mongoose} = require("mongoose");

const UserNotificationSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
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

module.exports = mongoose.model("userNotifications",UserNotificationSchema);