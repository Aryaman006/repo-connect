const { doctors } = require("../../models");
const DoctorsFromClaims = require("../../models/doctorfromclaims.model.js");
const mongoose = require("mongoose");


const DoctorDal = {

  GetAllDoc: async (query, params,pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await doctors.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize));
  },

  GetAllDocFromClaims: async (query, params,pagination) => {
    const {offset,sortObject,pageSize} = pagination;
    return await DoctorsFromClaims.find(query).select(params).sort(sortObject).skip(offset).limit(Number(pageSize));
  },

  GetRecordCountFromClaims : async(query)=> await DoctorsFromClaims.find(query).countDocuments(),

  GetAllDoctorList: async () => {
    return await doctors.find();
  },

  GetAllDocFromClaimsList: async () => {
    return await DoctorsFromClaims.find();
  },

  GetDoctorDetails: async (id) => {
    try {
        const query = mongoose.Types.ObjectId.isValid(id)
            ? { _id: new mongoose.Types.ObjectId(id) } // Convert to ObjectId
            : { id }; // If stored as a string, query directly

        return await DoctorsFromClaims.findOne(query);
    } catch (error) {
        console.error("Invalid user_id format:", id);
        return null;
    }
},

  CheckUniqueRegNo : async(query) => await doctors.findOne(query),

  FindOneDoc : async (query, params) => await doctors.findOne(query).select(params),

  GetRecordCount : async(query)=> await doctors.find(query).countDocuments(),

  CreateDoc: async (query) => await doctors.create(query),

  EditDoc : async (filter,update) => await doctors.findOneAndUpdate(filter,update),

  DeleteDoc : async (query) => await doctors.findOneAndDelete(query),

};

module.exports = DoctorDal;