const { PublicService } = require("../../service");
const { StatusCodes } = require("http-status-codes");
const { CONSTANTS_MESSAGES } = require("../../Helper");
const { ResponseHandler } = require("../../Utils");
const PublicController = {
  UploadFile: async (req, res) => {
    const data = await PublicService.UploadFile(req.files)
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetStates: async (req, res) => {
    const data = await PublicService.GetStates()
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetRelations: async (req, res) => {
    const data = await PublicService.GetRelations()
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllPlan: async (req, res) => {
    const data = await PublicService.GetAllPlan(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetHealthTest: async (req, res) => {
    const data = await PublicService.GetHealthTest()
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetFileSize: async (req, res) => {
    const data = await PublicService.GetFileSize()
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetTC: async (req, res) => {
    const data = await PublicService.GetTC(req.query.TC_TYPE_ENUM);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllHealthCheckupPlan: async (req, res) => {
    const data = await PublicService.GetAllHealthCheckupPlan(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllSpecialization: async (req, res) => {
    const data = await PublicService.GetAllSpecialization(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddDoctor: async (req, res) => {
    const data = await PublicService.AddDoctor(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddContactUsCorporate: async (req, res) => {
    const data = await PublicService.AddContactUsCorporate(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddContactUsRetail: async (req, res) => {
    const data = await PublicService.AddContactUsRetail(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  AddContactUsEmail: async (req, res) => {
    const data = await PublicService.AddContactUsEmail(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllBlogs: async (req, res) => {
    const data = await PublicService.GetAllBlogs(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetBlog: async (req, res) => {
    const data = await PublicService.GetBlog(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllGoogleReviews: async (req, res) => {
    const data = await PublicService.GetAllGoogleReviews(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetGoogleReview: async (req, res) => {
    const data = await PublicService.GetGoogleReview(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllFaq: async (req, res) => {
    const data = await PublicService.GetAllFaqs(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllMedias: async (req, res) => {
    const data = await PublicService.GetAllMedias(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetMedia: async (req, res) => {
    const data = await PublicService.GetMedia(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },
  TestSMS: async (req, res) => {
    const data = PublicService.TestSMS();
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },
  TestSMSAwait: async (req, res) => {
    const data = await PublicService.TestSMSAwait();
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },
  GetAllEvents: async (req, res) => {
    const data = await PublicService.GetAllEvents(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetEvent: async (req, res) => {
    const data = await PublicService.GetEvent(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },
  GetAllLinkedinPosts: async (req, res) => {
    const data = await PublicService.GetAllLinkedinPosts(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetLinkedinPost: async (req, res) => {
    const data = await PublicService.GetLinkedinPost(req.params.id);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  GetAllJobs: async (req, res) => {
    const data = await PublicService.GetAllJobs(req.query);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  CreateJobApplication: async (req, res) => {
    const data = await PublicService.CreateJobApplication(req.body);
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  RzrpayPublicApi: async (req, res) => {
    const data = {rzr_pay_public_key: process.env.RAZORPAY_KEY_ID};
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

  CurrentTime: async (req, res) => {
    const data = await PublicService.CurrentTime();
    ResponseHandler(res, StatusCodes.OK, data, true, CONSTANTS_MESSAGES.SUCCESS);
  },

};

module.exports = PublicController;
