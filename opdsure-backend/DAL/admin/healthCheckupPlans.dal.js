const { healthCheckupPlans } = require("../../models");

const HealthCheckupPlansDal = {
  GetAllHealthCheckupPlans: async (query, params,pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await healthCheckupPlans.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize));    
  },
  GetHealthCheckupPlan: async (query, params) => await healthCheckupPlans.findOne(query),
  GetRecordCount : async(query)=> await healthCheckupPlans.find(query).countDocuments(),
  CreateHealthCheckupPlan: async (query) => await healthCheckupPlans.create(query),
  EditHealthCheckupPlan: async (filter,update) => await healthCheckupPlans.findOneAndUpdate(filter,update),
  CheckUnique: async (query) => await healthCheckupPlans.findOne(query).lean(),
  DeleteHealthCheckupPlan: async (query) => await healthCheckupPlans.findOneAndDelete(query),
};

module.exports = HealthCheckupPlansDal;
