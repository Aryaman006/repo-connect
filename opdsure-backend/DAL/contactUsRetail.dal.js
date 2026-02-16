const { contactUsRetails } = require("../models");

const ContactUsRetailDAL = {

    AddReferUsers: async (data) => await contactUsRetails.create(data),

    GetReferUsers: async (query, params, pagination ) => {       
        const { offset, sortObject, pageSize } = pagination;
        return await contactUsRetails.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize));
    },
    GetAllReferedRetailList: async () => {       
        return await contactUsRetails.find();
    },

    GetReferedUser: async (query) => await contactUsRetails.findOne(query).lean(),

    GetRecordsCount: async (query) => await contactUsRetails.find(query).countDocuments(),

    EditReferUsers: async (filter,update) => await contactUsRetails.findOneAndUpdate(filter,update),

    DeleteReferUser: async (query) => await contactUsRetails.findOneAndDelete(query),

};

module.exports = ContactUsRetailDAL;