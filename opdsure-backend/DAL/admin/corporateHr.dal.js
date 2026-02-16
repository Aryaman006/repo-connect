const { corporateHr } = require("../../models");

const CorporateHrDAL = {

    GetAllCorporateHr: async (query, params, pagination) => {
        const { offset, sortObject, pageSize } = pagination;
        return await corporateHr.find(query).select(params).sort(sortObject).populate("corporate").skip(offset).limit(Number(pageSize));
    },

    Find : async (query, params) => await corporateHr.findOne(query).select(params),

    GetRecordCount : async(query)=> await corporateHr.find(query).countDocuments(),

    CreateCorporateHr: async (query) => await corporateHr.create(query),

    EditCorporateHr : async (filter,update) => await corporateHr.findOneAndUpdate(filter,update),

    DeleteCorporateHr : async (query) => await corporateHr.findOneAndDelete(query),
    
    GetById: async (id) => {
        return await corporateHr.findById(id).select('corporate');
    },
};
  
  
module.exports = CorporateHrDAL;

