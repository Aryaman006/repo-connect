const { userNotifications } = require("../../models");

const UserNotificationsDAL = {

    AddNotification: async (data) => await userNotifications.create(data),

    GetAllNotifications: async (query, params, pagination ) => {       
        const { offset, sortObject, pageSize } = pagination;
        return await userNotifications.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize));
    },

    GetRecordsCount: async (query) => await userNotifications.find(query).countDocuments(),

    EditNotifications: async (filter,update) => await userNotifications.findOneAndUpdate(filter,update),

    DeleteNotifications: async (query) => await userNotifications.findOneAndDelete(query),

};

module.exports = UserNotificationsDAL;