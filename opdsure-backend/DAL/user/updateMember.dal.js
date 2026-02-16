const { updateMember } = require("../../models");

const UpdateMemberDAL= {

  AddMemberRequest: async (data) => await updateMember.create(data),

  GetMembersRequest: async (query,params,pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await updateMember.find(query).select(params).populate("user_id","_id email name phone country_code gender dob address pin_code state").sort(sortObject).skip(offset).limit(Number(pageSize)).lean();
  },

  GetMembersRequestByUser: async (query, params) => await updateMember.find(query).select(params),

  GetMemberRequest: async (query) => await updateMember.findOne(query),

  GetMembersCount: async (query) => await updateMember.find(query).countDocuments(),

  UpdateMemberRequest: async (filter,update) => await updateMember.updateOne(filter,update),

  DeleteMemberRequest: async (query) => await updateMember.findOneAndDelete(query)

};

module.exports = UpdateMemberDAL;
