const {mongoose} = require("mongoose");

const MediaSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    desciption:{
        type: String,
        default: true
    },
    author:{
        type: String,
        required: false
    },
    media_url:{
        type: String,
        required: false
    },
    media_name:{
        type: String,
        required: false
    },
    files: {
        type: [String],
        required: true
    },
    media_icon: {
        type: String,
        required: false
    }
},{ timestamps: true });

module.exports = mongoose.model( "media", MediaSchema );