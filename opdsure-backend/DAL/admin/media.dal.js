const { media } = require("../../models");

const MediaDal = {

  GetAllMedias: async (query, params,pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await media.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize)).lean();
  },

  FindOneMedia : async (query, params) => await media.findOne(query).select(params).lean(),

  GetRecordCount : async(query)=> await media.find(query).countDocuments(),

  CreateMedia: async (query) => await media.create(query),

  EditMedia : async (filter,update) => await media.findOneAndUpdate(filter,update),

  DeleteMedia : async (query) => await media.findOneAndDelete(query),

};

module.exports = MediaDal;