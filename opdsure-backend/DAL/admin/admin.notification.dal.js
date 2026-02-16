const { adminNotifications } = require("../../models");

const AdminNotificationsDAL = {

    AddNotification: async (data) => await adminNotifications.create(data),

    GetAllNotifications: async (query, params, pagination ) => {       
        const { offset, sortObject, pageSize } = pagination;
        return await adminNotifications.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize));
    },

    GetRecordsCount: async (query) => await adminNotifications.find(query).countDocuments(),

    EditNotifications: async (filter,update) => await adminNotifications.findOneAndUpdate(filter,update),

    DeleteNotifications: async (query) => await adminNotifications.findOneAndDelete(query),

};

module.exports = AdminNotificationsDAL;