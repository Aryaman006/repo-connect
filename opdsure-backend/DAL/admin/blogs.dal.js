const { blogs } = require("../../models");

const BlogsDal = {

  GetAllBlogs: async (query, params,pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await blogs.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize)).lean();
  },

  FindOneBlog : async (query, params) => await blogs.findOne(query).select(params).lean(),

  GetRecordCount : async(query)=> await blogs.find(query).countDocuments(),

  CreateBlog: async (query) => await blogs.create(query),

  EditBlog : async (filter,update) => await blogs.findOneAndUpdate(filter,update),

  DeleteBlog : async (query) => await blogs.findOneAndDelete(query),

};

module.exports = BlogsDal;