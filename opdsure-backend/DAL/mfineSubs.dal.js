const { MfineSubs } = require("../models");

const MfineSubsDal = {

  CheckSubscription : async (query, params) => await MfineSubs.findOne(query).select(params).lean(),

  CreateSubscription: async (query) => await MfineSubs.create(query),

};

module.exports = MfineSubsDal;