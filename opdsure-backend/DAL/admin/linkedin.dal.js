const { linkedin } = require("../../models");

const LinkedinDal = {

  GetAllPosts: async (query, params,pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await linkedin.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize)).lean();
  },

  FindOnePost : async (query, params) => await linkedin.findOne(query).select(params).lean(),

  GetRecordCount : async(query)=> await linkedin.find(query).countDocuments(),

  CreatePost: async (query) => await linkedin.create(query),

  EditPost : async (filter,update) => await linkedin.findOneAndUpdate(filter,update),

  DeletePost : async (query) => await linkedin.findOneAndDelete(query),

};

module.exports = LinkedinDal;