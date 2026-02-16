const { faqs } = require("../../models");

const FaqDal = {
  GetAllFaqs: async (query, params, pagination) => {
    const { offset, sortObject, pageSize } = pagination;
    return await faqs.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize));
  },
  
  CheckUniqueFaq: async (query) => await faqs.findOne(query),

  CreateFaq: async (query) => await faqs.create(query),

  EditFaq: async (filter, update) => await faqs.findOneAndUpdate(filter, update),

  GetRecordCount : async(query)=> await faqs.find(query).countDocuments(),

  DeleteFaq: async (query) => await faqs.findOneAndDelete(query),
};

module.exports = FaqDal;
