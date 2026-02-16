const { managementNotifications } = require("../../models");

const ManagementNotificationsDAL = {

    AddNotification: async (data) => await managementNotifications.create(data),

    GetAllNotifications: async (query, params, pagination ) => {       
        const { offset, sortObject, pageSize } = pagination;
        return await managementNotifications.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize));
    },

    GetRecordsCount: async (query) => await managementNotifications.find(query).countDocuments(),

    EditNotifications: async (filter,update) => await managementNotifications.findOneAndUpdate(filter,update),

    DeleteNotifications: async (query) => await managementNotifications.findOneAndDelete(query),

};

module.exports = ManagementNotificationsDAL;