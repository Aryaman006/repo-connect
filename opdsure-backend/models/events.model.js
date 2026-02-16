const {mongoose} = require("mongoose");

const EventSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: false
    },
    files: {
        type: [String],
        required: true
    }
},{ timestamps: true });

module.exports = mongoose.model( "events", EventSchema );