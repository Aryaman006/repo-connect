const { user } = require("../../models");

const UserAuthDal = {

  GetAllUsers: async (query, params,pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await user.find(query).select(params).sort(sortObject).skip(offset)
    .populate({
      path: 'plan.id',
      select: 'name membership_options', 
    })
    .populate({
      path: 'corporate', 
      select: 'name', 
    })
    .limit(Number(pageSize)).lean().exec();
  },

  GetUsers: async () => {
    return await user.find()
  },

  GetUsersMan: async (query, params) => {
    return await user.find(query).select(params).lean().exec();
 },

  GetUser: async (query, params) =>await user.findOne(query).select(params).lean(),
  
  GetCount: async (query, params) =>await user.findOne(query).select(params).countDocuments(),

  CreateUser: async (query) => await user.create(query),

  UpdateUser: async (filter,update) => await user.updateOne(filter,update),

  DeleteUser: async (query) => await user.findOneAndDelete(query),
};

module.exports = UserAuthDal;
