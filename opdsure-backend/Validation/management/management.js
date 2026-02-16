const Joi = require("joi")
const { CONSTANTS } = require("../../Constant")

const ManagementSchema = {

    UpdateClaimStatus: Joi.object().keys({
        approval_status: Joi.valid(...Object.values(CONSTANTS.CLAIM.INTERNAL_STATUS)).required(),
        remark: Joi.string().max(1000).when("approval_status",{
            is: CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED,
            then: Joi.optional(),
            otherwise: Joi.required()
        }),
    }),
    ClaimDisputeAction: Joi.object().keys({
        approval_status: Joi.valid(
            CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED,
            CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_VERIFIER,
            CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_MANAGER,
            CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_FINANCER,
            CONSTANTS.CLAIM.INTERNAL_STATUS.REJECTED,
        ).required(),
        remark: Joi.string().max(1000).required()
    }),
    ClaimPagination: Joi.object().keys({
        search:Joi.string().min(0).max(50).optional(),
        page: Joi.string().regex(/^\d+$/).max(10000).optional(),
        pageSize: Joi.string().regex(/^\d+$/).max(1000).optional(),
        sortBy:Joi.string().optional(),
        sortOrder:Joi.string().optional(),
        claimType:Joi.string().optional(),
        claimInternalStatus:Joi.string().optional(),
        startDate: Joi.date().iso().less('now').optional(),      
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).optional(), 
        internalStatusFilter: Joi.string().max(20).optional().custom((value, helpers) => {
            if (value === 'ALL') {
                return value;
            }
            const values = value.split(',');
            for (let v of values) {
                if (!Object.values(CONSTANTS.CLAIM.INTERNAL_STATUS).includes(parseInt(v, 10))) {
                    return helpers.message(`Invalid status value: ${v}`);
                }
            }
            return value;
        }),
    }),
    DisputedClaimPagination: Joi.object().keys({
        search:Joi.string().min(0).max(50).optional(),
        page: Joi.string().regex(/^\d+$/).max(10000).optional(),
        pageSize: Joi.string().regex(/^\d+$/).max(1000).optional(),
        sortBy:Joi.string().optional(),
        sortOrder:Joi.string().optional(),
        claimType:Joi.string().optional(),
        claimInternalStatus:Joi.string().optional(),
        claimDisputeStatus:Joi.string().optional(),
        startDate: Joi.date().iso().less('now').optional(),      
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).optional(), 
        internalStatusFilter: Joi.string().max(20).optional().custom((value, helpers) => {
            if (value === 'ALL') {
                return value;
            }
            const values = value.split(',');
            for (let v of values) {
                if (!Object.values(CONSTANTS.CLAIM.INTERNAL_STATUS).includes(parseInt(v, 10))) {
                    return helpers.message(`Invalid status value: ${v}`);
                }
            }
            return value;
        }),
    }),

    UpdateClaimVerifier : Joi.array().items(
        Joi.object({
          claim_id: Joi.string().required(),
          verifier_id: Joi.string().required()
        })
      ),

      Recover: Joi.object().keys({
        email: Joi.string().regex(CONSTANTS.REGEX.EMAIL).required(),        
    }),
    
    RecoverDetails: Joi.object().keys({
        email: Joi.string().regex(CONSTANTS.REGEX.EMAIL).required(), 
        key: Joi.string().length(24),       
        password: Joi.string().required(),
        confirm_password: Joi.string()
        .valid(Joi.ref('password'))
        .required(),       
    }),
      
    
}

module.exports = ManagementSchema