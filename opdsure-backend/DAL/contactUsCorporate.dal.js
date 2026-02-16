const { contactUsCorporates } = require("../models");

const ContactUsCorporateDAL = {

    AddReferUsers: async (data) => await contactUsCorporates.create(data),

    GetReferUsers: async (query, params, pagination ) => {       
        const { offset, sortObject, pageSize } = pagination;
        return await contactUsCorporates.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize));
    },

    GetAllReferedCorporatesList: async ( ) => {      
        return await contactUsCorporates.find();
    },

    GetReferedUser: async (query) => await contactUsCorporates.findOne(query).lean(),

    GetRecordsCount: async (query) => await contactUsCorporates.find(query).countDocuments(),

    EditReferUsers: async (filter,update) => await contactUsCorporates.findOneAndUpdate(filter,update),

    DeleteReferUser: async (query) => await contactUsCorporates.findOneAndDelete(query),

};

module.exports = ContactUsCorporateDAL;