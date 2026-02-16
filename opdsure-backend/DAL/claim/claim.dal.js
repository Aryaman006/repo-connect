const { claim } = require("../../models");

const ClaimDAL = {

    AddClaim: async (data) => await claim.create(data),

    GetClaims: async (query, params, pagination) => {       
        const { offset, sortObject, pageSize } = pagination;
        return await claim.find(query)
            .select(params)
            .populate("member_id", "name _id relation")
            .populate("user_id", "name _id email subscriber_type") 
            .sort(sortObject)
            .lean();
    },
    UpdateClaimById : async (claimId, updatePayload) => {
        return await claim.findByIdAndUpdate(claimId, updatePayload, { new: true }).lean();
    },
    GetClaim: async (query, params) => await claim.findOne(query).populate("user_id","_id name email").lean().select(params),
    
    GetClaimCount : async(query)=> await claim.find(query).countDocuments(),

    EditClaimStatus : async (filter,update) => await claim.findOneAndUpdate(filter, update),

    RaiseClaimDispute : async (filter,update) => await claim.findOneAndUpdate(filter, update),

    DeleteClaim: async (query) => await claim.findOneAndDelete(query),

};

module.exports = ClaimDAL;
