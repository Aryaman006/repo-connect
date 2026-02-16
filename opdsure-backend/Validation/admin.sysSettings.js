const Joi = require("joi");
const {CONSTANTS} = require("../Constant")

const SysSettingsSchema = {

    Add: Joi.object().keys({
        docSize: Joi.number().integer().min(CONSTANTS.FILE_SIZE.MIN).max(CONSTANTS.FILE_SIZE.MAX).required(),  
        file_type: Joi.string().min(3).max(100).regex(CONSTANTS.REGEX.FILE_TYPE).required(),  
    }),
    Edit: Joi.object().keys({    
        docSize: Joi.number().integer().min(CONSTANTS.FILE_SIZE.MIN).max(CONSTANTS.FILE_SIZE.MAX).optional(),  
        file_type: Joi.string().min(3).max(100).regex(CONSTANTS.REGEX.FILE_TYPE).optional(),  
        speciality: Joi.number().integer().min(0).max(1000000).optional(),  
        years_of_exp: Joi.number().integer().min(0).max(1000000).optional(),  
        doctor: Joi.number().integer().min(0).max(1000000).optional(),  
        appointment: Joi.number().integer().min(0).max(1000000).optional(),  
        disclaimer: Joi.string().max(5000).optional(),
    }).min(1),

}

module.exports = SysSettingsSchema;