const Joi = require("joi");
const {CONSTANTS} = require("../Constant");

const TestSchema = {
    Add: Joi.object().keys({
        subscriber_type: Joi.number().valid(...Object.values(CONSTANTS.SUBSCRIBER_TYPE)).required(),
        name: Joi.string().required(),        
        plan: Joi.string().required(),        
        details: Joi.string().max(150).optional(),        
       
    }),
    Edit: Joi.object().keys({      
        subscriber_type: Joi.number().valid(...Object.values(CONSTANTS.SUBSCRIBER_TYPE)).optional(),
        name: Joi.string().optional(),        
        plan: Joi.string().optional(),            
        details: Joi.string().max(150).optional(),            
    }).min(1),

    TestPagination: Joi.object().keys({
        search:Joi.string().optional(),
        page: Joi.string().regex(/^\d+$/).max(10000).optional(),
        pageSize: Joi.string().regex(/^\d+$/).max(1000).optional(),
        sortBy:Joi.string().optional(),
        sortOrder:Joi.string().optional(),
        subscriberType: Joi.number().valid(...Object.values(CONSTANTS.SUBSCRIBER_TYPE)).optional(),
    }),
        
}

module.exports = TestSchema;