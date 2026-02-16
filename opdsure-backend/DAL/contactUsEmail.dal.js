const { contactUsEmails } = require("../models");

const ContactUsEmailDAL = {

    AddReferUsers: async (data) => await contactUsEmails.create(data),

    GetReferUsers: async (query, params, pagination ) => {       
        const { offset, sortObject, pageSize } = pagination;
        return await contactUsEmails.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize));
    },

    GetReferedUser: async (query) => await contactUsEmails.findOne(query).lean(),

    GetRecordsCount: async (query) => await contactUsEmails.find(query).countDocuments(),

    EditReferUsers: async (filter,update) => await contactUsEmails.findOneAndUpdate(filter,update),

    DeleteReferUser: async (query) => await contactUsEmails.findOneAndDelete(query),

};

module.exports = ContactUsEmailDAL;