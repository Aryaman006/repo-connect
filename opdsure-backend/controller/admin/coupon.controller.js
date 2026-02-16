const { AdminService } = require("../../service");
const { StatusCodes } = require("http-status-codes");
const { CONSTANTS_MESSAGES } = require("../../Helper");
const { ResponseHandler, CreateAuditTrail } = require("../../Utils");
const { CONSTANTS } = require("../../Constant/")

const CouponController = {
  GetAll: async (req, res) => {
    const data = await AdminService.GetAllCoupons(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
},

GetAllCouponsList: async (req, res) => {
  const data = await AdminService.GetAllCouponsList(req.query);
  ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
},

  Add: async (req, res) => {
    const data = await AdminService.AddCoupon({...req.body});
    await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.COUPONS);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
},

  Edit: async (req, res) => {
    const data = await AdminService.EditCoupon({...req.body,...req.params});
    await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.COUPONS);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS); 
},

  Delete: async (req, res) => {
    const data = await AdminService.DeleteCoupon(req.params);
    await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.COUPONS);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS); 
    }, 
};

module.exports = CouponController;
