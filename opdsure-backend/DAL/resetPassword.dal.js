const {ResetPass} = require("../models");

const ResetPassDal = {

  saveRequest: async (data) => await ResetPass.create(data),

  deleteRequest: async (query) => await ResetPass.findOneAndDelete(query),

  getRequest: async (query) => await ResetPass.findOne(query).sort({ createdAt: -1 }).exec(),

};

module.exports = ResetPassDal;