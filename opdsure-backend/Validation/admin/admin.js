const Joi = require("joi");
const { CONSTANTS } = require("../../Constant");

const AdminSchema = {

    AddDesignation: Joi.object().keys({
        designation: Joi.string().required(),
    }),
    EditDesignation: Joi.object().keys({
        designation: Joi.string().required(),
    }),

    AddCorporate: Joi.object().keys({
        name: Joi.string().required(),
        status: Joi.number().optional(),
        address: Joi.string().required(),
        state: Joi.number().valid(...CONSTANTS.STATES.map(state => state.id)).required(),
        email: Joi.string().regex(CONSTANTS.REGEX.EMAIL).required(),
        phone: Joi.string().regex(CONSTANTS.REGEX.PHONE).required(),
        country_code: Joi.string().min(2).max(10).required(),
        contact_person: Joi.string().optional(),

    }),

    EditCorporate: Joi.object().keys({
        name: Joi.string().optional(),
        status: Joi.number().optional(),
        address: Joi.string().optional(),
        state: Joi.number().valid(...CONSTANTS.STATES.map(state => state.id)).optional(),
        email: Joi.string().regex(CONSTANTS.REGEX.EMAIL).optional(),
        phone: Joi.string().regex(CONSTANTS.REGEX.PHONE).optional(),
        country_code: Joi.string().min(2).max(10).optional(),
        contact_person: Joi.string().optional(),
    }).min(1),

    AddCorpUser: Joi.object().keys({
        corporate: Joi.string().required(),
        employeeId: Joi.string().required(),
        plan: Joi.string().required(),
        membership: Joi.number().required(),
        name: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        designation: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        bank_name: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        department: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
        address: Joi.string().max(CONSTANTS.STRING_LEN.ADDRESS).required(),
        dob: Joi.date().iso().required(),
        gender: Joi.number().valid(...Object.values(CONSTANTS.GENDER)).required(),
        phone: Joi.string().regex(CONSTANTS.REGEX.PHONE).required(),
        country_code: Joi.string().regex(CONSTANTS.REGEX.COUNTRY_CODE).optional(),
        email: Joi.string().regex(CONSTANTS.REGEX.EMAIL).required(),
        status: Joi.number().valid(...Object.values(CONSTANTS.STATUS)).required(),
        // password: Joi.string().required(),
    }),
    plan_benefits: Joi.array().items(Joi.object({
        plan_label: Joi.string().max(100).required(),
        plan_feature: Joi.string().max(1000).required()
    })).required(),

    AddBulkCorpUser: Joi.object().keys({
        corporate: Joi.string().required(),
        plan: Joi.string().required(),
        membership: Joi.number().required(),
        employee_details: Joi.array().items(Joi.object({
            employeeId: Joi.string().required(),
            name: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
            designation: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
            bank_name: Joi.string().max(CONSTANTS.STRING_LEN.NAME).optional(),
            department: Joi.string().max(CONSTANTS.STRING_LEN.NAME).required(),
            address: Joi.string().max(CONSTANTS.STRING_LEN.ADDRESS).required(),
            dob: Joi.date().iso().less("now").required(),
            gender: Joi.number().required(),
            phone: Joi.string().regex(CONSTANTS.REGEX.PHONE).required(),
            country_code: Joi.string().optional(),
            email: Joi.string().required(),
            status: Joi.number().required(),
        })),
    }),
    
    RenewBulk: Joi.object().keys({
        corporate: Joi.string().required(),
        plan: Joi.string().required(),
        membership: Joi.number().required(),
        employees: Joi.array().required(),
    }),

    EditCorpUser: Joi.object().keys({
        corporate: Joi.string().optional(),
        employeeId: Joi.string().optional(),
        name: Joi.string().max(CONSTANTS.STRING_LEN.NAME).optional(),
        designation: Joi.string().max(CONSTANTS.STRING_LEN.NAME).optional(),
        bank_name: Joi.string().max(CONSTANTS.STRING_LEN.NAME).optional(),
        department: Joi.string().max(CONSTANTS.STRING_LEN.NAME).optional(),
        address: Joi.string().max(CONSTANTS.STRING_LEN.ADDRESS).optional(),
        dob: Joi.date().iso().optional(),
        gender: Joi.number().valid(...Object.values(CONSTANTS.GENDER)).optional(),
        phone: Joi.string().regex(CONSTANTS.REGEX.PHONE).optional(),
        country_code: Joi.string().regex(CONSTANTS.REGEX.COUNTRY_CODE).optional(),
        email: Joi.string().regex(CONSTANTS.REGEX.EMAIL).optional(),
        status: Joi.number().valid(...Object.values(CONSTANTS.STATUS)).optional(),
    }).min(1),

    EditCorpUserPassword: Joi.object().keys({
        password: Joi.string().required(),
    }),

    AddPlan: Joi.object().keys({
        name: Joi.string().max(CONSTANTS.STRING_LEN.NAME).max(CONSTANTS.STRING_LEN.NAME).required(),
        frequency: Joi.number().valid(...Object.values(CONSTANTS.CORPORATE.PLAN_FREQ)).required(),
        subscriber_type: Joi.number().valid(...Object.values(CONSTANTS.SUBSCRIBER_TYPE)).required(),
        corporate: Joi.string().when("subscriber_type", {
            is: CONSTANTS.SUBSCRIBER_TYPE.CORPORATE,
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
        membership_options: Joi.array().items(Joi.object({
            membership_id: Joi.number().min(0).max(20).required(),
            membership_label: Joi.string().max(100).required(),
            member_count: Joi.number().min(1).max(20).required(),
            charges: Joi.number().min(0).max(1000000).required(),
            wallet_balance: Joi.number().min(0).max(10000000).required(),
        })).required(),
        claim_combination: Joi.number().min(0).max(1000000).valid(...Object.values(CONSTANTS.CLAIM_COMBINATION.SEPERATE)).required(),
        opd_max_discount: Joi.number().min(0).max(CONSTANTS.PLAN_DISCOUNTS.OPD_MAX_DISCOUNT).required(),
        opd_precent_discount: Joi.number().min(0).max(100).required(),
        lab_max_discount: Joi.number().when("claim_combination", {
            is: CONSTANTS.CLAIM_COMBINATION.SEPERATE,
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
        lab_max_discount: Joi.number().min(0).max(1000000).when("claim_combination", {
            is: CONSTANTS.CLAIM_COMBINATION.SEPERATE,
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
        lab_precent_discount: Joi.number().min(0).max(100).when("claim_combination", {
            is: CONSTANTS.CLAIM_COMBINATION.SEPERATE,
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
        // lab_max_discount: Joi.number().min(0).max(CONSTANTS.PLAN_DISCOUNTS.LAB_MAX_DISCOUNT).required(),        
        // lab_precent_discount: Joi.number().min(0).max(100).required(),        
        pharmacy_max_discount: Joi.number().min(0).max(1000000).when("claim_combination", {
            is: CONSTANTS.CLAIM_COMBINATION.SEPERATE,
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
        pharmacy_precent_discount: Joi.number().min(0).max(100).when("claim_combination", {
            is: CONSTANTS.CLAIM_COMBINATION.SEPERATE,
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
        combined_lab_plus_test_max_discount: Joi.number().min(0).max(1000000).when("claim_combination", {
            is: CONSTANTS.CLAIM_COMBINATION.PHARMACY_LAB_COMBINED,
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
        combined_lab_plus_test_percent: Joi.number().min(0).max(100).when("claim_combination", {
            is: CONSTANTS.CLAIM_COMBINATION.PHARMACY_LAB_COMBINED,
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
        // pharmacy_max_discount: Joi.number().min(0).max(CONSTANTS.PLAN_DISCOUNTS.PHARMACY_MAX_DISCOUNT).required(),        
        // pharmacy_precent_discount: Joi.number().min(0).max(100).required(),        
        plan_benefits: Joi.array().items(Joi.object({
            plan_label: Joi.string().max(100).required(),
            plan_feature: Joi.string().max(1000).required()
        })).required(),
        files: Joi.array().items(Joi.string()).min(1).max(10).optional()
    }),
    EditPlan: Joi.object().keys({
        name: Joi.string().max(CONSTANTS.STRING_LEN.NAME).max(CONSTANTS.STRING_LEN.NAME).optional(),
        frequency: Joi.number().valid(...Object.values(CONSTANTS.CORPORATE.PLAN_FREQ)).optional(),
        subscriber_type: Joi.number().valid(...Object.values(CONSTANTS.SUBSCRIBER_TYPE)).optional(),
        corporate: Joi.string().when("subscriber_type", {
            is: CONSTANTS.SUBSCRIBER_TYPE.CORPORATE,
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
        membership_options: Joi.array().items(Joi.object({
            membership_id: Joi.number().min(0).max(20).required(),
            membership_label: Joi.string().max(100).required(),
            member_count: Joi.number().min(1).max(20).required(),
            charges: Joi.number().min(0).max(1000000).required(),
            charges_incl_GST: Joi.number().optional(),
            wallet_balance: Joi.number().min(0).max(10000000).required(),

        })).optional(),
        claim_combination: Joi.number().min(0).max(1000000).valid(...Object.values(CONSTANTS.CLAIM_COMBINATION.SEPERATE)).required(),
        opd_max_discount: Joi.number().min(0).max(CONSTANTS.PLAN_DISCOUNTS.OPD_MAX_DISCOUNT).optional(),
        opd_precent_discount: Joi.number().min(0).max(100).optional(),
        lab_max_discount: Joi.number().when("claim_combination", {
            is: CONSTANTS.CLAIM_COMBINATION.SEPERATE,
            then: Joi.optional(),
            otherwise: Joi.forbidden().default(null)
        }),
        lab_max_discount: Joi.number().min(0).max(1000000).when("claim_combination", {
            is: CONSTANTS.CLAIM_COMBINATION.SEPERATE,
            then: Joi.optional(),
            otherwise: Joi.forbidden().default(null)
        }),
        lab_precent_discount: Joi.number().min(0).max(100).when("claim_combination", {
            is: CONSTANTS.CLAIM_COMBINATION.SEPERATE,
            then: Joi.optional(),
            otherwise: Joi.forbidden().default(null)
        }),
        pharmacy_max_discount: Joi.number().min(0).max(1000000).when("claim_combination", {
            is: CONSTANTS.CLAIM_COMBINATION.SEPERATE,
            then: Joi.optional(),
            otherwise: Joi.forbidden().default(null)
        }),
        pharmacy_precent_discount: Joi.number().min(0).max(100).when("claim_combination", {
            is: CONSTANTS.CLAIM_COMBINATION.SEPERATE,
            then: Joi.optional(),
            otherwise: Joi.forbidden().default(null)
        }),
        combined_lab_plus_test_max_discount: Joi.number().min(0).max(1000000).when("claim_combination", {
            is: CONSTANTS.CLAIM_COMBINATION.PHARMACY_LAB_COMBINED,
            then: Joi.optional(),
            otherwise: Joi.forbidden().default(null)
        }),
        combined_lab_plus_test_percent: Joi.number().min(0).max(100).when("claim_combination", {
            is: CONSTANTS.CLAIM_COMBINATION.PHARMACY_LAB_COMBINED,
            then: Joi.optional(),
            otherwise: Joi.forbidden().default(null)
        }),
        plan_benefits: Joi.array().items(Joi.object({
            plan_label: Joi.string().max(100).required(),
            plan_feature: Joi.string().max(1000).required()
        })).optional(),
        files: Joi.array().items(Joi.string()).min(1).max(10).optional(),
    }).min(1),

    PlanPagination: Joi.object().keys({
        search: Joi.string().min(0).max(50).optional(),
        page: Joi.string().regex(/^\d+$/).max(10000).optional(),
        pageSize: Joi.string().regex(/^\d+$/).max(1000).optional(),
        sortBy: Joi.string().optional(),
        sortOrder: Joi.string().optional(),
        subscriberTypeFilter: Joi.number().valid(...Object.values(CONSTANTS.SUBSCRIBER_TYPE), "ALL").optional(),
        corporateFilter: Joi.string().optional(),
    }),
    AddManagemetUser: Joi.object().keys({
        name: Joi.string().required(),
        user_type: Joi.number().valid(...Object.values(CONSTANTS.MAN_USER_TYPES)).default(CONSTANTS.MAN_USER_TYPES.GENERAL).required(),
        designation: Joi.when("user_type", {
            is: CONSTANTS.MAN_USER_TYPES.GENERAL,
            then: Joi.string().required(),
            otherwise: Joi.forbidden().default(null)
        }),
        country_code: Joi.string().min(2).max(10).optional(),
        email: Joi.string().regex(CONSTANTS.REGEX.EMAIL).required(),
        mobile: Joi.string().regex(CONSTANTS.REGEX.PHONE).required(),
        password: Joi.string().required(),
        status: Joi.number().valid(...Object.values(CONSTANTS.STATUS)).required()

    }),
    EditManagemetUser: Joi.object().keys({
        name: Joi.string().optional(),
        user_type: Joi.number().valid(...Object.values(CONSTANTS.MAN_USER_TYPES)).default(CONSTANTS.MAN_USER_TYPES.GENERAL).optional(),
        designation: Joi.when("user_type", {
            is: CONSTANTS.MAN_USER_TYPES.GENERAL,
            then: Joi.string().required(),
            otherwise: Joi.forbidden().default(null)
        }),
        country_code: Joi.string().min(2).max(10).required(),
        email: Joi.string().regex(CONSTANTS.REGEX.EMAIL).optional(),
        user_type: Joi.number().valid(...Object.values(CONSTANTS.MAN_USER_TYPES)).optional(),
        mobile: Joi.string().regex(CONSTANTS.REGEX.PHONE).optional(),
        status: Joi.number().valid(...Object.values(CONSTANTS.STATUS)).optional()
    }).min(1),
    EditManagemetUserPass: Joi.object().keys({
        password: Joi.string().required(),
    }),

    AddHealthCheckupPlan: Joi.object().keys({
        checkup_code: Joi.string().required(),
        name: Joi.string().required(),
        base_price: Joi.number().min(0).max(100000).required(),
        discounted_price: Joi.number().min(0).max(100000).required(),
        parameters: Joi.number().min(0).max(1000).required(),
        test_details: Joi.array().items(Joi.object({
            sub_parameter: Joi.string().max(200).required(),
            sub_parameter_count: Joi.number().min(0).max(200).required(),
            tests_name: Joi.when("sub_parameter_count", {
                is: Joi.number().greater(1),
                then: Joi.string().max(5000).required(),
                otherwise: Joi.optional()
            }),

        })).required()
    }),
    EditHealthCheckupPlan: Joi.object().keys({
        checkup_code: Joi.string().optional(),
        name: Joi.string().optional(),
        base_price: Joi.number().min(0).max(100000).optional(),
        discounted_price: Joi.number().min(0).max(100000).optional(),
        parameters: Joi.number().min(0).max(1000).optional(),
        test_details: Joi.array().items(Joi.object({
            sub_parameter: Joi.string().max(200).required(),
            sub_parameter_count: Joi.number().max(5000).required(),
            tests_name: Joi.when("sub_parameter_count", {
                is: Joi.number().greater(1),
                then: Joi.string().max(5000).required(),
                otherwise: Joi.optional()
            }),
        })).optional()
    }).min(1),

    AddSpecialization: Joi.object().keys({
        name: Joi.string().max(500).regex(CONSTANTS.REGEX.NAME).required(),
    }),
    EditSpecialization: Joi.object().keys({
        name: Joi.string().max(500).regex(CONSTANTS.REGEX.NAME).required(),
    }),
    EditReferedUsers: Joi.object().keys({
        action_taken: Joi.boolean().required()
    }),
    UpdateMemberAction: Joi.object().keys({
        review_status: Joi.valid(...Object.values(CONSTANTS.REVIEW_STATUS)).required()
    }),

    ClaimPagination: Joi.object().keys({
        search: Joi.string().min(0).max(50).optional(),
        page: Joi.string().regex(/^\d+$/).max(10000).optional(),
        pageSize: Joi.string().regex(/^\d+$/).max(1000).optional(),
        sortBy: Joi.string().optional(),
        sortOrder: Joi.string().optional(),
        claimType: Joi.string().optional(),
        claimInternalStatus: Joi.string().optional(),
        // startDate: Joi.date().iso().less('now').optional(),
        // endDate: Joi.date().iso().greater(Joi.ref('startDate')).optional(),
    }),

    AddCorporateHr: Joi.object().keys({
        corporate: Joi.string().required(),
        name: Joi.string().required(),
        country_code: Joi.string().min(2).max(10).optional(),
        status: Joi.number().valid(...Object.values(CONSTANTS.STATUS)).required(),
        email: Joi.string().regex(CONSTANTS.REGEX.EMAIL).required(),
        phone: Joi.string().regex(CONSTANTS.REGEX.PHONE).required(),
        password: Joi.string().required(),

    }),
    EditCorporateHr: Joi.object().keys({
        corporate: Joi.string().optional(),
        name: Joi.string().optional(),
        country_code: Joi.string().min(2).max(10).optional(),
        status: Joi.number().valid(...Object.values(CONSTANTS.STATUS)).optional(),
        email: Joi.string().regex(CONSTANTS.REGEX.EMAIL).optional(),
        phone: Joi.string().regex(CONSTANTS.REGEX.PHONE).optional(),
        password: Joi.string().optional(),
    }).min(1),
    EditCorporateHrPass: Joi.object().keys({
        password: Joi.string().required(),
    }),

    AddMember: Joi.object().keys({
        name: Joi.string().required(),
        relation: Joi.number().valid(...Object.values(CONSTANTS.FAMILY_RELATION)).required(),
        dob: Joi.string().required(),
        gender: Joi.number().valid(...Object.values(CONSTANTS.GENDER)).required(),
        phone: Joi.number().required(),
        country_code: Joi.string().required(),
        address: Joi.string().required(),
        user_id: Joi.string().required()
    }),

    EditFamilyMember: Joi.object().keys({
        name: Joi.string().optional(),
        relation: Joi.number().valid(...Object.values(CONSTANTS.FAMILY_RELATION)).optional(),
        dob: Joi.string().optional(),
        gender: Joi.number().valid(...Object.values(CONSTANTS.GENDER)).optional(),
        phone: Joi.number().optional(),
        country_code: Joi.string().optional(),
        address: Joi.string().optional(),
    }).min(1),

    UserPagination: Joi.object().keys({
        search: Joi.string().min(0).max(50).optional(),
        page: Joi.string().regex(/^\d+$/).max(10000).optional(),
        pageSize: Joi.string().regex(/^\d+$/).max(1000).optional(),
        sortBy: Joi.string().optional(),
        sortOrder: Joi.string().optional(),
        subscriberTypeStatus: Joi.string().optional(),
        startDate: Joi.date().iso().less('now').optional(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).optional(),
    }),

    EditPurchasedHealthChecks: Joi.object().keys({
        completed: Joi.boolean().required(),
    }),

    AddBlog: Joi.object().keys({
        title: Joi.string().required(),
        desciption: Joi.string().required(),
        author: Joi.string().optional(),
        files: Joi.array().items(Joi.string()).min(1).max(5).required()
    }),

    EditBlog: Joi.object().keys({
        title: Joi.string().optional(),
        desciption: Joi.string().optional(),
        author: Joi.string().optional(),
        files: Joi.array().items(Joi.string()).min(1).max(5).optional()
    }).min(1),

    AddMedia: Joi.object().keys({
        title: Joi.string().required(),
        desciption: Joi.string().required(),
        author: Joi.string().optional(),
        media_url: Joi.string().optional(),
        media_name: Joi.string().optional(),
        files: Joi.array().items(Joi.string()).min(1).max(5).required(),
        media_icon: Joi.string().optional(),
    }),

    EditMedia: Joi.object().keys({
        title: Joi.string().optional(),
        desciption: Joi.string().optional(),
        author: Joi.string().optional(),
        media_url: Joi.string().optional(),
        media_name: Joi.string().optional(),
        files: Joi.array().items(Joi.string()).min(1).max(5).optional(),
        media_icon: Joi.string().optional()
    }).min(1),

    AddFAQ: Joi.object().keys({
        question: Joi.string().required(),
        answer: Joi.string().required(),
    }),

    EditFAQ: Joi.object().keys({
        question: Joi.string().optional(),
        answer: Joi.string().optional()
    }).min(1),

    AddGoogleReview: Joi.object().keys({
        name: Joi.string().required(),
        feedback: Joi.string().required(),
        avatar: Joi.string().optional(),
        review_url: Joi.string().optional(),
        corporate_review: Joi.boolean().optional(),
        corporate_name: Joi.string().optional(),
        rating: Joi.number().min(0).max(5).required(),
    }),

    EditGoogleReview: Joi.object().keys({
        name: Joi.string().optional(),
        feedback: Joi.string().optional(),
        avatar: Joi.string().optional(),
        review_url: Joi.string().optional(),
        corporate_review: Joi.boolean().optional(),
        corporate_name: Joi.string().optional(),
        rating: Joi.number().min(0).max(5).optional(),
    }).min(1),

    AddEvent: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        date: Joi.string().optional(),
        files: Joi.array().items(Joi.string()).min(1).max(5).required()
    }),

    EditEvent: Joi.object().keys({
        title: Joi.string().optional(),
        description: Joi.string().optional(),
        date: Joi.string().optional(),
        files: Joi.array().items(Joi.string()).min(1).max(5).optional()
    }).min(1),

    AddLinkedinPost: Joi.object().keys({
        title: Joi.string().required(),
        iframe: Joi.string().required(),
        post_url: Joi.string().optional(),
    }),

    EditLinkedinPost: Joi.object().keys({
        title: Joi.string().optional(),
        iframe: Joi.string().optional(),
        post_url: Joi.string().optional(),
    }).min(1),

    AddJob: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        jd: Joi.string().optional(),
    }),

    EditJob: Joi.object().keys({
        title: Joi.string().optional(),
        description: Joi.string().optional(),
        jd: Joi.string().optional(),
        status: Joi.boolean().optional(),
    }).min(1),

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
    FreeHTAction: Joi.object().keys({
        status:Joi.number().valid(...Object.values(CONSTANTS.HEALTH_CHECKUP.STATUS)).required()
    })
}

module.exports = AdminSchema;
