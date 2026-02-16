const {SignupOTP} = require("../models");

const SignupOtpDal = {

  saveOTP: async (data) => await SignupOTP.create(data),

  deleteOTP: async (query) => await SignupOTP.findOneAndDelete(query),

  getRequestForOTP: async (query) => await SignupOTP.findOne(query).sort({ createdAt: -1 }).exec(),

};

module.exports = SignupOtpDal;