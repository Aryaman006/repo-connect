const {mongoose} = require("mongoose");

const LinkedinSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    iframe:{
        type: String,
        required: true
    },
    post_url:{
        type: String,
        required: false
    },
},{ timestamps: true });

module.exports = mongoose.model( "linkedin", LinkedinSchema );