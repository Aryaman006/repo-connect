const { string } = require("joi");
const {mongoose} = require("mongoose");

const BlogsSchema = new mongoose.Schema({
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
    files: {
        type: [String],
        required: true
    }
},{ timestamps: true });

module.exports = mongoose.model( "blogs", BlogsSchema );