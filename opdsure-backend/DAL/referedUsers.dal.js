const { referedUsers } = require("../models");

const ReferedUsersDAL = {

    AddReferUsers: async (data) => await referedUsers.create(data),

    GetReferUsers: async (query, params, pagination ) => {       
    const { offset, sortObject, pageSize } = pagination;
    return await referedUsers.find(query).select(params).populate("user_id","name email country_code phone").sort(sortObject).skip(offset).limit(Number(pageSize));
    },

    GetReferUsersUser: async (query, params, pagination ) => {       
    const { offset, sortObject, pageSize } = pagination;
    return await referedUsers.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize));
    },

    GetReferedUser: async (query) => await referedUsers.findOne(query).lean(),

    GetRecorsCount: async (query) => await referedUsers.find(query).countDocuments(),

    EditReferUsers: async (filter,update) => await referedUsers.findOneAndUpdate(filter,update),

    DeleteReferUser: async (query) => await referedUsers.findOneAndDelete(query),

};

module.exports = ReferedUsersDAL;