const { managmentUsers } = require("../../models");

const ManagementAuthDal = {
  GetUser: async (query, params) =>await managmentUsers.findOne(query).populate("designation","_id internal_id designation").lean().select(params),
  UpdateUser: async (filter,update) => await managmentUsers.updateOne(filter,update),
};

module.exports = ManagementAuthDal;
