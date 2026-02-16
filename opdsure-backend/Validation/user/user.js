const Joi = require("joi")
const { CONSTANTS } = require("../../Constant")

const UserSchema = {
    AddMember: Joi.object().keys({
        name: Joi.string().required(),
        relation: Joi.number().valid(...Object.values(CONSTANTS.FAMILY_RELATION)).required(),
        dob: Joi.string().required(),
        gender: Joi.number().valid(...Object.values(CONSTANTS.GENDER)).required(),
        phone: Joi.number().required(),
        country_code: Joi.string().required(),
        address: Joi.string().required()
    }),

    UpdateMember: Joi.object().keys({
        name: Joi.string().required(),
        relation: Joi.number().valid(...Object.values(CONSTANTS.FAMILY_RELATION)).required(),
        dob: Joi.string().required(),
        gender: Joi.number().valid(...Object.values(CONSTANTS.GENDER)).required(),
        phone: Joi.number().required(),
        country_code: Joi.string().required(),
        file: Joi.string().required(),
        member_id: Joi.string().required(),
        address: Joi.string().required()
    }),

    AddHealthTest: Joi.object().keys({
        member_id: Joi.string().required(),
        checkup_for: Joi.array().min(1).required(), //Joi.number().valid(...Object.values(CONSTANTS.CHECKUP_FOR)).required(),
        message: Joi.string().optional(),
        appointment: Joi.date().iso().required()
    }),

    AddHTDetails: Joi.object().keys({
        patient_name: Joi.string().required(),
        age: Joi.number().min(1).max(99).required(),
        gender: Joi.number().valid(...Object.values(CONSTANTS.GENDER)).required(),
        address: Joi.string().required(),
        pincode: Joi.number().min(110001).max(999999).required(),
        appointment: Joi.date().iso().required()
    }),

    AddClaim: Joi.object().keys({
        member_id: Joi.string().required(),
        opd_date: Joi.date().iso().max('now').required(),
        doc_name: Joi.string().required(),
        doc_email: Joi.string().optional(),
        user_remark: Joi.string().max(1000).optional(),
        doc_country_code: Joi.string().required(),
        doc_phone: Joi.number().required(),
        doc_registration: Joi.string().min(4).max(20).required(),
        // state: Joi.number().valid(...CONSTANTS.STATES.map(state => state.id)).required(),
        pincode : Joi.string().regex(CONSTANTS.REGEX.PINCODE).required(),
        doc_address: Joi.string().max(500).required(),
        city: Joi.string().required(),
        diagonosis_detail: Joi.string().required(),
        claim_combination: Joi.number().valid(...Object.values(CONSTANTS.CLAIM_COMBINATION)).required(),
        doctor_fee: Joi.number().required(),
        claimable_doctor_fee: Joi.number().required(),
        pharmacy_fee: Joi.number().min(0).max(100000).when("claim_combination",{
            is: CONSTANTS.CLAIM_COMBINATION.SEPERATE,
            then:Joi.required(),
            otherwise: Joi.forbidden()
        }),
        claimable_pharmacy_fee: Joi.number().min(0).max(100000).when("claim_combination",{
            is: CONSTANTS.CLAIM_COMBINATION.SEPERATE,
            then:Joi.required(),
            otherwise: Joi.forbidden()
        }),
        lab_test_fee: Joi.number().min(0).max(100000).when("claim_combination",{
            is: CONSTANTS.CLAIM_COMBINATION.SEPERATE,
            then:Joi.required(),
            otherwise: Joi.forbidden()
        }),
        claimable_lab_test_fee: Joi.number().min(0).max(100000).when("claim_combination",{
            is: CONSTANTS.CLAIM_COMBINATION.SEPERATE,
            then:Joi.required(),
            otherwise: Joi.forbidden()
        }),
        combined_pharmacy_test_fees: Joi.number().min(0).max(100000).when("claim_combination",{
            is: CONSTANTS.CLAIM_COMBINATION.PHARMACY_LAB_COMBINED,
            then:Joi.required(),
            otherwise: Joi.forbidden()
        }),
        claimable_combined_pharmacy_test_fees: Joi.number().min(0).max(100000).when("claim_combination",{
            is: CONSTANTS.CLAIM_COMBINATION.PHARMACY_LAB_COMBINED,
            then:Joi.required(),
            otherwise: Joi.forbidden()
        }),

        approved_claimable_pharmacy_fee: Joi.number().min(0).max(100000),
        approved_claimable_lab_test_fee: Joi.number().min(0).max(100000),
        approved_claimable_combined_pharmacy_test_fees: Joi.number().min(0).max(100000),
        approved_claimable_amount: Joi.number().min(1).required(),
        approved_claimable_doctor_fee: Joi.number().required(),
        bill_amount: Joi.number().required(),
        claimable_amount: Joi.number().min(1).required(),
        specialization: Joi.string().optional(),
        // claim_type: Joi.number().valid(...Object.values(CONSTANTS.CLAIM.TYPE)).required(),
        hospital: Joi.string().required(),
        fee_receipt: Joi.when('claim_type', {
            is: CONSTANTS.CLAIM.TYPE.OPD,
            then: Joi.array().items(Joi.string()).min(1).max(10).required(),
            otherwise: Joi.array().items(Joi.string()).min(1).max(10).optional()
        }),
        prescription: Joi.array().items(Joi.string()).min(1).max(10).required(),
        test_reports: Joi.array().items(Joi.string()).min(1).max(10).optional(),
        pharmacy_receipt: Joi.when('claim_type', {
            is: CONSTANTS.CLAIM.TYPE.PHARMACY,
            then: Joi.array().items(Joi.string()).min(1).max(10).required(),
            otherwise: Joi.array().items(Joi.string()).min(1).max(10).optional()
        }),
        test_receipt: Joi.when('claim_type', {
            is: CONSTANTS.CLAIM.TYPE.LAB_TEST,
            then: Joi.array().items(Joi.string()).min(1).max(10).required(),
            otherwise: Joi.array().items(Joi.string()).min(1).max(10).optional()
        }),
    }),


    RaiseClaimDispute: Joi.object().keys({
        user_remark: Joi.string().max(1000).required(),
        files: Joi.array().items(Joi.string().min(1).max(10000)).optional(),
    }),
    
    GetCouponDiscount: Joi.object().keys({
        coupon_code: Joi.string().max(9).required(),
        amount: Joi.number().min(1).required(),
    }),


    CalculationQuery: Joi.object().keys({
        parameter: Joi.number().valid(...Object.values(CONSTANTS.CLAIM.TYPE)).required(),
        amount: Joi.string().min(1).required(),
    }),

    CreateOrder: Joi.object().keys({
        order_for: Joi.number().valid(...Object.values(CONSTANTS.PAYMENT.ORDER_FOR)).required(),
        plan_id: Joi.when('order_for', {
            is: CONSTANTS.PAYMENT.ORDER_FOR.PLAN,
            then: Joi.string().required(),
            otherwise: Joi.string().optional()
        }),
        membership_id: Joi.when('order_for', {
            is: CONSTANTS.PAYMENT.ORDER_FOR.PLAN,
            then: Joi.number().required(),
            otherwise: Joi.number().optional()
        }),
        health_plan_id: Joi.when('order_for', {
            is: CONSTANTS.PAYMENT.ORDER_FOR.HEALTH_TEST,
            then: Joi.string().required(),
            otherwise: Joi.string().optional()
        }),
        coupon_code: Joi.string().optional().allow(null, "")
    }),

    Refer: Joi.object().keys({
        refer_name: Joi.string().max(200).regex(CONSTANTS.REGEX.PERSON_NAME).required(),
        refer_email: Joi.string().max(200).regex(CONSTANTS.REGEX.EMAIL).optional(),
        refer_phone: Joi.string().regex(CONSTANTS.REGEX.PHONE_INDIAN).required()
    }),

    ClaimPagination: Joi.object().keys({
        search:Joi.string().optional(),
        page: Joi.string().regex(/^\d+$/).max(10000).optional(),
        pageSize: Joi.string().regex(/^\d+$/).max(1000).optional(),
        sortBy:Joi.string().optional(),
        sortOrder:Joi.string().optional(),
        startDate: Joi.date().iso().less('now').optional(),   
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).optional(), 
        statusFilter: Joi.string().max(20).optional().custom((value, helpers) => {
            if (value === 'ALL') {
                return value;
            }
            const values = value.split(',');
            for (let v of values) {
                if (!Object.values(CONSTANTS.CLAIM.STATUS).includes(parseInt(v, 10))) {
                    return helpers.message(`Invalid status value: ${v}`);
                }
            }
            return value;
        }),
        claimStatus:Joi.string().optional(),
    }),

}

module.exports = UserSchema