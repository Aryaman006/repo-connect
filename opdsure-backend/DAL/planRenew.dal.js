const { planRenewList } = require("../models");

const PlanRenewDal = {

    Create: async (data) => await planRenewList.create(data),

    GetQueuedPlans: async (query,params,pagination) => {
        const {offset,sortObject,pageSize} = pagination;
        return await planRenewList.find(query).populate("plan_id","").select(params).sort(sortObject).skip(offset).limit(Number(pageSize)).lean();
    },

    GetRecordCount : async(query)=> await planRenewList.find(query).countDocuments(),

    UpdateQueuedPlan: async(filter,update)=> await planRenewList.updateOne(filter,update),


};

module.exports = PlanRenewDal;
