const { googleReviews } = require("../models");

const GoogleReviewsDal = {

  GetAllReviews: async (query, params,pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await googleReviews.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize)).lean();
  },

  FindOneReview : async (query, params) => await googleReviews.findOne(query).select(params).lean(),

  GetRecordCount : async(query)=> await googleReviews.find(query).countDocuments(),

  CreateReview: async (query) => await googleReviews.create(query),

  EditReview : async (filter,update) => await googleReviews.findOneAndUpdate(filter,update),

  DeleteReview : async (query) => await googleReviews.findOneAndDelete(query),

};

module.exports = GoogleReviewsDal;