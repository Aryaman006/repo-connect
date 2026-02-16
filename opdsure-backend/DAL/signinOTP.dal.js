const {SigninOTP} = require("../models");

const SigninOtpDal = {

  saveOTP: async (data) => await SigninOTP.create(data),

  deleteOTP: async (query) => await SigninOTP.findOneAndDelete(query),

  getRequestForOTP: async (query) => await SigninOTP.findOne(query).sort({ createdAt: -1 }).exec(),

};

module.exports = SigninOtpDal;