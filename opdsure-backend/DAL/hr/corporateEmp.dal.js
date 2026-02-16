const {corpoEmps, tempCorpoEmps} = require("../../models");

const CorpoEmpDal = {

    GetAllCorpoEmp : async (query, params, pagination) =>{
        const { offset, sortObject, pageSize } = pagination;
        return await corpoEmps.find(query).populate("corporate","-createdAt -updatedAt -__v").select(params).sort(sortObject).skip(offset).limit(Number(pageSize));
    },
    GetRecordCount : async (query) => await corpoEmps.find(query).countDocuments(),
    CreateCorpoEmp : async (query) => await corpoEmps.create(query),
    AddBulkCorpoEmp : async (query) => await corpoEmps.insertMany(query),
    CheckUnique : async (query) => await corpoEmps.findOne(query),
    EditCorpoEmp : async (filter,update) => await corpoEmps.findOneAndUpdate(filter,update),
    CreateTempFailedCorpoEmp : async (query) => await tempCorpoEmps.create(query),
    GetAllFailedInsertsCorpoEmp: async (query,params) => await tempCorpoEmps.find(query).populate("corporate","_id name"),
    DeleteFailedInsertsCorpoEmp: async (query) => await tempCorpoEmps.deleteMany(query),
}

module.exports = CorpoEmpDal;