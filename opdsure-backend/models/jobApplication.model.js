const { mongoose } = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: true
    },
    mobile: {
        type: String,
        default: true
    },
    experience: {
        type: Number,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobs",
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("jobApplications", JobApplicationSchema);