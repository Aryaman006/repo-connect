const { tc } = require("../../models");

const TCDal = {
  GetTC: async (query) => await tc.find(query),
  GetOneTC: async (query) => await tc.findOne(query),
  EditTC: async (filter,update) => await tc.findOneAndUpdate(filter,update),
  
};

module.exports = TCDal;
