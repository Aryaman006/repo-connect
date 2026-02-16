const { disputedClaims } = require("../../models");

const DisputedClaimsDAL = {

    GetDisputeClaims: async (query, params, pagination ) => {       
        const { offset, sortObject, pageSize } = pagination;
        return await disputedClaims.find(query).select(params)
        .populate({path:"original_claim_id",
                        populate:{
                            path:"member_id",
                            select  :"name phone country_code"
                        },
        })
        .sort(sortObject)
    },

    GetDisputeClaim: async (query, params) => await disputedClaims.findOne(query).select(params).populate(
        {path:"original_claim_id" ,
         select: "-internal_status -remark -createdAt -updatedAt -__v -assigned_to_manager -assigned_to_financer -assigned_to_verifier -verifier -manager -financer -subscriber_reaction -resubmission",
        populate:[{
            path:"member_id",
            select  :"name phone country_code email"
            },
            {
                path:"user_id",
                select  :"name phone country_code email"
            }],
        }).lean(),

    GetDisputeClaimManagement: async (query, params) => await disputedClaims.findOne(query).select(params).populate(
            {path:"original_claim_id" ,
             select: "-internal_status -createdAt -updatedAt -__v -assigned_to_manager -assigned_to_financer -assigned_to_verifier -verifier -manager -financer -subscriber_reaction -resubmission",
            populate:[{
                path:"member_id",
                select  :"name phone country_code email"
                },
                {
                    path:"user_id",
                    select  :"name phone country_code email"
                }],
    }).lean(),
    
    RaiseClaimDispute : async (data) => await disputedClaims.create(data),

    GetClaimCount : async(query)=> await disputedClaims.find(query).countDocuments(),

    EditClaimStatus : async (filter,update) => await disputedClaims.findOneAndUpdate(filter, update),

    Aggregate: async (pipeline) => await disputedClaims.aggregate(pipeline).exec(),

}

module.exports = DisputedClaimsDAL;