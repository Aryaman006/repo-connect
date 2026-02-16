const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const CorporateHrSchema = new mongoose.Schema({
    corporate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Corporates",
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    country_code: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        maxlength: 500,
    },
    token: {
        type: [String],
        default: []
    },
    status : {
        type : Number,
        required : true
    },
},{ timestamps:true });

CorporateHrSchema.pre("save", function (next) {
    const user = this;
  
    if (this.isModified("password") || this.isNew) {
      bcrypt.genSalt(10, function (saltError, salt) {
        if (saltError) {
          return next(saltError);
        } else {
          bcrypt.hash(user.password, salt, function (hashError, hash) {
            if (hashError) {
              return next(hashError);
            }
  
            user.password = hash;
            next();
          });
        }
      });
    } else {
      return next();
    }
  });
  
  CorporateHrSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (error, isMatch) {
      if (error) {
        return callback(error);
      } else {
        callback(null, isMatch);
      }
    });
  };

module.exports = mongoose.model("corporateHr",CorporateHrSchema);