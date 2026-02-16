const { string } = require("joi");
const {mongoose} = require("mongoose");

const GoogleReviewsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    feedback:{
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        required:false
    },
    rating:{
        type: Number,
        required: true
    },
    review_url:{
        type: String,
        required:false
    },
    corporate_review:{
        type: Boolean,
        required:false,
        default: true
    },
    corporate_name:{
        type: String,
        required:false,
    },
    
},{ timestamps: true });

module.exports = mongoose.model( "googleReviews", GoogleReviewsSchema );