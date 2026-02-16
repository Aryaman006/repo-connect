const { HRService } = require("../../service");
const { StatusCodes } = require("http-status-codes");
const { CONSTANTS_MESSAGES } = require("../../Helper");
const { ResponseHandler } = require("../../Utils");
const { CONSTANTS } = require("../../Constant");
const HRAuthController = {
  
  Login: async (req, res) => {
    const body = req.body;
    const data = await HRService.Login(body);
    res.header("Authorization", `Bearer ${data.token}`);
    res.header("user_id",data.user_id);
    res.header("role",CONSTANTS.USER_ROLES.HR_USER);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  Logout: async (req, res) => {
    const data = await HRService.Logout(req.token, req.user._id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetProfile: async (req, res) => {
    const { _id } = req.user
    const data = await HRService.GetProfile(_id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  ForgotPassword: async(req, res) => {
    const email = req.body;
    const data = await HRService.ForgotPassword(email);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.FORGOT_PASSWORD);
  },

  UpdatePassword: async(req, res) => {
    const data = await HRService.ResetCorporateHrPass(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

};

module.exports = HRAuthController;
