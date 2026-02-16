const { corporates } = require("../../models");

const CorpoDal = {
  GetAllCorpo: async (query, params,pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await corporates.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize));    
  },
  GetAllCorpoUsers: async () => {
    return await corporates.find();    
  },
  GetRecordCount : async(query)=> await corporates.find(query).countDocuments(),
  CreateCorpo: async (query) => await corporates.create(query),
  EditCorpo: async (filter,update) => await corporates.findOneAndUpdate(filter,update),
  CheckUniqueName: async (query) => await corporates.findOne(query),
  DeleteCorpo: async (query) => await corporates.findOneAndDelete(query),
  GetCorporateById: async (id) => {
    return await corporates.findById(id).select('_id name email contact_person');
  },
};

module.exports = CorpoDal;
