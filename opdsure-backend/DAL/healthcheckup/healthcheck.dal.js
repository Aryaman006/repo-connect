const { healthcheck, tests } = require("../../models");

const HealthCheckDal = {

  GetTestList: async (query, params) => await tests.find(query).select(params),

  GetHealthCheck: async (query, params) =>await healthcheck.findOne(query).select(params),

  GetHealthChecks: async (query, params) =>await healthcheck.find(query).populate({ path: 'families', options: { strictPopulate: false } }).select(params).exec(),
  
  GetCount: async (query, params) =>await healthcheck.find(query).select(params).countDocuments(),

  CreateHealthCheck: async (query) => await healthcheck.create(query),

  aggregate: async (query) => await healthcheck.aggregate(query),

  EditHealthCheck : async (filter,update) => await healthcheck.findOneAndUpdate(filter,update),

};

module.exports = HealthCheckDal;
