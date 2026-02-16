const { AdminService } = require("../../service");
const { StatusCodes } = require("http-status-codes");
const { CONSTANTS_MESSAGES } = require("../../Helper");
const { ResponseHandler } = require("../../Utils");
const AdminAuthController = {
  Login: async (req, res) => {
    const body = req.body;
    const data = await AdminService.Login(body);
    res.header("Authorization", `Bearer ${data.token}`);
    res.header("isAdmin", 1);
    res.header("user_id", data._id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  SignUp: async (req, res) => {
    const body = req.body;
    const data = await AdminService.SignUp(body);
    res.header("Authorization", `Bearer ${data.token}`);
    res.header("isAdmin", 1);
    res.header("user_id", data._id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  Logout: async (req, res) => {
    const data = await AdminService.Logout(req.token, req.admin._id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },
};

module.exports = AdminAuthController;
