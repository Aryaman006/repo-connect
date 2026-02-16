const { HRService } = require("../../service");
const { StatusCodes } = require("http-status-codes");
const { CONSTANTS_MESSAGES } = require("../../Helper");
const { ResponseHandler } = require("../../Utils");
const HRController = {

    GetAllCorporateEmp: async (req, res) => {
        const resp = await HRService.GetAllCorpoEmp(req.user.corporate,req.query);
        ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
      },
    
      AddCorporateEmp: async (req, res) => {
        const resp = await HRService.AddCorpoEmp(req.user,req.body);
        ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
      },
    
      AddBulkCorporateEmp: async (req, res) => {    
        const resp = await HRService.AddBulkCorpoEmp(req.user.corporate, req.body);
        ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
      },
    
      EditCorporateEmp: async (req, res) => {
        const resp = await HRService.EditCorpoEmp(req.user.corporate,req.body,req.params.id);
        ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
      },

      DeleteCorpoEmp: async (req, res) => {
        const data = await HRService.DeleteCorpoEmp(req.params.id);
        ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
      },

      ResetCorporateEmpPass: async (req, res) => {
        const resp = await HRService.ResetCorporateEmpPass(req.user.corporate,req.params.id,req.body);
        ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
      },
    
      GetAllFailedInsertsCorporateEmp: async (req, res) => {
        const resp = await HRService.GetAllFailedInsertsCorpoEmp(req.user.corporate);
        ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
      },
      DeleteAllFailedInsertsCorporateEmp: async (req, res) => {
        const resp = await HRService.DeleteAllFailedInsertsCorpoEmp(req.user.corporate);
        ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
      },

  GetCorporatePlanByUserId: async (req, res) => {
    const { user_id } = req.params;
    const data = await HRService.GetCorporatePlanByUserId(user_id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

};

module.exports = HRController;
