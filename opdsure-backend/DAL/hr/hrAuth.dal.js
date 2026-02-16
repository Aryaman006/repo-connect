const { corporateHr } = require("../../models");

const HrAuthDal = {
  GetUser: async (query, params) =>await corporateHr.findOne(query).select(params).lean(),
  
  UpdateUser: async (filter,update) => await corporateHr.updateOne(filter,update),
};

module.exports = HrAuthDal;
