const express = require("express");
const router = express.Router();
const multer = require("multer")
const { ValidateRequest, AdminAuth, ValidatePrivilege } = require("../Middleware/index");
const { AdminAuthSchema, CommonSchema, TestSchema, SysSettingsSchema, TCSchema, CouponSchema, DoctorSchema, AdminSchema, EmailSchema } = require("../Validation");
const { CatchAsync } = require("../Utils");
const { AdminAuthController, DesigController, CorpoController, TCController, TestController, SysSettingsController, CorpoEmpController, CouponController, AdminController} = require("../controller");
const { CONSTANTS } = require("../Constant");
const upload = multer();
router.post("/upload-file", AdminAuth, upload.array('files', 5), CatchAsync(AdminController.UploadFile))

router.post("/signup", ValidateRequest(AdminAuthSchema.Signup, "body"), CatchAsync(AdminAuthController.SignUp));
router.post("/login", ValidateRequest(AdminAuthSchema.Signin, "body"), CatchAsync(AdminAuthController.Login));
router.post("/logout", AdminAuth, CatchAsync(AdminAuthController.Logout));
router.get("/get-profile", AdminAuth, CatchAsync(AdminController.GetProfile));

router.post("/designation", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.DESIGNATION.id,"POST"), ValidateRequest(AdminSchema.AddDesignation, "body"), CatchAsync(DesigController.Add));
router.get("/designation", AdminAuth, ValidateRequest(CommonSchema.Pagination, "query"),CatchAsync(DesigController.GetAll));
router.patch("/designation/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.DESIGNATION.id,"PATCH"), ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(AdminSchema.EditDesignation, "body") , CatchAsync(DesigController.Edit));
router.delete("/designation/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.DESIGNATION.id,"DELETE"), ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(DesigController.Delete));

router.get("/conditions",  CatchAsync(TCController.Get));
router.patch("/conditions/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), ValidateRequest(TCSchema.Edit, "body"), CatchAsync(TCController.Edit));

router.post("/corporation", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE.id,"POST"), ValidateRequest(AdminSchema.AddCorporate, "body"), CatchAsync(CorpoController.Add));
router.get("/corporation", AdminAuth,  ValidateRequest(CommonSchema.Pagination, "query"),CatchAsync(CorpoController.GetAll));
router.get("/allcorporation", AdminAuth,CatchAsync(CorpoController.GetAllCorpoUsers));
router.patch("/corporation/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE.id,"PATCH"), ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(AdminSchema.EditCorporate, "body") , CatchAsync(CorpoController.Edit));
router.delete("/corporation/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE.id,"DELETE"),ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(CorpoController.Delete));

router.post("/plan", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.PLANS.id,"POST"), ValidateRequest(AdminSchema.AddPlan, "body"), CatchAsync(AdminController.AddPlan));
router.patch("/plan/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.PLANS.id,"PATCH"), ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(AdminSchema.EditPlan, "body") , CatchAsync(AdminController.EditPlan));
router.delete("/plan/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.PLANS.id,"DELETE"), ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.DeletePlan));

router.post("/test", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.TESTS.id,"POST"), ValidateRequest(TestSchema.Add, "body"), CatchAsync(TestController.Add));
router.get("/test",  ValidateRequest(TestSchema.TestPagination, "query"),CatchAsync(TestController.GetAll));
router.patch("/test/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.TESTS.id,"PATCH"), ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(TestSchema.Edit, "body") , CatchAsync(TestController.Edit));
router.delete("/test/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.TESTS.id,"DELETE"), ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(TestController.Delete));

router.get("/settings", CatchAsync(SysSettingsController.GetAll));
router.patch("/settings/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.SYSTEM.id,"PATCH"), ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(SysSettingsSchema.Edit, "body") , CatchAsync(SysSettingsController.Edit));

router.post("/managmentUser", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.USER.id,"POST"), ValidateRequest(AdminSchema.AddManagemetUser, "body"), CatchAsync(AdminController.AddManagmentUser));
router.get("/managmentUser", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.USER.id,"GET"),  ValidateRequest(CommonSchema.Pagination, "query"),CatchAsync(AdminController.GetAllManagmentUser));
router.patch("/managmentUser/details/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.USER.id,"PATCH"), ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(AdminSchema.EditManagemetUser, "body") , CatchAsync(AdminController.EditManagmentUser));
router.patch("/managmentUser/password/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.USER.id,"PATCH"), ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(AdminSchema.EditManagemetUserPass, "body") , CatchAsync(AdminController.EditManagmentUserPass));
router.delete("/managmentUser/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.USER.id,"DELETE"), ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.DeleteManagmentUser));

router.post("/corpoEmp", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE_EMPLOYEE.id,"POST"), ValidateRequest(AdminSchema.AddCorpUser, "body"), CatchAsync(AdminController.AddCorporateEmp));
// , ValidateRequest(AdminSchema.RenewCorpUserPlan, "body")
router.post("/corpoEmp/plan-renew", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE_EMPLOYEE.id,"POST"), CatchAsync(AdminController.RenewCorporateEmpPlan));
router.post("/corpoEmp/plan-renew-bulk", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE_EMPLOYEE.id,"POST"),ValidateRequest(AdminSchema.RenewBulk, "body"), CatchAsync(AdminController.RenewCorporateEmpPlan));
router.post("/corpoEmp/bulk", AdminAuth, ValidateRequest(AdminSchema.AddBulkCorpUser, "body"), CatchAsync(AdminController.AddBulkCorporateEmp));
router.get("/corpoEmp", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE_EMPLOYEE.id,"GET"), ValidateRequest(CommonSchema.Pagination, "query"),CatchAsync(AdminController.GetAllCorporateEmp));
router.get("/allcorpoEmp", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE_EMPLOYEE.id,"GET"),CatchAsync(AdminController.GetCorporateEmp));
router.patch("/corpoEmp/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE_EMPLOYEE.id,"PATCH"), ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(AdminSchema.EditCorpUser, "body") , CatchAsync(AdminController.EditCorporateEmp));
router.patch("/corpoEmp/password/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE_EMPLOYEE.id,"PATCH"), ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(AdminSchema.EditCorpUserPassword, "body") , CatchAsync(AdminController.EditCorporateEmpPassword));
router.delete("/corpoEmp/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE_EMPLOYEE.id,"DELETE"), ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.DeleteCorporateEmp));
router.get("/corpoEmp/failedRecordsInserts/:id", AdminAuth,  ValidateRequest(CommonSchema.Pagination, "query"),CatchAsync(AdminController.GetAllFailedInsertsCorporateEmp));
router.delete("/corpoEmp/deleteFailedRecordsInserts/:id", ValidateRequest(CommonSchema.Pagination, "query"),CatchAsync(AdminController.DeleteAllFailedInsertsCorporateEmp));

router.post("/coupon", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.COUPONS.id,"POST"), ValidateRequest(CouponSchema.Add,"body"), CatchAsync(CouponController.Add));
router.get("/coupon",CatchAsync(CouponController.GetAll));
router.get("/couponlist",CatchAsync(CouponController.GetAllCouponsList));
router.patch("/coupon/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.COUPONS.id,"PATCH"), ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(CouponSchema.Edit, "body") , CatchAsync(CouponController.Edit));
router.delete("/coupon/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.COUPONS.id,"DELETE"), ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(CouponController.Delete));

router.post("/doctor",AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.DOCTORS.id,"POST") ,  ValidateRequest(DoctorSchema.Add,"body"), CatchAsync(AdminController.AddDoc));
router.get("/doctor", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.DOCTORS.id,"GET"), ValidateRequest(CommonSchema.Pagination, "query"),CatchAsync(AdminController.GetAllDoc));
router.get("/doctorfromclaims", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.DOCTORS.id,"GET"), ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(AdminController.GetAllDocFromClaims));
router.get("/doctorlist", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.DOCTORS.id,"GET"),CatchAsync(AdminController.GetAllDoctorList));
router.get("/doctorfromclaimslist", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.DOCTORS.id,"GET"), 
ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(AdminController.GetAllDocFromClaimsList));
router.get("/get-doctorfromclaims-details/:id", AdminAuth, CatchAsync(AdminController.GetDoctorFromClaimsDetails));
router.patch("/doctor/:id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.DOCTORS.id,"PATCH"), ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(DoctorSchema.Edit, "body") , CatchAsync(AdminController.EditDoc));
router.delete("/doctor/:id",AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.DOCTORS.id,"DELETE"), ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.DeleteDoc));

router.get("/programs/admin", AdminAuth, CatchAsync(AdminController.GetAdminPrograms));
router.get("/programs/general", AdminAuth, CatchAsync(AdminController.GetGeneralPrograms));

router.post("/privilege", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.PRIVILEGES.id,"POST"), CatchAsync(AdminController.AddPrivilege));
router.get("/privilege/:user_id", AdminAuth, CatchAsync(AdminController.GetAllPrivilege));
router.get("/privilege/:user_id/:program_id", AdminAuth, CatchAsync(AdminController.GetIndividualPrivilege));
router.patch("/privilege/:user_id/:module_id", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.PRIVILEGES.id,"PATCH"), CatchAsync(AdminController.EditPrivilege));

router.get("/adminUsers/details", AdminAuth,  CatchAsync(AdminController.GetAllAdminUsers));

router.get("/auditTrail/adminUsers", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.AUDIT_LOGS.id,"GET"), CatchAsync(AdminController.GetAllAdminAuditTrail));
router.get("/auditTrail/generalUsers", AdminAuth, ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.AUDIT_LOGS.id,"GET"), CatchAsync(AdminController.GetAllGeneralUsersAuditTrail));

router.post("/health-checkup-plans", AdminAuth, ValidateRequest(AdminSchema.AddHealthCheckupPlan,"body"), CatchAsync(AdminController.AddHealthCheckupPlan));
router.patch("/health-checkup-plans/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(AdminSchema.EditHealthCheckupPlan, "body") , CatchAsync(AdminController.EditHealthCheckupPlan));
router.delete("/health-checkup-plans/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.DeleteHealthCheckupPlan));

router.post("/specialization", AdminAuth, ValidateRequest(AdminSchema.AddSpecialization,"body"), CatchAsync(AdminController.AddSpecialization));
router.patch("/specialization/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(AdminSchema.EditSpecialization, "body") , CatchAsync(AdminController.EditSpecialization));
router.delete("/specialization/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.DeleteSpecialization));

router.get("/email-settings",  CatchAsync(AdminController.GetEmailTemplate));
router.patch("/email-settings/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), ValidateRequest(EmailSchema.Edit, "body"), CatchAsync(AdminController.EditEmailTemplate));

router.get("/refered-users", AdminAuth,  ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(AdminController.GetAllReferUsers));
router.patch("/refered-users/:id", AdminAuth,ValidateRequest(CommonSchema.ParamsId, "params"),  ValidateRequest(AdminSchema.EditReferedUsers, "body"), CatchAsync(AdminController.EditReferedUsers));
router.delete("/refered-users/:id", AdminAuth,ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.DeleteReferedUsers));

router.get("/update-members", AdminAuth,  ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(AdminController.GetAllUpdateMembers));
router.patch("/update-members/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"),  ValidateRequest(AdminSchema.UpdateMemberAction, "body"), CatchAsync(AdminController.UpdateMemberAction));
router.delete("/update-members/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.DeleteUpdateMember));

router.get("/get-family-details/:id", AdminAuth,  ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.GetFamilyMemberList));
router.patch("/edit-family-members/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.EditFamilyMemberDetails));
router.post("/add-family-members/", AdminAuth, ValidateRequest(AdminSchema.AddMember, "body"), CatchAsync(AdminController.AddFamilyMember));
router.patch("/edit-family-members-details/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), ValidateRequest(AdminSchema.EditFamilyMember, "body"), CatchAsync(AdminController.EditFamilyMemberPersonalDetails));

router.get("/get-claims",  AdminAuth, CatchAsync(AdminController.GetClaims));
router.get("/get-claim-details", ValidateRequest(CommonSchema.ParamsId, "query"), AdminAuth, CatchAsync(AdminController.GetClaim));

router.post("/corporateHr", AdminAuth,  ValidateRequest(AdminSchema.AddCorporateHr,"body"), CatchAsync(AdminController.AddCorporateHR));
router.get("/corporateHr", AdminAuth, ValidateRequest(CommonSchema.Pagination, "query"),CatchAsync(AdminController.GetAllCorporateHr));
router.patch("/corporateHr/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(AdminSchema.EditCorporateHr, "body") , CatchAsync(AdminController.EditCorporateHr));
router.patch("/corporateHr/password/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(AdminSchema.EditCorporateHrPass, "body") , CatchAsync(AdminController.EditCorporateHrPassword));
router.delete("/corporateHr/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.DeleteCorporateHr));

router.get("/coupon-usages", AdminAuth, ValidateRequest(CommonSchema.Pagination, "query"),CatchAsync(AdminController.GetAllCouponsUsages));
router.get("/aggregation", AdminAuth, CatchAsync(AdminController.GetDiscountAggregation));

router.get("/get-registered-users", AdminAuth, ValidateRequest(AdminSchema.UserPagination, "query"),CatchAsync(AdminController.GetAllRegisteredUsers));
router.delete("/deleteregisteredusers/:id", AdminAuth,  CatchAsync(AdminController.DeleteRegisteredUser));
router.get("/getusers", AdminAuth, CatchAsync(AdminController.GetUsers));

router.get("/get-purchased-healthcheckups", AdminAuth, ValidateRequest(AdminSchema.UserPagination, "query"),CatchAsync(AdminController.GetPurchasedHealthCheckupPlans));
router.patch("/edit-purchased-healthcheckups/:id", AdminAuth, ValidateRequest(AdminSchema.EditPurchasedHealthChecks, "body"),CatchAsync(AdminController.EditPurchasedHealthCheckupPlans));

router.get("/contact-us-corporates", AdminAuth,  ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(AdminController.GetAllReferedCorporates));
router.get("/contact-us-corporates-list", AdminAuth, CatchAsync(AdminController.GetAllReferedCorporatesList));
router.get("/contact-us-retail", AdminAuth,  ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(AdminController.GetAllReferedRetail));
router.get("/contact-us-retail-list", AdminAuth,  ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(AdminController.GetAllReferedRetailList));
router.get("/contact-us-emails", AdminAuth,  ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(AdminController.GetAllReferedEmails));

router.get("/notifications", ValidateRequest(CommonSchema.Pagination, "query"), AdminAuth, CatchAsync(AdminController.GetNotifications));
router.delete("/notification/:id", ValidateRequest(CommonSchema.ParamsId, "params"), AdminAuth, CatchAsync(AdminController.DeleteNotification));

router.post("/blog",AdminAuth,upload.array('files', 5), ValidateRequest(AdminSchema.AddBlog,"body"), CatchAsync(AdminController.AddBlog));
router.patch("/blog/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(AdminSchema.EditBlog, "body") , CatchAsync(AdminController.EditBlog));
router.delete("/blog/:id",AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.DeleteBlog));
router.delete("/blog-image/:id/:index",AdminAuth, CatchAsync(AdminController.DeleteBlogImage));

router.post("/FAQs",AdminAuth, ValidateRequest(AdminSchema.AddFAQ, "body"), CatchAsync(AdminController.AddFaq));
router.patch("/FAQs/:id",AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), ValidateRequest(AdminSchema.EditFAQ, "body"), CatchAsync(AdminController.EditFaq));
router.delete("/FAQs/:id",AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.DeleteFaq));

router.post("/google-review", AdminAuth,upload.array('files', 1), ValidateRequest(AdminSchema.AddGoogleReview,"body"), CatchAsync(AdminController.AddGoogleReview));
router.patch("/google-review/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(AdminSchema.EditGoogleReview, "body") , CatchAsync(AdminController.EditGoogleReview));
router.delete("/google-review/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.DeleteGoogleReview));

router.post("/media",AdminAuth,upload.array('files', 5), ValidateRequest(AdminSchema.AddMedia,"body"), CatchAsync(AdminController.AddMedia));
router.patch("/media/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(AdminSchema.EditMedia, "body") , CatchAsync(AdminController.EditMedia));
router.delete("/media/:id",AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.DeleteMedia));
router.delete("/media-image/:id/:index",AdminAuth, CatchAsync(AdminController.DeleteMediaImage));
router.delete("/media-icon-image/:id",AdminAuth, CatchAsync(AdminController.DeleteMediaIcon));

router.post("/event",AdminAuth,upload.array('files', 5), ValidateRequest(AdminSchema.AddEvent,"body"), CatchAsync(AdminController.AddEvent));
router.patch("/event/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(AdminSchema.EditEvent, "body") , CatchAsync(AdminController.EditEvent));
router.delete("/event/:id",AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.DeleteEvent));
router.delete("/event-image/:id/:index",AdminAuth, CatchAsync(AdminController.DeleteEventImage));

router.post("/linkedin", ValidateRequest(AdminSchema.AddLinkedinPost,"body"), CatchAsync(AdminController.AddLinkedinPost));
router.patch("/linkedin/:id", AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(AdminSchema.EditLinkedinPost, "body") , CatchAsync(AdminController.EditLinkedinPost));
router.delete("/linkedin/:id",AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.DeleteLinkedinPost));

router.post("/job",AdminAuth, ValidateRequest(AdminSchema.AddJob, "body"), CatchAsync(AdminController.AddJob));
router.patch("/job/:id",AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), ValidateRequest(AdminSchema.EditJob, "body"), CatchAsync(AdminController.EditJob));
router.delete("/job/:id",AdminAuth, ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(AdminController.DeleteJob));

router.get("/job-application", AdminAuth, ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(AdminController.GetAllJobApplications));

router.post("/forgotpassword", ValidateRequest(AdminSchema.Recover, "body"), CatchAsync(AdminController.ResetAdminPassword));
router.post("/forgotpassword/details", ValidateRequest(AdminSchema.RecoverDetails, "body"), CatchAsync(AdminController.ResetAdminPasswordDetails));
router.get("/get-health-checkups", AdminAuth,ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(AdminController.GetFreeHealthTest));
router.patch("/health-checkups-action/:id", AdminAuth, ValidateRequest(AdminSchema.FreeHTAction, "body"), CatchAsync(AdminController.FreeHealthTestsAction));
module.exports = router;
