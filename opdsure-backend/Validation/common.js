const Joi = require("joi");
const { CONSTANTS } = require("../Constant");

const CommonSchema = {

    ParamsId: Joi.object().keys({
        id: Joi.string()
    }),

    Pagination: Joi.object().keys({
        search: Joi.string().optional(),
        page: Joi.string().regex(/^\d+$/).max(10000).optional(),
        pageSize: Joi.string().regex(/^\d+$/).max(1000).optional(),
        sortBy: Joi.string().optional(),
        sortOrder: Joi.string().optional(),
        stateSortOrder: Joi.string().optional(),
        sortStateBy: Joi.string().optional(),
        startDate: Joi.date().iso().less('now').optional(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).optional(),
        internalStatus: Joi.string().max(4).optional(),
        organizationFilter: Joi.string().max(50).optional(),

    }),

    ForgotPassword: Joi.object().keys({
        key_type: Joi.number().valid(...Object.values(CONSTANTS.KEY_TYPE)).required(),
        email: Joi.when("key_type", {
            is: CONSTANTS.KEY_TYPE.PHONE,
            then: Joi.string().email().optional(),
            otherwise: Joi.string().email().required()
        }),
        phone: Joi.when("key_type", {
            is: CONSTANTS.KEY_TYPE.EMAIL,
            then: Joi.string().optional(),
            otherwise: Joi.string().required()
        }),
        country_code: Joi.when("key_type", {
            is: CONSTANTS.KEY_TYPE.PHONE,
            then: Joi.string().required(),
            otherwise: Joi.string().optional()
        }),
    }),
    UpdatePassword: Joi.object().keys({
        otp: Joi.number().max(999999).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(20).required()
    }),

    TC_For: Joi.object().keys({
        TC_TYPE_ENUM: Joi.string().valid(...CONSTANTS.TC_TYPE_ENUM).required()
    }),

    HealthCheckupPlansPagination: Joi.object().keys({
        search: Joi.string().optional(),
        page: Joi.string().regex(/^\d+$/).max(10000).optional(),
        pageSize: Joi.string().regex(/^\d+$/).max(1000).optional(),
        sortBy: Joi.string().optional(),
        sortOrder: Joi.string().optional(),
    }),

    SpecializationPagination: Joi.object().keys({
        search: Joi.string().optional(),
        page: Joi.string().regex(/^\d+$/).max(10000).optional(),
        pageSize: Joi.string().regex(/^\d+$/).max(1000).optional(),
        sortBy: Joi.string().optional(),
        sortOrder: Joi.string().optional(),
    }),

    VerifyPayment: Joi.object().keys({
        razorpay_order_id: Joi.string().required(),
        razorpay_payment_id: Joi.string().required(),
        razorpay_signature: Joi.string().required()
    }),

    GetCoupon: Joi.object().keys({
        coupon: Joi.string().required()
    }),

    PlanPagination: Joi.object().keys({
        search: Joi.string().min(0).max(50).optional(),
        page: Joi.string().regex(/^\d+$/).max(10000).optional(),
        pageSize: Joi.string().regex(/^\d+$/).max(1000).optional(),
        sortBy: Joi.string().optional(),
        sortOrder: Joi.string().optional(),
        subscriberTypeFilter: Joi.number().valid(...Object.values(CONSTANTS.SUBSCRIBER_TYPE), "ALL").optional(),
        corporateFilter: Joi.string().optional(),
    }),

    AddDoctor: Joi.object().keys({
        name: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        reg_no: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        specialization: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        hospital: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        address: Joi.string().max(CONSTANTS.STRING_LEN.ADDRESS).required(),
        state: Joi.number().required(),
        exp: Joi.number().min(0).max(99).required(),
        mobile: Joi.string().regex(CONSTANTS.REGEX.PHONE).required(),
        country_code: Joi.string().regex(CONSTANTS.REGEX.COUNTRY_CODE).optional(),
        email: Joi.string().regex(CONSTANTS.REGEX.EMAIL).required(),
    }),

    ContactRetail: Joi.object().keys({
        name: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        message: Joi.string().max(CONSTANTS.STRING_LEN.NAME).optional(),
        hear: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        phone: Joi.string().regex(CONSTANTS.REGEX.PHONE_INDIAN).required(),
        email: Joi.string().regex(CONSTANTS.REGEX.EMAIL).required(),
    }),

    ContactEmail: Joi.object().keys({
        email: Joi.string().regex(CONSTANTS.REGEX.EMAIL).required(),
    }),

    ContactCorporate: Joi.object().keys({
        name: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        phone: Joi.string().regex(CONSTANTS.REGEX.PHONE_INDIAN).required(),
        email: Joi.string().regex(CONSTANTS.REGEX.EMAIL).required(),
        message: Joi.string().max(CONSTANTS.STRING_LEN.NAME).optional(),
        designation: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        organization: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        employees: Joi.number().min(0).max(10000).required(),
        hear: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
    }),
    CreateJobApplication: Joi.object().keys({
        name: Joi.string().required(),
        job: Joi.string().required(),
        email: Joi.string().regex(CONSTANTS.REGEX.EMAIL).required(),
        mobile: Joi.string().regex(CONSTANTS.REGEX.PHONE_INDIAN).required(),
        experience: Joi.number().required(),
        resume: Joi.string().required(),
    }),
}

module.exports = CommonSchema;