const mongoose = require("mongoose");
const {CONSTANTS} = require("../Constant");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const ManagenetUserSchema = new mongoose.Schema(
  {    
    name: {
      type:String,
      required: true,      
    },
    user_type: {
        type: Number,
        default : 0,
        required: true,  
    },
    designation: {
        type: Schema.Types.ObjectId,
        ref: 'Designations',
        default:null 
    },
    password: {
      type:String,
      required: true,  
    },
    claim_assign: {
      type: Boolean,
      default: false,
    },
    email: {
      type:String,
      required: true,
      lowercase: true,
      trim: true,
    },
    country_code: {
      type:String,      
      required:true,         
    },
    mobile: {
      type:String,      
      required:true,         
    },
    status: {
      type:Number,      
      required:true,  
      default: CONSTANTS.STATUS.ACTIVE       
    },
    token: {
      type: [String],
      default: []
    },
  },
  { timestamps: true }
);

ManagenetUserSchema.pre("save", function (next) {
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

ManagenetUserSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (error, isMatch) {
      if (error) {
        return callback(error);
      } else {
        callback(null, isMatch);
      }
    });
  };
  

module.exports = mongoose.model("managmentusers", ManagenetUserSchema);
