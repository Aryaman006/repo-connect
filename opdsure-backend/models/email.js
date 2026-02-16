const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema(
  {
    registration: {
      type: String,
      required: false, 
    },
    signin: {
      type: String,
      required: false, 
    },
    forget_password: {
      type: String,
      required: false, 
    },
    account_recover: {
      type: String,
      required: false, 
    },
    plan_purchase_mail:{
      type: String,
      required: false,
    },
    plan_purchase_failure:{
      type: String,
      required: false,
    },
    hc_plan_purchase_mail:{
      type: String,
      required: false,
    },
    plan_expiry_mail:{
      type: String,
      required: false,
    },
    hc_plan_expiry_mail:{
      type: String,
      required: false,
    },
    claim_submission_mail:{
      type: String,
      required: false,
    },
    claim_approval_mail:{
      type: String,
      required: false,
    },
    claim_rejection_mail:{
      type: String,
      required: false,
    },
    claim_clarification_mail:{
      type: String,
      required: false,
    },
    claim_updation_mail:{
      type: String,
      required: false,
    },
    claim_invalid_mail:{
      type: String,
      required: false,
    },
    claim_settled_mail:{
      type: String,
      required: false,
    },
    dispute_submission_mail:{
      type: String,
      required: false,
    },
    dispute_approval_mail:{
      type: String,
      required: false,
    },
    dispute_rejection_mail:{
      type: String,
      required: false,
    },
    dispute_settled_mail:{
      type: String,
      required: false,
    },
    plan_renew_mail:{
      type: String,
      required: false,
    },
    plan_upgrade_mail:{
      type: String,
      required: false,
    },
    profile_update:{
      type: String,
      required: false,
    },
    profile_update_action:{
      type: String,
      required: false,
    },
    member_status_action:{
      type: String,
      required: false,
    },
    user_add_member:{
      type: String,
      required: false,
    },
    member_personal_details_action:{
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Email = mongoose.model('Email', EmailSchema);

const defaultData = {
  registration: "",
  forget_password: "",
  account_recover: "",
  plan_purchase_mail:"",
  hc_plan_purchase_mail:"",
  plan_expiry_mail:"",
  hc_plan_expiry_mail:"",
  claim_submission_mail:"",
  claim_approval_mail:"",
  claim_rejection_mail:"",
  claim_clarification_mail:"",
  claim_updation_mail:"",
  claim_settled_mail:"",
  dispute_submission_mail: "",
  dispute_approval_mail: "",
  dispute_rejection_mail: "",
  dispute_settled_mail: "",
  plan_upgrade_mail:"",
  plan_renew_mail:"",
  profile_update_action:"",
  profile_update:"",
  member_status_action:"",
  user_add_member:"",
  member_personal_details_action:"",
  plan_purchase_failure:"",
  signin:""
}

const initializeSettings = async () => {
  try {
    const count = await Email.countDocuments();
    if (count == 0) {
      await Email.create(defaultData);
      console.log('Initialized default settings');
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
};

initializeSettings();
module.exports = Email;
