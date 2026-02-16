const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const CorpoEmpSchema = new mongoose.Schema ({

    corporate : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Corporates",
        required : true,
    },
    employeeId : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    designation : {
        type : String,
        required : false
    },
    department : {
        type : String,
        required : false
    },
    address : {
        type : String,
        required : false
    },
    bank_name : {
        type : String,
        required : false
    },
    dob : {
        type : Date,
        required :  true
    },
    gender : {
        type : Number,        
        required : false
    },
    phone : {
        type : String,
        required : true,
    },
    country_code : {
        type : String,
        required : false
    },
    email : {
        type : String,
        required : true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    status : {
        type : Number,
        required : false
    },
    password: {
        type: String,
        required: true,
    },
    reset_default_password:{
        type: Boolean,
        default: true
    }
},
{ timestamps:true }
);

CorpoEmpSchema.pre("save", function (next) {
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
  
  CorpoEmpSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (error, isMatch) {
      if (error) {
        return callback(error);
      } else {
        callback(null, isMatch);
      }
    });
  };
module.exports = mongoose.model( "corpoEmps", CorpoEmpSchema );