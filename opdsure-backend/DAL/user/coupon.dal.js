const { family } = require("../../models");

const CouponDAL= {

  CheckCouponValidity: async (query) => await coupon.findOne(query).lean(),

};

module.exports = CouponDAL;
