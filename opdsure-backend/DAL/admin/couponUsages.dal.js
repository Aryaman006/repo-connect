const { couponUsages } = require("../../models");

const CouponUsagesDal = {
    
    GetAllCouponsUsages: async (query, params, pagination) => {
        const { offset, sortObject, pageSize } = pagination;
        return await couponUsages
          .find(query)
          .select(params)
          .populate("user", "name email phone country_code")
          .populate("plan", "name subscriber_type corporate")
          .populate("health_plan", "name")
          .populate("coupon", "coupon_code discount_type discount coupon_type corporate usage_type")
          .sort(sortObject)
          .skip(offset)
          .limit(Number(pageSize))
          .lean();
      },
      
      GetCouponsUsage: async (query) => await couponUsages.findOne(query).lean(),
      
      GetRecordCount: async (query) => await couponUsages.find(query).countDocuments(),
      

    CreateCouponUsage : async (query) => await couponUsages.create(query),

    Aggregate: async (query) => await couponUsages.aggregate(query),
    
};

module.exports = CouponUsagesDal;