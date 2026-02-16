const CONSTANTS = {
    REGEX: {
        EMAIL: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        NUMBER:/^\d+$/,
        PHONE: /^[0-9]{10,13}$/,
        PHONE_INDIAN: /^\+91[0-9]{10}$/,
        COUNTRY_CODE: /^(\+?\d{1,3}|\d{1,4})$/,
        FILE_TYPE: /^[A-Za-z]+(,[A-Za-z]+)*$/,
        NAME:/^[a-zA-Z0-9 ._/&@-]+$/,
        PERSON_NAME:/^[a-zA-Z .]+$/,
        TEST_LISTS: /^(?:(?:[a-zA-Z0-9&\-_/\"'() ]+),)*(?:[a-zA-Z0-9&\-_/\"'() ]+)$/,
        PINCODE:  /^[1-9][0-9]{5}$/,
    },

    DOCTOR:{
      NOACTION_BY_ADMIN:0,
      APPROVED_BY_ADMIN: 1,
      ADDED_BY_ADMIN: 3,
      REJECTED_BY_ADMIN: 2,
      ADDED_BY_DOCTOR: 4,

    },

    KEY_TYPE: {
      EMAIL: 0,
      PHONE: 1
    },

    FAMILY_RELATION: {
        SELF: 0,
        FATHER: 1,
        MOTHER: 2,
        SISTER: 3,
        BROTHER: 4,
        SON: 5,
        DAUGHTER: 6,
        WIFE: 7,
        HUSBAND: 8,
        FATHER_IN_LAW: 9,
        MOTHER_IN_LAW: 10
    },
    MEMBER_PROFILE_EDIT: {
      APPROVED:1,
      PENDING:0,
      REJECTED:2
    },
    PLAN_STATUS: {
        UNPAID: 0,
        PAID: 1
    },

    REVIEW_STATUS: {
        PENDING: 0,
        ACCEPTED: 1,
        REJECTED: 2
    },

    CLAIM: {

      STATUS: {
        PENDING: 0,
        APPROVED: 1,
        REJECTED: 2,
        DUPLICATE: 3,
        IN_PROCESS: 4,
        CLARIFICATION: 6,
        INVALID: 7,
        ADDING: 10,
        DISPUTE: 11, 
        SETTLED: 12,         
      },
      INTERNAL_STATUS: {
        NO_ACTION: 0,
        APPROVED_BY_APPROVER: 1,
        APPROVED_BY_VERIFIER: 2,
        APPROVED_BY_FINANCER: 3,
        APPROVED_BY_MANAGER: 4,
        REJECTED: 5, 
        CLARIFICATION: 6,      
        INVALID: 7,      
        APPROVED: 8,
        RESUBMITTED: 9,
        DISPUTE: 11, 
        SETTLED: 12,            
      },
      DISPUTE_STATUS :{
        RAISED: 1,
        IN_PROCESS: 2,
        APPROVED: 3,
        REJECTED: 4,
        SETTLED: 12,   
      },
      TYPE: {
        OPD: 0,
        PHARMACY: 1,
        LAB_TEST: 2,
        COMBINED_PHARMACY_LAB: 3,
      }
    },

    TRANSACTION: {
      TYPE: {
        DEBIT: 0,
        CREDIT: 1
      }
    },

    CHECKUP_FOR: {
      SELF: 0,
      FAMILY: 1
    }, 
    CLAIM_COMBINATION : {
      SEPERATE :1,
      PHARMACY_LAB_COMBINED:2
    },

    HEALTH_CHECKUP: {
      HEALTH_TESTS: {
        BLOOD_SUGAR: 1,
        LIPID: 2,
        FULL_BODY: 3
      },
  
      STATUS: {
        PENDING: 0,
        DONE: 1,
        CANCELED: 2
      },
    },

    GENDER: {
        MALE: 1,
        FEMALE: 2,
        OTHER: 3
    },
    USER_ROLES:{
      ADMIN: 1,
      MANAGEMENT_USER: 2,
      GENERAL_USER: 3,
      HR_USER: 4,
    },
    STATES : [
        {
          id: 0,
          abb: "AN",
          name: "Andaman and Nicobar Islands",
          state: "andaman-and-nicobar",
        },
        {
          id: 1,
          abb: "AP",
          name: "Andhra Pradesh",
          state: "andhra-pradesh",
        },
        {
          id: 2,
          abb: "AR",
          name: "Arunachal Pradesh",
          state: "arunachal-pradesh",
        },
        {
          id: 3,
          abb: "AS",
          name: "Assam",
          state: "assam",
        },
        {
          id: 4,
          abb: "BR",
          name: "Bihar",
          state: "bihar",
        },
        {
          id: 5,
          abb: "CG",
          name: "Chandigarh",
          state: "chandigarh",
        },
        {
          id: 6,
          abb: "CH",
          name: "Chhattisgarh",
          state: "chattishgarh",
        },
        {
          id: 7,
          abb: "DH",
          name: "Dadra and Nagar Haveli",
          state: "dadra-and-nagar",
        },
        {
          id: 8,
          abb: "DD",
          name: "Daman and Diu",
          state: "daman-and-diu",
        },
        {
          id: 9,
          abb: "DL",
          name: "Delhi",
          state: "delhi",
        },
        {
          id: 10,
          abb: "GA",
          name: "Goa",
          state: "goa",
        },
        {
          id: 11,
          abb: "GJ",
          name: "Gujarat",
          state: "gujrat",
        },
        {
          id: 12,
          abb: "HR",
          name: "Haryana",
          state: "haryana",
        },
        {
          id: 13,
          abb: "HP",
          name: "Himachal Pradesh",
          state: "himachal-pradesh",
        },
        {
          id: 14,
          abb: "JK",
          name: "Jammu and Kashmir",
          state: "jammu-and-kashmir",
        },
        {
          id: 15,
          abb: "JH",
          name: "Jharkhand",
          state: "jharkhand",
        },
        {
          id: 16,
          abb: "KA",
          name: "Karnataka",
          state: "karnataka",
        },
        {
          id: 17,
          abb: "KL",
          name: "Kerala",
          state: "kerala",
        },
        {
          id: 18,
          abb: "LD",
          name: "Lakshadweep",
          state: "lakshadweep",
        },
        {
          id: 19,
          abb: "MP",
          name: "Madhya Pradesh",
          state: "madhya-pradesh",
        },
        {
          id: 20,
          abb: "MH",
          name: "Maharashtra",
          state: "maharashtra",
        },
        {
          id: 21,
          abb: "MN",
          name: "Manipur",
          state: "manipur",
        },
        {
          id: 22,
          abb: "ML",
          name: "Meghalaya",
          state: "meghalaya",
        },
        {
          id: 23,
          abb: "MZ",
          name: "Mizoram",
          state: "mizoram",
        },
        {
          id: 24,
          abb: "NL",
          name: "Nagaland",
          state: "nagaland",
        },
        {
          id: 25,
          abb: "OR",
          name: "Odisha",
          state: "odhisha",
        },
        {
          id: 26,
          abb: "PY",
          name: "Puducherry",
          state: "puducherry",
        },
        {
          id: 27,
          abb: "PB",
          name: "Punjab",
          state: "punjab",
        },
        {
          id: 28,
          abb: "RJ",
          name: "Rajasthan",
          state: "rajasthan",
        },
        {
          id: 29,
          abb: "SK",
          name: "Sikkim",
          state: "sikkim",
        },
        {
          id: 30,
          abb: "TN",
          name: "Tamil Nadu",
          state: "tamil-nadu",
        },
        {
          id: 31,
          abb: "TS",
          name: "Telangana",
          state: "telangana",
        },
        {
          id: 32,
          abb: "TR",
          name: "Tripura",
          state: "tripura",
        },
        {
          id: 33,
          abb: "UK",
          name: "Uttar Pradesh",
          state: "uttar-pradesh",
        },
        {
          id: 34,
          abb: "UP",
          name: "Uttarakhand",
          state: "uttarakhand",
        },
        {
          id: 35,
          abb: "WB",
          name: "West Bengal",
          state: "west-bengal",
        },
      ], 
    
    FILE_SIZE:{
      MIN:10,
      MAX:204800,
    },

    TC_TYPE_ENUM: ["SIGNUP","PAYMENT"],
      
    PLAN_FREQ_ENUM: ["YEARLY","MONTHLY"],
    
    STATUS: {
      ACTIVE: 1,
      INACTIVE: 0
    },
    FIRST_PURCHASE:{
      TRUE:1,
      FALSE:0
    },
    MODULE_TYPE : {
      ADMIN: 1,
      GENERAL: 2,
    },

    ADMIN_TYPE: {
        ADMIN: 1,
        APPROVER: 2,
        FINANCE: 3
    },

    CORPO_EMP_AGE : {
      MIN : 14,
      MAX :99
    },

    COUPON_TYPE: {
      INDIVIDUAL: 1,
      CORPORATE: 2,
    },
    COUPON_DISC_TYPE: {
      AMOUNT: 0,
      PERCENT: 1,
    },
    SUBSCRIBER_TYPE: {
      INDIVIDUAL: 1,
      CORPORATE: 2,
    },
    PLAN_TYPE: {
      INDIVIDUAL: 1,
      FAMILY: 2,
    },
    COUPON_DISC_TYPE: {
      AMOUNT: 0,
      PERCENT: 1,
    },
    PLAN_DISCOUNTS: {
      OPD_MAX_DISCOUNT: 100000,
      PHARMACY_MAX_DISCOUNT: 100000,
      LAB_MAX_DISCOUNT: 100000,
    },
    COUPON_USAGE_TYPE: {
      SINGLE: 1,
      MULTIPLE: 2,
    },
    COUPON_STATUS: {
      UNUSED: 0,
      USED: 1,
      EXPIRED: 2,
      FULLY_CONSUMED: 3,
    },
  
    CORPORATE:{
      PLAN_FREQ : {
        YEARLY : 1,
        HALF_YEARLY : 2,
        QUARTERLY : 3,
        MONTHLY : 4
      }
    },

    STRING_LEN :{
      CONDITIONS : 5000,
      DETAILS : 500,
      ADDRESS : 500,
      NAME : 150,
    },

    PRIVILEGE : {
      PROGRAMME : {
        ADMIN : {
          DESIGNATION : { id:1 , value:"Designation Master"},
          USER : { id:2 , value:"Users Master"},
          CORPORATE :{ id:3 , value:"Corporate Master"},
          CORPORATE_EMPLOYEE :{ id:4 , value:"Corporate Subscriber Master"},
          PLANS : { id:5 , value:"Plans Master"},
          TESTS : { id:6 , value:"Test Master"},
          DOCTORS : { id:7 , value:"Doctors Master"},
          COUPONS : { id:8 , value:"Coupons Master"},
          TC : { id:9 , value:"Terms & Conditions Master"} ,
          SYSTEM : { id:10 , value:"System Settings Master"},
          PRIVILEGES : { id:11 , value:"Privileges Master"},
          HEALTH_CHECKUP_PLANS : { id:12 , value:"Health Checkup Plan Master"},
          SPECIALIZATION : { id:13 , value:"Docotrs Specialization"},
          AUDIT_LOGS : { id:30 , value:"Audit Logs"},
          LOGIN_LOGS : { id:31 , value:"Login History"},
        },
        GENERAL : {
          APPROVAL : { id:20 , value:"Approval"},
          CLAIMS : { id:21 , value:"Claims"}
        }
      }},
    MAN_USER_TYPES :{
      GENERAL :0,
      ADMIN : 1,
    },
    DESIGNATIONS : {
      1: { internal_id: 1, name: "MANAGER",  value: "Manager" },
      2: { internal_id: 2, name: "MANAGEMENT", value: "Management" },
      3: { internal_id: 3, name: "VERIFIER", value: "Verifier" },
      4: { internal_id: 4, name: "FINANCE",  value: "Finance" },
    },

    PAYMENT: {
      ORDER_FOR: {
        PLAN: 0,
        HEALTH_TEST: 1,
        PLAN_UPGRADE:2,
        PLAN_RENEW:3,
      },

      GST: 18
    },

    // PASSWORD_VALIDATION_REGEX: new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"),
    PASSWORD_VALIDATION_REGEX: new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#_])[A-Za-z\\d@$!%*?&#_]{8,}$"),

    VERIFIER_ID:"667d424bfb991cc88c45409f",
    MANAGER_ID:"667d427dfb991cc88c4540c5",
    FINANCER_ID:"667d4261fb991cc88c4540b2",

    DEFAULT_PASSWORD: "OPDSURE2024"

}

module.exports = CONSTANTS