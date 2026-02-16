const { AdminService } = require("../../service");
const { StatusCodes } = require("http-status-codes");
const { CONSTANTS_MESSAGES } = require("../../Helper");
const { ResponseHandler, CreateAuditTrail } = require("../../Utils");
const { CONSTANTS } = require("../../Constant/");

const CorpoController = {

  GetAll: async (req, res) => {
    const {
      search="",
      page = 1,
      pageSize = 10,
      sortBy = "name",
      sortStateBy = "state",
      sortOrder = -1,
      stateSortOrder = -1
    } = req.query;
    const data = await AdminService.GetAllCorpo({search,page,pageSize,sortBy,sortStateBy,sortOrder,stateSortOrder});
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllCorpoUsers: async (req, res) => {
    const resp = await AdminService.GetAllCorpoUsers(req.query);
    ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  Add: async (req, res) => {
    const data = await AdminService.AddCorpo(req.body);
    await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE.value);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  Edit: async (req, res) => {
    const data = await AdminService.EditCorpo(req.body,req.params.id);
    await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE.value);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  Delete: async (req, res) => {
    const data = await AdminService.DeleteCorpo(req.params.id);
    await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE.value);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },
 
};

module.exports = CorpoController;
