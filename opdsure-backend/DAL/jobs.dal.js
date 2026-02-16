const { jobs } = require("../models");

const JobsDal = {

  GetAllJobs: async (query, params,pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await jobs.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize)).lean();
  },

  FindOneJob : async (query, params) => await jobs.findOne(query).select(params).lean(),

  GetRecordCount : async(query)=> await jobs.find(query).countDocuments(),

  CreateJob: async (query) => await jobs.create(query),

  EditJob : async (filter,update) => await jobs.findOneAndUpdate(filter,update),

  DeleteJob : async (query) => await jobs.findOneAndDelete(query),

};

module.exports = JobsDal;