const { ManagementService } = require("../../service");
const { StatusCodes } = require("http-status-codes");
const { CONSTANTS_MESSAGES } = require("../../Helper");
const { ResponseHandler } = require("../../Utils");

const ManagementAuthController = {
  Login: async (req, res) => {
    const body = req.body;
    const data = await ManagementService.Login(body);
    res.header("Authorization", `Bearer ${data.token}`);
    res.header("user_id", data.user_id);
    res.header("designation", data.designation);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  Logout: async (req, res) => {
    const data = await ManagementService.Logout(req.token, req.managmentUser._id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

};

module.exports = ManagementAuthController;
