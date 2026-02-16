const { tests } = require("../../models");

const TestDal = {
  GetAllTest: async (query, params,pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await tests.find(query).select(params).populate("plan").sort(sortObject).skip(offset).limit(Number(pageSize));
  },
  GetRecordCount : async(query)=> await tests.find(query).countDocuments(),
  CreateTest: async (query) => await tests.create(query),
  EditTest: async (filter,update) => await tests.findOneAndUpdate(filter,update),
  DeleteTest: async (query) => await tests.findOneAndDelete(query),
};

module.exports = TestDal;
