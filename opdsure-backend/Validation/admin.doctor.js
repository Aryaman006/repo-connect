const Joi = require("joi");
const { CONSTANTS } = require("../Constant");

const DoctorSchema = {

    Add : Joi.object().keys({
        name : Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        reg_no : Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        specialization : Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        hospital : Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        address : Joi.string().max(CONSTANTS.STRING_LEN.ADDRESS).required(),
        state: Joi.number().required(), 
        exp: Joi.number().min(0).max(99).required(), 
        mobile : Joi.string().regex(CONSTANTS.REGEX.PHONE).required(),
        country_code : Joi.string().regex(CONSTANTS.REGEX.COUNTRY_CODE).optional(),
        email : Joi.string().regex(CONSTANTS.REGEX.EMAIL).required(),
        status : Joi.number().valid(...Object.values(CONSTANTS.STATUS)).required(),
    }),
    
    Edit : Joi.object().keys({
        name : Joi.string().max(CONSTANTS.STRING_LEN.NAME).optional(),
        reg_no : Joi.string().max(CONSTANTS.STRING_LEN.NAME).optional(),
        specialization : Joi.string().max(CONSTANTS.STRING_LEN.NAME).optional(),
        hospital : Joi.string().max(CONSTANTS.STRING_LEN.NAME).optional(),
        address : Joi.string().max(CONSTANTS.STRING_LEN.ADDRESS).optional(),
        state: Joi.number().optional(), 
        exp: Joi.number().min(0).max(99).optional(), 
        mobile : Joi.string().regex(CONSTANTS.REGEX.PHONE).optional(),
        country_code : Joi.string().regex(CONSTANTS.REGEX.COUNTRY_CODE).optional(),
        email : Joi.string().regex(CONSTANTS.REGEX.EMAIL).optional(),
        status : Joi.number().valid(...Object.values(CONSTANTS.STATUS)).optional(),
        approved_by_admin: Joi.number().optional(),   
    }).min(1),
}

module.exports = DoctorSchema;