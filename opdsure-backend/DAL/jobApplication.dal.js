const { jobApplications } = require("../models");

const JobApplicationDal = {

  GetAllApplications: async (query, params,pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await jobApplications.find(query).select(params).populate("job").sort(sortObject).skip(offset).limit(Number(pageSize)).lean();
  },

  FindOneApplication : async (query, params) => await jobApplications.findOne(query).select(params).lean(),

  GetRecordCount : async(query)=> await jobApplications.find(query).countDocuments(),

  CreateApplication: async (query) => await jobApplications.create(query),

  EditApplication : async (filter,update) => await jobApplications.findOneAndUpdate(filter,update),

  DeleteApplication : async (query) => await jobApplications.findOneAndDelete(query),

};

module.exports = JobApplicationDal;