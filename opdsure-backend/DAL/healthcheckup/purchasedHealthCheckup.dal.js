const { purchasedHealthCheckupPlans } = require("../../models");

const PurchasedHealthCheckupDal = {

  CreatePurchasedHealthCheck: async (query) =>await purchasedHealthCheckupPlans.create(query),

  GetPurchasedHealthCheck: async (query, params) =>await purchasedHealthCheckupPlans.findOne(query).select(params).lean(),

  GetLatestPurchasedHealthCheck: async () =>await purchasedHealthCheckupPlans.findOne().select().sort({ createdAt: -1 }).limit(1).lean(),
  
  GetPurchasedHealthChecks: async (query, params, pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await purchasedHealthCheckupPlans.find(query)
    .populate("health_plan","name base_price parameters test_details discounted_price")
    .select(params).sort(sortObject).skip(offset).limit(Number(pageSize));    
  },

  GetPurchasedHealthChecksAdmin: async (query, params, pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await purchasedHealthCheckupPlans.find(query)
    .populate("health_plan","name base_price discounted_price")
    .populate("user","_id name email country_code phone unique_id")
    .select(params).sort(sortObject).skip(offset).limit(Number(pageSize));    
  },
  
  GetCount: async (query) =>await purchasedHealthCheckupPlans.find(query).countDocuments(),

  CreatePurchasedHealthCheck: async (query) => await purchasedHealthCheckupPlans.create(query),

  EditPurchasedHealthCheck: async (filter,update) => await purchasedHealthCheckupPlans.findOneAndUpdate(filter,update),

  aggregate: async (query) => await purchasedHealthCheckupPlans.aggregate(query),

};

module.exports = PurchasedHealthCheckupDal;
