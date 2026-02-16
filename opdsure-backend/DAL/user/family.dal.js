const { family } = require("../../models");

const FamilyDAL= {

  AddMember: async (data) => await family.create(data),

  GetMembers: async (query) => await family.find(query).lean(),

  GetMember: async (query) => await family.findOne(query),

  UpdateMember: async (filter,update) => await family.updateOne(filter,update),

  DeleteMember: async (query) => await family.findOneAndDelete(query),

  GetCount: async (query) => await family.find(query).countDocuments(),

  DeleteManyMembers: async (query) => await family.deleteMany(query),


};

module.exports = FamilyDAL;
