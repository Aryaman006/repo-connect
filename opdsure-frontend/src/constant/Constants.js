const CONSTANTS = {
  REGEX: {
    // EMAIL: new RegExp("^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"),
    NUMBER: /^\d+$/,
    PHONE: /^[0-9]{10,13}$/,
    MOBILE: /^[0-9]{10}$/,
    MOBILE_FIXED: /^\+91[0-9]{10}$/,
    ADDRESS: new RegExp("^[a-zA-Z0-9\\s\\-\\,\\&\\/\\(\\)]{0,100}$"),
    COUNTRY_CODE: /^(\+?\d{1,3}|\d{1,4})$/,
    FILE_TYPE: /^[A-Za-z]+(,[A-Za-z]+)*$/,
    DOC_REGESTRATION: /^[a-zA-Z0-9\-_/.\s]+$/,
    NAME:/^[a-zA-Z0-9 ._/&@-]+$/,
    DOCTOR_NAME:/^[a-zA-Z0-9 ]+$/,
    TEST_LISTS: /^(?:(?:[a-zA-Z0-9&\-_/\"'() ]+),)*(?:[a-zA-Z0-9&\-_/\"'() ]+)$/,
    PINCODE:  /^[1-9][0-9]{5}$/,
    PERSON_NAME:/^[a-zA-Z .]+$/,
  },
  HEALTH_CHECKUP: {
  
    STATUS: {
      PENDING: 0,
      DONE: 1,
      CANCELED: 2
    },
  },


  HEAR_OPTIONS : [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'references', label: 'References' },
    { value: 'newspaper', label: 'Newspaper' },
    { value: 'googleads', label: 'GoogleAds'},
    {value:'website', label:'Website'},
    { value: 'other', label: 'Other' },
  ],
  
  NO_OF_EMPLOYEES_OPTIONS : [
    { value: 1, label: '0 - 20' }, 
    { value: 2, label: '21 - 50' },
    { value: 3, label: '51 - 100' },
    { value: 4, label: '101 - 200' },
    { value: 5, label: '201 - 500' },
    { value: 6, label: '501 - 5000' },
    { value: 7, label: '5001 & Above' },
  ],

  DOCTOR:{
    NOACTION_BY_ADMIN:0,
    APPROVED_BY_ADMIN: 1,
    ADDED_BY_ADMIN: 3,
    REJECTED_BY_ADMIN: 2,
    ADDED_BY_DOCTOR: 4,
  },

  GENDER: {
    MALE: 1,
    FEMALE: 2,
    OTHER: 3,
  },

  STATUS: {
    ACTIVE: 1,
    INACTIVE: 0,
  },
  COUPON_TYPE: {
    INDIVIDUAL: 1,
    CORPORATE: 2,
  },
  SUBSCRIBER_TYPE: {
    INDIVIDUAL: 1,
    CORPORATE: 2,
  },
  PLAN_TYPE: {
    INDIVIDUAL: 1,
    FAMILY: 2,
  },
  MEMBERSHIP_TYPE: {
    INDIVIDUAL: 1,
    FAMILY: 2,
  },
  COUPON_DISC_TYPE: {
    AMOUNT: 0,
    PERCENT: 1,
  },
  PLAN_DISCOUNTS: {
    OPD_MAX_AMOUNT: 50000,
    PHARMACY_MAX_DISCOUNT: 50000,
    LAB_MAX_DISCOUNT: 50000,
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
  CORPO_EMP_AGE: {
    MIN: 14,
    MAX: 99,
  },
  MODULE_TYPE : {
    ADMIN: 1,
    GENERAL: 2,
  },
  PLAN_STATUS: {
    UNPAID: 0,
    PAID: 1
  },
  CORPORATE:{
    PLAN_FREQ : {
      YEARLY : 1,
      HALF_YEARLY : 2,
      QUARTERLY : 3,
      MONTHLY : 4
    }
  },
  PLAN_FREQ_ENUM: ["YEARLY", "MONTHLY"],

  STRING_LEN :{
    CONDITIONS : 50000,
    DETAILS : 500,
    ADDRESS : 500,
    NAME : 150,
    EMAILTEMPLATE : 5000,
    DISCLAIMER: 10000,
  },
  FIRST_PURCHASE:{
    TRUE:1,
    FALSE:0
  },
  MAN_USER_TYPES :{
    GENERAL :0,
    ADMIN : 1,
  },
  REVIEW_STATUS: {
    PENDING: 0,
    ACCEPTED: 1,
    REJECTED: 2
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

  PASSWORD_VALIDATION_REGEX: new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
  ),

  PAYMENT: {
    ORDER_FOR: {
      PLAN: 0,
      HEALTH_TEST: 1,
      PLAN_UPGRADE:2,
      PLAN_RENEW:3,
    },
    GST: 18
  },


  FORMATS: {
    DATE: "DD/MM/YYYY",
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
        AUDIT_LOGS : { id:30 , value:"Audit Logs"},
        LOGIN_LOGS : { id:31 , value:"Login History"},
      },
      GENERAL : {
        APPROVAL : { id:20 , value:"Approval"},
        CLAIMS : { id:21 , value:"Claims"}
      }
    }
  },

   internalStatusEnum :{
    0: "No Action",
    1: "Approved by Approver",
    2: "Approved by Verifier",
    3: "Approved by Financer",
    4: "Approved by Admin",
    5: "Rejected",
  },
  
  claimTypeEnum : {
    0: "OPD",
    1: "Pharmacy",
    2: "Lab Test",
    3: "Combined pharmacy + lab test",
  },
  CLAIM_COMBINATION : {
    SEPERATE :1,
    PHARMACY_LAB_COMBINED:2
  },

  claimStatusEnum : {
    0: "Pending",
    1: "Approved",
    2: "Rejected",
    3: "Duplicate",
  },

  CLAIM_STATUS : {
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
  },
  USER_ROLES:{
    ADMIN: 1,
    MANAGEMENT_USER: 2,
    GENERAL_USER: 3,
    HR_USER: 4,
  },

  DESIGNATIONS : {
    1: { internal_id: 1, name: "MANAGER",  value: "Manager" },
    2: { internal_id: 2, name: "MANAGEMENT", value: "Management" },
    3: { internal_id: 3, name: "VERIFIER", value: "Verifier" },
    4: { internal_id: 4, name: "FINANCE",  value: "Finance" },
  },
  MEMBERSHIP_OPTIONS : {
    0: { id: 0, name: "Individual",  member_count: 1 },
    1: { id: 1, name: "Applicant + Spouse + upto 2 Childs (Below 21 years)",  member_count: 4 },
    2: { id: 2, name: "Applicant + 1 Member", member_count: 2 },
    3: { id: 3, name: "Applicant + 2 Member", member_count: 3 },
    4: { id: 4, name: "Applicant + 3 Member", member_count: 4 },
    5: { id: 5, name: "Applicant + 4 Member", member_count: 5 },
    6: { id: 6, name: "Applicant + 5 Member", member_count: 6 },
    7: { id: 7, name: "Applicant + 6 Member", member_count: 7 },
    8: { id: 8, name: "Applicant + 7 Member", member_count: 8 },
    9: { id: 9, name: "Applicant + 8 Member", member_count: 9 },
    10: { id: 10, name: "Applicant + 9 Member", member_count: 10 },
  },
  
  COMPANY_DETAILS :{
    CONTACT_NO : "+91-9810113654",
    ADDRESS : "Noida, Uttar Pradesh - 201304",
    HELPLINE_NO : "+91-9810113654",
    SUPPORT_MAIL_ID: "support@opdsure.com",
    FULL_ADDRESS:"OPDSure Altf Tower, Sector 142, Noida, Uttar Pradesh - 201304",
    LINKEDIN :"https://www.linkedin.com/company/finlyt-solutions-private-limited/",
    FACEBOOK:"https://www.facebook.com/opdsure/",
    INSTAGRAM:"https://www.instagram.com/opdsure/",
    YOUTUBE:"https://www.youtube.com/@OPDSure",
    TWITTER:"https://x.com/OpdSure",
    TUMBLUR:"https://x.com/OpdSure",
    PHARMA_EASY:"https://pharmeasy.in/online-medicine-order?utm_source=alz-finlyt&utm_medium=alliance&utm_campaign=finlyt-20april2022",
    APOLLO_24:"https://www.apollopharmacy.in/?utm_source=HANA_Brand&utm_medium=Brand&utm_campaign=OPDSure_Pharma",
    PLAY_STORE:"https://play.google.com/store/apps/details?id=io.app.opdsure",
    APP_STORE:"https://apps.apple.com/in/app/opdsure/id6689494899",
    TM:"6246892, 6246893",
    COI:"U74999UP2021PTC155131",
    CERT:"D1PP103946",
    GST:"09AAECF8058N1ZY",
    NAME : "Finlyt Solutions Pvt. Ltd."
  }
 
};

export default CONSTANTS;
