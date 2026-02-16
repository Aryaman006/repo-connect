const { plans, tests } = require("../../models");

const PlanDal = {
  GetAllPlan: async (query, params,pagination) => {
    return await plans.find(query).select(params).populate("corporate","_id name").lean();
  },

  GetPlan: async (query, params) => await plans.findOne(query).select(params).populate("corporate","_id name").lean(),

  CheckUniqueName : async(query) => await plans.findOne(query),

  GetRecordCount : async(query)=> await plans.find(query).countDocuments(),

  CreatePlan: async (query) => await plans.create(query),

  EditPlan: async (filter,update) => await plans.findOneAndUpdate(filter,update),

  CheckChildTest: async(query) => await tests.countDocuments(query),
  
  DeletePlan: async (query) => await plans.findOneAndDelete(query),
};

module.exports = PlanDal;
