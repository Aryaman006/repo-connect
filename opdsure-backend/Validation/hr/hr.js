const Joi = require("joi")
const { CONSTANTS } = require("../../Constant")

const HRSchema = {
    
AddCorpUser : Joi.object().keys({
    employeeId : Joi.string().required(),
    name : Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
    designation : Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
    bank_name : Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
    department : Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
    address : Joi.string().max(CONSTANTS.STRING_LEN.ADDRESS).required(),
    dob : Joi.date().iso().less("now").required(),
    gender : Joi.number().valid(...Object.values(CONSTANTS.GENDER)).required(),
    phone : Joi.string().regex(CONSTANTS.REGEX.PHONE).required(),
    country_code : Joi.string().regex(CONSTANTS.REGEX.COUNTRY_CODE).optional(),
    email : Joi.string().regex(CONSTANTS.REGEX.EMAIL).required(),
    status : Joi.number().valid(...Object.values(CONSTANTS.STATUS)).required(),
    plan: Joi.string().required(),
    membership: Joi.number().required(),
    // password: Joi.string().max(30).required(),
}),

AddBulkCorpUser : Joi.object().keys({
    plan: Joi.string().required(),
    membership: Joi.number().required(),
    employee_details : Joi.array().items(Joi.object({
        employeeId : Joi.string().required(),
        name : Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        designation : Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        bank_name : Joi.string().max(CONSTANTS.STRING_LEN.NAME).optional(),
        department : Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        address : Joi.string().max(CONSTANTS.STRING_LEN.ADDRESS).required(),
        dob : Joi.date().iso().less("now").required(),
        gender : Joi.number().valid(...Object.values(CONSTANTS.GENDER)).required(),
        phone : Joi.string().regex(CONSTANTS.REGEX.PHONE).required(),
        country_code : Joi.string().regex(CONSTANTS.REGEX.COUNTRY_CODE).optional(),
        email : Joi.string().regex(CONSTANTS.REGEX.EMAIL).required(),
        status : Joi.number().valid(...Object.values(CONSTANTS.STATUS)).required(),
    })),       
}),

EditCorpUser : Joi.object().keys({
    corporate : Joi.string().optional(),
    employeeId : Joi.string().optional(),
    name : Joi.string().max(CONSTANTS.STRING_LEN.NAME).optional(),
    designation : Joi.string().max(CONSTANTS.STRING_LEN.NAME).optional(),
    bank_name : Joi.string().max(CONSTANTS.STRING_LEN.NAME).optional(),
    department : Joi.string().max(CONSTANTS.STRING_LEN.NAME).optional(),
    address : Joi.string().max(CONSTANTS.STRING_LEN.ADDRESS).optional(),
    dob : Joi.date().iso().optional(),
    gender : Joi.number().valid(...Object.values(CONSTANTS.GENDER)).optional(),
    phone : Joi.string().regex(CONSTANTS.REGEX.PHONE).optional(),
    country_code : Joi.string().regex(CONSTANTS.REGEX.COUNTRY_CODE).optional(),
    email : Joi.string().regex(CONSTANTS.REGEX.EMAIL).optional(),
    status : Joi.number().valid(...Object.values(CONSTANTS.STATUS)).optional(),
}).min(1),

EditCorpUserPassword : Joi.object().keys({
    password : Joi.string().required(),
}),

}

module.exports = HRSchema;