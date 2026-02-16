const { coupons } = require("../../models");

const CouponDal = {
    
    GetAllCoupons : async (query, params, pagination ) => {        
        const { offset, sortObject, pageSize } = pagination;
        return await coupons.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize))
    },

    GetAllCouponsList : async () => {        
        return await coupons.find()
    },

    GetCoupon : async (query,params) => await coupons.findOne(query).select(params).lean(),

    CreateMultipleCoupons: async (query) => await coupons.insertMany(query),

    GetRecordCount : async (query) => await coupons.find(query).countDocuments(),

    CreateCoupon : async (query) => await coupons.create(query),
    
    EditCoupon : async (filter,update) => await coupons.findOneAndUpdate(filter, update),

    DeleteCoupon : async (query) => await coupons.findOneAndDelete(query),

};

module.exports = CouponDal;