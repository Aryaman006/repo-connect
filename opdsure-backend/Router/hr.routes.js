const express = require("express")
const router = express.Router();
const { ValidateRequest, HRAuth } = require("../Middleware");
const { CommonSchema, HrAuthSchema, HRSchema } = require("../Validation");
const { CatchAsync } = require("../Utils");
const { HRAuthController, HRController } = require("../controller");


router.post("/login", ValidateRequest(HrAuthSchema.Login, "body"), CatchAsync(HRAuthController.Login));
router.post("/logout", HRAuth, CatchAsync(HRAuthController.Logout));

router.post("/corpoEmp", HRAuth, ValidateRequest(HRSchema.AddCorpUser, "body"), CatchAsync(HRController.AddCorporateEmp));
router.post("/corpoEmp/bulk", HRAuth, ValidateRequest(HRSchema.AddBulkCorpUser, "body"), CatchAsync(HRController.AddBulkCorporateEmp));
router.get("/corpoEmp", HRAuth,  ValidateRequest(CommonSchema.Pagination, "query"),CatchAsync(HRController.GetAllCorporateEmp));
router.patch("/corpoEmp/:id", HRAuth,  ValidateRequest(CommonSchema.ParamsId, "params") ,ValidateRequest(HRSchema.EditCorpUser, "body") , CatchAsync(HRController.EditCorporateEmp));
router.patch("/corpoEmp/password/:id", HRAuth,  ValidateRequest(CommonSchema.ParamsId, "params"),ValidateRequest(HRSchema.EditCorpUserPassword, "body") , CatchAsync(HRController.ResetCorporateEmpPass));
router.delete("/corpoEmp/:id", HRAuth, ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(HRController.DeleteCorpoEmp));
router.get("/corpoEmp/failedRecordsInserts/:id", HRAuth,  ValidateRequest(CommonSchema.Pagination, "query"),CatchAsync(HRController.GetAllFailedInsertsCorporateEmp));
router.delete("/corpoEmp/deleteFailedRecordsInserts/",HRAuth, ValidateRequest(CommonSchema.Pagination, "query"),CatchAsync(HRController.DeleteAllFailedInsertsCorporateEmp));
router.get("/corporation/plan/:user_id", HRAuth, CatchAsync(HRController.GetCorporatePlanByUserId));

module.exports = router;