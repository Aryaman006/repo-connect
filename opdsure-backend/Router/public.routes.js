const express = require("express")
const router = express.Router();
const multer = require("multer");
const { CatchAsync } = require("../Utils");
const { PublicController } = require("../controller");
const { CommonSchema } = require("../Validation");
const { ValidateRequest } = require("../Middleware/index");
const upload = multer();
router.post("/upload-file", upload.array('files', 1), CatchAsync(PublicController.UploadFile))

router.get("/get-states", CatchAsync(PublicController.GetStates));
router.get("/get-relations", CatchAsync(PublicController.GetRelations));
router.get("/plan", ValidateRequest(CommonSchema.PlanPagination, "query"), CatchAsync(PublicController.GetAllPlan));
router.get("/get-health-tests", CatchAsync(PublicController.GetHealthTest));
router.get("/get-file-size", CatchAsync(PublicController.GetFileSize));
router.get("/get-terms-and-condition", ValidateRequest(CommonSchema.TC_For, "query"), CatchAsync(PublicController.GetTC));
router.get("/get-health-checkup-plans", ValidateRequest(CommonSchema.HealthCheckupPlansPagination, "query"), CatchAsync(PublicController.GetAllHealthCheckupPlan));
router.get("/specialization", ValidateRequest(CommonSchema.SpecializationPagination, "query"), CatchAsync(PublicController.GetAllSpecialization));
router.post("/register-doctor", ValidateRequest(CommonSchema.AddDoctor, "body"), CatchAsync(PublicController.AddDoctor))
router.post("/contact-us-corporate", ValidateRequest(CommonSchema.ContactCorporate, "body"), CatchAsync(PublicController.AddContactUsCorporate))
router.post("/contact-us-retail", ValidateRequest(CommonSchema.ContactRetail, "body"), CatchAsync(PublicController.AddContactUsRetail))
router.post("/contact-us-email", ValidateRequest(CommonSchema.ContactEmail, "body"), CatchAsync(PublicController.AddContactUsEmail))
router.get("/blogs", ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(PublicController.GetAllBlogs));
router.get("/blog/:id", ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(PublicController.GetBlog));
router.get("/google-reviews", ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(PublicController.GetAllGoogleReviews));
router.get("/google-review/:id", ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(PublicController.GetGoogleReview));
router.get("/FAQs", CatchAsync(PublicController.GetAllFaq));
router.get("/medias", ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(PublicController.GetAllMedias));
router.get("/media/:id", ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(PublicController.GetMedia));
router.get("/sms", CatchAsync(PublicController.TestSMS));
router.get("/sms-async", CatchAsync(PublicController.TestSMSAwait));
router.get("/events", ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(PublicController.GetAllEvents));
router.get("/event/:id", ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(PublicController.GetEvent));
router.get("/linkedin", ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(PublicController.GetAllLinkedinPosts));
router.get("/linkedin/:id", ValidateRequest(CommonSchema.ParamsId, "params"), CatchAsync(PublicController.GetLinkedinPost));
router.get("/jobs", ValidateRequest(CommonSchema.Pagination, "query"), CatchAsync(PublicController.GetAllJobs));
router.post("/job-application", ValidateRequest(CommonSchema.CreateJobApplication, "body"), CatchAsync(PublicController.CreateJobApplication));
router.get("/razorPayPublicKey", CatchAsync(PublicController.RzrpayPublicApi));
router.get("/current-time", CatchAsync(PublicController.CurrentTime));

module.exports = router