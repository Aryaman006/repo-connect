const { events } = require("../../models");

const EventsDal = {

  GetAllEvents: async (query, params,pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await events.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize)).lean();
  },

  FindOneEvent : async (query, params) => await events.findOne(query).select(params).lean(),

  GetRecordCount : async(query)=> await events.find(query).countDocuments(),

  CreateEvent: async (query) => await events.create(query),

  EditEvent : async (filter,update) => await events.findOneAndUpdate(filter,update),

  DeleteEvent : async (query) => await events.findOneAndDelete(query),

};

module.exports = EventsDal;