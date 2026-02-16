const { AdminService } = require("../../service");
const { StatusCodes } = require("http-status-codes");
const { CONSTANTS_MESSAGES } = require("../../Helper");
const { ResponseHandler, CreateAuditTrail } = require("../../Utils");
const { CONSTANTS } = require("../../Constant");

const AdminController = {

  GetAllAdminUsers: async (req, res) => {
    const data = await AdminService.GetAllAdminUsers();
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllDocFromClaims: async (req, res) => {
    const data = await AdminService.GetAllDocFromClaims(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllDocFromClaimsList: async (req, res) => {
    const data = await AdminService.GetAllDocFromClaimsList(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllDoc: async (req, res) => {
    const data = await AdminService.GetAllDoctor(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllDoctorList: async (req, res) => {
    const data = await AdminService.GetAllDoctorList(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetDoctorFromClaimsDetails: async (req, res) => {
    const data = await AdminService.GetDoctorFromClaimsDetails(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },

  AddDoc: async (req, res) => {
    const data = await AdminService.AddDoctor(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditDoc: async (req, res) => {
    const data = await AdminService.EditDoctor(req.body,req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteDoc: async (req, res) => {
    const data = await AdminService.DeleteDoctor(req.params);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },
 
  GetAdminPrograms: async (req, res) => {
    const data = await AdminService.GetAdminPrograms();
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },
 
  GetGeneralPrograms: async (req, res) => {
    const data = await AdminService.GetGeneralPrograms();
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllPrivilege: async (req, res) => {
    const data = await AdminService.GetAllPrivilege(req.params);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetIndividualPrivilege: async (req, res) => {
    const data = await AdminService.GetIndividualPrivilege(req.params);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddPrivilege: async (req, res) => {
    const data = await AdminService.AddPrivilege(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditPrivilege: async (req, res) => {
    const data = await AdminService.EditPrivilege(req.body,req.params.user_id,Number(req.params.module_id));
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllAdminAuditTrail: async (req, res) => {
    const data = await AdminService.GetAllAdminAuditTrail(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },
  
  GetAllGeneralUsersAuditTrail: async (req, res) => {
    const data = await AdminService.GetAllGeneralUsersAuditTrail(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  UploadFile: async (req, res) => {
    const data = await AdminService.UploadFile(req.admin._id, req.files)
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },

  AddPlan: async (req, res) => {
    const data = await AdminService.AddPlan(req.body);
    await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.PLANS.value);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditPlan: async (req, res) => {
    const data = await AdminService.EditPlan(req.body, req.params.id);
    await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.PLANS.value);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeletePlan: async (req, res) => {
    const data = await AdminService.DeletePlan(req.params.id);
    await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.PLANS.value);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllManagmentUser: async (req, res) => {
    const data = await AdminService.GetAllManagmentUser(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddManagmentUser: async (req, res) => {
    const data = await AdminService.AddManagmentUser(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditManagmentUser: async (req, res) => {
    const data = await AdminService.EditManagmentUser(req.body,req.params.id);
    await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.USER.value);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditManagmentUserPass: async (req, res) => {
    const data = await AdminService.EditManagmentUserPass(req.body.password,req.params.id);
    await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.USER.value);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteManagmentUser: async (req, res) => {
    const data = await AdminService.DeleteManagmentUser(req.params.id);
    await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.USER.value);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddHealthCheckupPlan: async (req,res) => {
    const data = await AdminService.AddHealthCheckupPlan(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditHealthCheckupPlan: async (req,res) => {
    const data = await AdminService.EditHealthCheckupPlan(req.params.id, req.body);
    await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.HEALTH_CHECKUP_PLANS.value);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteHealthCheckupPlan: async (req,res) => {
    const data = await AdminService.DeleteHealthCheckupPlan(req.params.id);
    await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.HEALTH_CHECKUP_PLANS.value);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddSpecialization: async (req,res) => {
    const data = await AdminService.AddSpecialization(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditSpecialization: async (req,res) => {
    const data = await AdminService.EditSpecialization(req.params.id, req.body);
    await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.SPECIALIZATION.value);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteSpecialization: async (req,res) => {
    const data = await AdminService.DeleteSpecialization(req.params.id);
    await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.SPECIALIZATION.value);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllCorporateEmp: async (req, res) => {
    const resp = await AdminService.GetAllCorpoEmp(req.query);
    ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetCorporateEmp: async (req, res) => {
    const resp = await AdminService.GetCorpoEmp(req.query);
    ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddCorporateEmp: async (req, res) => {
    const resp = await AdminService.AddCorpoEmp(req.body);
    await CreateAuditTrail(req,resp,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE_EMPLOYEE.value);
    ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddBulkCorporateEmp: async (req, res) => {    
    const resp = await AdminService.AddBulkCorpoEmp(req.body);
    ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditCorporateEmp: async (req, res) => {
    const resp = await AdminService.EditCorpoEmp(req.body,req.params.id);
    await CreateAuditTrail(req,resp,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE_EMPLOYEE.value);
    ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
  },
  RenewCorporateEmpPlan: async (req, res) => {
    const resp = await AdminService.RenewCorporateEmpPlan(req.body);
    ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditCorporateEmpPassword: async (req, res) => {
    const resp = await AdminService.EditCorpoEmpPass(req.body.password,req.params.id);
    await CreateAuditTrail(req,resp,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE_EMPLOYEE.value);
    ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteCorporateEmp: async (req, res) => {
    const resp = await AdminService.DeleteCorpoEmp(req.params);
    await CreateAuditTrail(req,resp,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE_EMPLOYEE.value);
    ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllFailedInsertsCorporateEmp: async (req, res) => {
    const resp = await AdminService.GetAllFailedInsertsCorpoEmp(req.params.id);
    ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
  },
  DeleteAllFailedInsertsCorporateEmp: async (req, res) => {
    const resp = await AdminService.DeleteAllFailedInsertsCorpoEmp(req.params.id);
    ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetEmailTemplate: async (req, res) => {
    const data = await AdminService.GetEmail();
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },
  
  EditEmailTemplate: async (req, res) => {
    const data = await AdminService.EditEmail(req.body, req.params.id);
    // await CreateAuditTrail(req,data,CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.TC);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetProfile: async (req, res) => {
    const data = await AdminService.GetProfile(req.admin._id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },

  GetAllReferUsers: async (req, res) => {
    const data = await AdminService.GetAllReferedUsers(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },

  EditReferedUsers: async (req, res) => {
    const data = await AdminService.EditReferedUsers(req.params.id, req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },

  DeleteReferedUsers: async (req, res) => {
    const data = await AdminService.DeleteReferedUsers(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },

  GetAllUpdateMembers: async (req, res) => {
    const data = await AdminService.GetAllUpdateMembers(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },
  
  UpdateMemberAction: async (req, res) => {
    const data = await AdminService.UpdateMemberAction(req.params.id,req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },
  
  DeleteUpdateMember: async (req, res) => {
    const data = await AdminService.DeleteUpdateMember(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },

  GetFamilyMemberList: async (req, res) => {
    const data = await AdminService.GetFamilyMemberList(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },

  EditFamilyMemberDetails: async (req, res) => {
    const data = await AdminService.EditFamilyMemberDetails(req.params.id,req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },

  EditFamilyMemberPersonalDetails: async (req, res) => {
    const data = await AdminService.EditFamilyMemberPersonalDetails(req.params.id,req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },

  AddFamilyMember: async (req, res) => {
    const data = await AdminService.AddFamilyMember(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },

  GetClaims: async (req, res) => {
    const data = await AdminService.GetClaims(req.query)
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },

  GetClaim: async (req, res) => {
    const data = await AdminService.GetClaim(req.query.id)
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },

  GetAllCorporateHr: async (req, res) => {
    const data = await AdminService.GetAllCorporateHr(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  CreateCorporateHr: async (req, res) => {
    const data = await AdminService.CreateCorporateHr(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditCorporateHr: async (req, res) => {
    const data = await AdminService.EditCorporateHr(req.body,req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditCorporateHrPassword: async (req, res) => {
    const data = await AdminService.EditCorporateHrPassword(req.body,req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteCorporateHr: async (req, res) => {
    const data = await AdminService.DeleteCorporateHr(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddCorporateHR: async (req, res) => {
    const resp = await AdminService.CreateCorporateHr(req.body);
    ResponseHandler(res, StatusCodes.OK, resp, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllAdminUsers: async (req, res) => {
    const data = await AdminService.GetAllAdminUsers();
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllCouponsUsages: async (req, res) => {
    const data = await AdminService.GetAllCouponsUsages(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetDiscountAggregation: async (req, res) => {
    const data = await AdminService.GetDiscountAggregation();
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllRegisteredUsers: async (req, res) => {
    const data = await AdminService.GetAllRegisteredUsers(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteRegisteredUser: async (req, res) => {
    const data = await AdminService.DeleteRegisteredUser(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },

  GetUsers: async (req, res) => {
    const data = await AdminService.GetUsers();
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetPurchasedHealthCheckupPlans: async (req, res) => {
    const data = await AdminService.GetPurchasedHealthCheckupPlans(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },
  
  EditPurchasedHealthCheckupPlans: async (req, res) => {
    const data = await AdminService.EditPurchasedHealthCheckupPlans(req.params.id,req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllReferedCorporates: async (req, res) => {
    const data = await AdminService.GetAllReferedCorporates( req.query );
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
},

GetAllReferedCorporatesList: async (req, res) => {
  const data = await AdminService.GetAllReferedCorporatesList( req.query );
  ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
},

GetAllReferedRetail: async (req, res) => {
    const data = await AdminService.GetAllReferedRetail( req.query );
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllReferedRetailList: async (req, res) => {
    const data = await AdminService.GetAllReferedRetailList( req.query );
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllReferedEmails: async (req, res) => {
    const data = await AdminService.GetAllReferedEmails( req.query );
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetNotifications: async (req,res) => {
    const data = await AdminService.GetNotifications(req.query)
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
},

  DeleteNotification: async (req,res) => {
    const data = await AdminService.DeleteNotification(req.params.id)
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddBlog: async (req, res) => {
    const data = await AdminService.AddBlog(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditBlog: async (req, res) => {
    const data = await AdminService.EditBlog(req.body,req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteBlog: async (req, res) => {
    const data = await AdminService.DeleteBlog(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteBlogImage: async (req, res) => {
    const data = await AdminService.DeleteBlogImage(req.params.id,req.params.index);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddFaq: async (req, res) => {
    const data = await AdminService.AddFaq(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditFaq: async (req, res) => {
    const data = await AdminService.EditFaq(req.body, req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteFaq: async (req, res) => {
    const data = await AdminService.DeleteFaq(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddGoogleReview: async (req, res) => {
    const data = await AdminService.AddGoogleReview(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditGoogleReview: async (req, res) => {
    const data = await AdminService.EditGoogleReview(req.body,req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteGoogleReview: async (req, res) => {
    const data = await AdminService.DeleteGoogleReview(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddMedia: async (req, res) => {
    const data = await AdminService.AddMedia(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditMedia: async (req, res) => {
    const data = await AdminService.EditMedia(req.body,req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteMedia: async (req, res) => {
    const data = await AdminService.DeleteMedia(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteMediaImage: async (req, res) => {
    const data = await AdminService.DeleteMediaImage(req.params.id,req.params.index);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteMediaIcon: async (req, res) => {
    const data = await AdminService.DeleteMediaIcon(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddEvent: async (req, res) => {
    const data = await AdminService.AddEvent(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditEvent: async (req, res) => {
    const data = await AdminService.EditEvent(req.body,req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteEvent: async (req, res) => {
    const data = await AdminService.DeleteEvent(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteEventImage: async (req, res) => {
    const data = await AdminService.DeleteEventImage(req.params.id,req.params.index);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddLinkedinPost: async (req, res) => {
    const data = await AdminService.AddLinkedinPost(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditLinkedinPost: async (req, res) => {
    const data = await AdminService.EditLinkedinPost(req.body,req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteLinkedinPost: async (req, res) => {
    const data = await AdminService.DeleteLinkedinPost(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddJob: async (req, res) => {
    const data = await AdminService.AddJob(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  EditJob: async (req, res) => {
    const data = await AdminService.EditJob(req.body,req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  DeleteJob: async (req, res) => {
    const data = await AdminService.DeleteJob(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllJobApplications: async (req, res) => {
    const data = await AdminService.GetAllJobApplications(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  ResetAdminPassword: async (req, res) => {
    const data = await AdminService.ResetAdminPassword(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  ResetAdminPasswordDetails: async (req, res) => {
    const data = await AdminService.ResetAdminPasswordDetails(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetFreeHealthTest: async (req, res) => {
    const data = await AdminService.GetFreeHealthTests(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },

  FreeHealthTestsAction: async (req, res) => {
    const data = await AdminService.FreeHealthTestsAction(req.params.id, req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);  
  },
  
};

module.exports = AdminController;
