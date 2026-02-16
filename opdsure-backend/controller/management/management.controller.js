const { AdminService, ManagementService } = require("../../service");
const { StatusCodes } = require("http-status-codes");
const { CONSTANTS_MESSAGES } = require("../../Helper");
const { ResponseHandler } = require("../../Utils");
const ManagementController = {

    GetClaims: async (req, res) => {
        const data = await ManagementService.GetClaims(req.query,req.managmentUser)
        ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
    },

    GetAllClaims: async (req, res) => {
        const data = await ManagementService.GetAllClaims(req.query)
        ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
    },

    GetClaim: async (req, res) => {
        const { _id } = req.managmentUser;
        const data = await ManagementService.GetClaim(_id, req.query.id)
        ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
    },
    UpdateClaimBills: async (req, res) => {
        const result = await ManagementService.UpdateClaimBills(req.body);
        ResponseHandler(res, StatusCodes.OK, result, true, CONSTANTS_MESSAGES.UPDATED);
    },

    UpdateClaim: async (req, res) => {
        const data = await ManagementService.UpdateClaim(req.body, req.params.id, req.managmentUser);
        ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
    },
    
    GetDisputedClaims: async (req, res) => {
        const data = await ManagementService.GetDisputedClaims(req.query, req.managmentUser)
        ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
    },

    GetDisputedClaim: async (req, res) => {
        const { _id } = req.managmentUser;
        const data = await ManagementService.GetDisputedClaim(_id, req.params.id)
        ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
    },

    ClaimDisputeAction: async (req, res) => {
        const data = await ManagementService.ClaimDisputeAction(req.body, req.params.id, req.managmentUser);
        ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
    },

    GetProfile: async (req, res) => {
        const data = await ManagementService.GetProfile(req.managmentUser._id);
        ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
    },

    GetHealthTests: async (req, res) => {
        const data = await ManagementService.GetHealthTests(req.query);
        ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
    },

    PayClaimAmount: async (req, res) => {
        const data = await ManagementService.PayClaimAmount(req.managmentUser, req.body);
        ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
    },

    PayDisputedClaimAmount: async (req, res) => {
        const data = await ManagementService.PayDisputedClaimAmount(req.managmentUser, req.params.id);
        ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
    },

    GetVerifiers: async (req, res) =>{
        const data = await ManagementService.GetVerifiers();
        ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
    },

   UpdateClaimVerifier : async (req, res) => {
    const data = await ManagementService.UpdateClaimVerifier(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetNotifications: async (req,res) => {
    const data = await ManagementService.GetNotifications(req.managmentUser._id,req.query)
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
},

  DeleteNotification: async (req,res) => {
    const data = await ManagementService.DeleteNotification(req.params.id)
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  ResetManagPassword: async (req, res) => {
    const data = await ManagementService.ResetManagPassword(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  ResetManagPasswordDetails: async (req, res) => {
    const data = await ManagementService.ResetManagPasswordDetails(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },
  
  GetAllRegisteredUsers: async (req, res) => {
    const data = await ManagementService.GetAllRegisteredUsers(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetUsers: async (req, res) => {
      const data = await ManagementService.GetUsers();
      ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
   },

   GetAllReferedCorporates: async (req, res) => {
    const data = await ManagementService.GetAllReferedCorporates( req.query );
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
},

GetAllReferedCorporatesList: async (req, res) => {
  const data = await ManagementService.GetAllReferedCorporatesList( req.query );
  ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
},

GetAllReferedRetail: async (req, res) => {
    const data = await ManagementService.GetAllReferedRetail( req.query );
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllReferedRetailList: async (req, res) => {
    const data = await ManagementService.GetAllReferedRetailList( req.query );
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllReferedEmails: async (req, res) => {
    const data = await ManagementService.GetAllReferedEmails( req.query );
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },
};

module.exports = ManagementController;
