const Joi = require("joi");

const EmailSchema = {

    Edit: Joi.object().keys({      
        registration: Joi.string().max(5000).required(), 
        forget_password: Joi.string().max(5000).required(), 
        account_recover: Joi.string().max(5000).required(), 
        signin: Joi.string().max(5000).required(), 
        plan_purchase_mail: Joi.string().max(5000).required(),
        hc_plan_purchase_mail: Joi.string().max(5000).required(),
        plan_expiry_mail: Joi.string().max(5000).required(),
        hc_plan_expiry_mail: Joi.string().max(5000).required(),
        claim_submission_mail: Joi.string().max(5000).required(),
        claim_approval_mail: Joi.string().max(5000).required(),
        claim_rejection_mail: Joi.string().max(5000).required(),
        claim_clarification_mail: Joi.string().max(5000).required(),
        claim_updation_mail: Joi.string().max(5000).required(),
        claim_invalid_mail: Joi.string().max(5000).required(),
        claim_settled_mail: Joi.string().max(5000).required(),
        dispute_submission_mail: Joi.string().max(5000).required(),
        dispute_approval_mail: Joi.string().max(5000).required(),
        dispute_rejection_mail: Joi.string().max(5000).required(),
        dispute_settled_mail: Joi.string().max(5000).required(),
        plan_renew_mail: Joi.string().max(5000).required(),
        plan_upgrade_mail: Joi.string().max(5000).required(),
        profile_update: Joi.string().max(5000).required(),
        profile_update_action: Joi.string().max(5000).required(),
        member_status_action: Joi.string().max(5000).required(),
        user_add_member: Joi.string().max(5000).required(),
        member_personal_details_action: Joi.string().max(5000).required(),
        plan_purchase_failure: Joi.string().max(5000).required(),
        
    }),

}

module.exports = EmailSchema;