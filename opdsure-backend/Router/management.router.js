const express = require("express")
const router = express.Router();
const { ValidateRequest, ManagementUsersAuth, AdminAuth } = require("../Middleware");
const { ManagementAuthSchema, CommonSchema, ManagenetUserSchema, ManagementSchema } = require("../Validation");
const { CatchAsync } = require("../Utils");
const { ManagementAuthController, ManagementController } = require("../controller");

router.post("/login", ValidateRequest(ManagementAuthSchema.Login, "body"), CatchAsync(ManagementAuthController.Login));
router.post("/logout", ManagementUsersAuth, CatchAsync(ManagementAuthController.Logout));
router.post("/pay-claim-amount", ValidateRequest(CommonSchema.ParamsId, "body"), ManagementUsersAuth, CatchAsync(ManagementController.PayClaimAmount))
router.post("/pay-disputed-claim-amount/:id", ValidateRequest(CommonSchema.ParamsId, "params"), ManagementUsersAuth, CatchAsync(ManagementController.PayDisputedClaimAmount));

router.get("/get-profile", ManagementUsersAuth, CatchAsync(ManagementController.GetProfile));
router.get("/get-claims",  ManagementUsersAuth, CatchAsync(ManagementController.GetClaims));
router.get("/get-allclaims",  ManagementUsersAuth, CatchAsync(ManagementController.GetAllClaims));
router.get("/get-claim-details", ValidateRequest(CommonSchema.ParamsId, "query"), ManagementUsersAuth, CatchAsync(ManagementController.GetClaim));
router.patch("/update-claimbills", ManagementUsersAuth, CatchAsync(ManagementController.UpdateClaimBills));
router.get("/get-health-checkups", ManagementUsersAuth, CatchAsync(ManagementController.GetHealthTests))
router.get("/get-disputed-claims", ValidateRequest(ManagementSchema.DisputedClaimPagination, "query"), ManagementUsersAuth, CatchAsync(ManagementController.GetDisputedClaims))
router.get("/get-disputed-claim-details/:id", ValidateRequest(CommonSchema.ParamsId, "params"), ManagementUsersAuth, CatchAsync(ManagementController.GetDisputedClaim))
router.patch("/claim-dispute/:id",  ManagementUsersAuth, ValidateRequest(CommonSchema.ParamsId, "params"), ValidateRequest(ManagementSchema.ClaimDisputeAction,"body"), CatchAsync(ManagementController.ClaimDisputeAction))
router.get("/get-verifiers", ManagementUsersAuth, CatchAsync(ManagementController.GetVerifiers));

router.post("/update-claim/:id", ValidateRequest(CommonSchema.ParamsId, "params"),  ValidateRequest(ManagementSchema.UpdateClaimStatus, "body"), ManagementUsersAuth, CatchAsync(ManagementController.UpdateClaim));
router.post("/transfer-claim-verifier",ValidateRequest(ManagementSchema.UpdateClaimVerifier, "body"), ManagementUsersAuth, CatchAsync(ManagementController.UpdateClaimVerifier));

router.get("/notifications", ValidateRequest(CommonSchema.Pagination, "query"), ManagementUsersAuth, CatchAsync(ManagementController.GetNotifications));
router.delete("/notification/:id", ValidateRequest(CommonSchema.ParamsId, "params"), ManagementUsersAuth, CatchAsync(ManagementController.DeleteNotification));

router.post("/forgotpassword", ValidateRequest(ManagementSchema.Recover, "body"), CatchAsync(ManagementController.ResetManagPassword));
router.post("/forgotpassword/details", ValidateRequest(ManagementSchema.RecoverDetails, "body"), CatchAsync(ManagementController.ResetManagPasswordDetails));

router.get("/get-registered-usersbyemply", CatchAsync(ManagementController.GetAllRegisteredUsers));
router.get("/getusersbyemply", CatchAsync(ManagementController.GetUsers));

router.get("/contact-us-corporatesbyemply",  CatchAsync(ManagementController.GetAllReferedCorporates));
router.get("/contact-us-corporates-listbyemply",  CatchAsync(ManagementController.GetAllReferedCorporatesList));
router.get("/contact-us-retailbyemply", CatchAsync(ManagementController.GetAllReferedRetail));
router.get("/contact-us-retail-listbyemply", CatchAsync(ManagementController.GetAllReferedRetailList));
router.get("/contact-us-emailsbyemply",  CatchAsync(ManagementController.GetAllReferedEmails));

module.exports = router;