const { specializations } = require("../../models");

const SpecializationDal = {
  GetAllSpecialization: async (query, params,pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await specializations.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize));
  },
  CheckUnique : async (query) => await specializations.findOne(query),
  GetRecordCount : async(query)=> await specializations.find(query).countDocuments(),
  CreateSpecialization: async (query) => await specializations.create(query),
  EditSpecialization: async (filter,update) => await specializations.findOneAndUpdate(filter,update),
  DeleteSpecialization: async (query) => await specializations.findOneAndDelete(query),
};

module.exports = SpecializationDal;
