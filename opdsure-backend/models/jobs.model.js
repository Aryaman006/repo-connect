const { mongoose } = require("mongoose");

const JobsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: true
    },
    jd: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("jobs", JobsSchema);