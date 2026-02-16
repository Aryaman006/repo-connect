const mongoose = require("mongoose");
const { CONSTANTS } = require("../Constant");

const ClaimSchema = new mongoose.Schema(
    {
        opd_date: {
            type: String,
            required: true,
        },
        doc_name: {
            type: String,
            required: true,
        },
        doc_email: {
            type: String,
            required: false,
        },
        doc_country_code: {
            type: String,
            required: true,
        },
        doc_phone: {
            type: Number,
            required: true,
        },
        claim_id:{
            type: String,
            required: true,
        },
        doc_registration: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,     
            required: false,
        },
        doc_address: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        diagonosis_detail: {
            type: String,
            required: false,
        },
        doctor_fee: {
            type: Number,
            require: true
        },
        pharmacy_fee: {
            type: Number,
            require: false
        },
        lab_test_fee: {
            type: Number,
            require: false
        },
        combined_pharmacy_test_fees: {
            type: Number,
            require: false
        },
        claimable_doctor_fee: {
            type: Number,
            require: true
        },
        claimable_pharmacy_fee: {
            type: Number,
            require: false
        },
        claimable_lab_test_fee: {
            type: Number,
            require: false
        },
        claimable_combined_pharmacy_test_fees: {
            type: Number,
            require: false
        },
        bill_amount: {
            type: Number,
            require: true
        },
        claimable_amount: {
            type: Number,
            require: true 
        },
        approved_claimable_amount: {
            type: Number,
            require: true 
        },
        approved_claimable_doctor_fee: {
            type: Number,
            require: true
        },
        approved_claimable_pharmacy_fee: {
            type: Number,
            require: false
        },
        approved_claimable_lab_test_fee: {
            type: Number,
            require: false
        },
        approved_claimable_combined_pharmacy_test_fees: {
            type: Number,
            require: false
        },
        specialization: {
            type: String,
            require: true
        },
        claim_type: {
            type: Number,
            required: true,
        },
        claim_combination: {
            type: Number,
            required: true,
        },
        hospital: {
            type: String,
            require: true
        },
        user_remark: {
            type: String,
            require: true
        },
        fee_receipt: {
            type: [String],
            require: false
        },
        prescription: {
            type: [String],
            require: false
        },
        pharmacy_receipt: {
            type: [String],
            require: false
        },
        test_receipt: {
            type: [String],
            require: false
        },
        test_reports: {
            type: [String],
            require: false
        },
        status: {
            type: Number,
            required: true,
            default: CONSTANTS.CLAIM.STATUS.PENDING
        },
        internal_status: {
            type: Number,
            required: true,
            default: CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION,
        },
        member_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "families",
            required: true
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        assigned_to_approver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "managmentusers",
            required: false,
        },
        assigned_to_verifier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "managmentusers",
            required: false,
        },
        assigned_to_manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "managmentusers",
            required: false,
        },
        assigned_to_financer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "managmentusers",
            required: false,
        },
        verifier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "managmentusers",
            default: null,
        },
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "managmentusers",
            default: null,
        },
        financer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "managmentusers",
            default: null,
        },
        remark: [
            new mongoose.Schema({
                designation: {
                  type: Number,
                  required: false,
                  default: null
                },
                approver_id: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "managmentusers",
                  required: false,
                  default: null
                },
                message: {
                  type: String,
                  required: false
                },
                message_claim_internal_status: {
                  type: Number,
                  required: false,
                  default: null
                }
              }, {
                timestamps: { createdAt: true, updatedAt: false }
              })
         ],
        subscriber_reaction:{
            type: Boolean,
            default: false
        },
        resubmission: {
            type: Boolean,
            default: false
        },
        dispute:{
            type:Boolean,
            default: false
        },
        subscriber_remark: [
            new mongoose.Schema({
                designation: {
                  type: Number,
                  default: null
                },
                approver_id: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "managmentusers",
                  default: null
                },
                message: {
                  type: String,
                  required: true
                },
                message_claim_internal_status: {
                  type: Number,
                  default: null
                }
              }, {
                timestamps: { createdAt: true, updatedAt: false }
              })
         ],
        claim_closure_Date: {
            type: Date,
            required: false
        }         
    },
    { timestamps: true }
);

module.exports = mongoose.model("claims", ClaimSchema);
