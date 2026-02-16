const Joi = require("joi");
const {CONSTANTS} = require("../Constant");
const dayjs = require("dayjs");

const CouponSchema = {
    Add: Joi.object().keys({
        coupon_type: Joi.number().valid(...Object.values(CONSTANTS.COUPON_TYPE)).required(),  
        corporate: Joi.string().when('coupon_type',{
          is: CONSTANTS.COUPON_TYPE.CORPORATE, 
          then: Joi.required(),
          otherwise: Joi.forbidden(), 
        }), 
        name: Joi.string().required(),       
        coupon_code: Joi.string().max(9).required(),        
        discount_type: Joi.number().valid(...Object.values(CONSTANTS.COUPON_DISC_TYPE)).required(),      
        discount: Joi.number().when('discount_type', {
          is: CONSTANTS.COUPON_DISC_TYPE.AMOUNT, 
          then: Joi.number().min(0.1).max(999.99), 
          otherwise:  Joi.number().min(0.1).max(100),
        }).required(),      
        start_date: Joi.date().iso().optional(),    
        end_date: Joi.date().iso().greater(Joi.ref('start_date')).required(),      
        usage_type: Joi.number().valid(...Object.values(CONSTANTS.COUPON_USAGE_TYPE)).required(), 
        usage: Joi.number().when('usage_type', {
            is: CONSTANTS.COUPON_USAGE_TYPE.SINGLE, 
            then: Joi.forbidden(), 
            otherwise: Joi.required(),
          }),
        terms: Joi.string().max(2000).required(),     
        count: Joi.number().integer().min(1).max(10000).optional(),    
    }),

    Edit: Joi.object().keys({      
        coupon_type: Joi.number().valid(...Object.values(CONSTANTS.COUPON_TYPE)).optional(),     
        corporate: Joi.string().when('coupon_type',{
          is: CONSTANTS.COUPON_TYPE.CORPORATE, 
          then: Joi.required(),
          otherwise: Joi.forbidden(), 
        }),
        name: Joi.string().optional(),        
        discount_type: Joi.number().valid(...Object.values(CONSTANTS.COUPON_DISC_TYPE)).optional(),      
        discount: Joi.number().when('discount_type', {
          is: CONSTANTS.COUPON_DISC_TYPE.AMOUNT, 
          then: Joi.number().min(0.1).max(999.99), 
          otherwise:  Joi.number().min(0.1).max(100),
        }).optional(),            
        start_date: Joi.date().iso().optional(), 
        end_date: Joi.date().iso().greater(Joi.ref('start_date')).required(),       
        usage_type: Joi.number().valid(...Object.values(CONSTANTS.COUPON_USAGE_TYPE)).optional(),      
        usage: Joi.number().when('usage_type', {
            is: CONSTANTS.COUPON_USAGE_TYPE.SINGLE, 
            then: Joi.forbidden(), 
            otherwise: Joi.required(),
          }),
        terms: Joi.string().max(2000).optional(),        
    }).min(1),
        
}

module.exports = CouponSchema;