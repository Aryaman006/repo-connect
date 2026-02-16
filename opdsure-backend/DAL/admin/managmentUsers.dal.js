const { query } = require("express");
const { managmentUsers } = require("../../models");

const ManagmentUsersDal = {
  GetAllUsers: async (query, params, pagination) => {

    const { offset, sortObject, pageSize } = pagination;
    return await managmentUsers.find(query).select(params).populate("designation").sort(sortObject).skip(offset).limit(Number(pageSize));

  },
  GetUser: async (query, params) => await managmentUsers.findOne(query).populate("designation").select(params),
  GetVerifierUsers: async (query, params) => await managmentUsers.find(query).populate("designation").select(params),
  GetUsers: async (query) => await managmentUsers.find(query).sort("createdAt"),
  GetRecordCount: async (query) => await managmentUsers.find(query).countDocuments(),
  CreateUser: async (query) => await managmentUsers.create(query),
  EditUser: async (filter,update) => await managmentUsers.findOneAndUpdate(filter,update),
  EditUserPass: async (filter,update) => await managmentUsers.findOneAndUpdate(filter,update),
  DeleteUser: async (query) => await managmentUsers.findOneAndDelete(query),
};

module.exports = ManagmentUsersDal;
