const sendMail = require("./SendMail");
const {SendSMS, SendSMSAwait} = require("./SendSMS");
const sendMailBrevo = require("./SendMailBrevo");
const axios = require("axios")
const { EmailTemplate } = require("../Helper")
const { v4: uuidv4 } = require("uuid")
const { handleFileUploadToS3, getImageUrl, getImageUrl1 } = require("./s3")
const { ManagementUserDal, DesigDal, UserAuthDal, CouponUsagesDal, CouponDal, CorpoDal, UserNotificationsDAL, ManagementNotificationsDAL, AdminNotificationsDAL } = require("../DAL");
const { CONSTANTS } = require("../Constant");
const config = require("../Config");
const { CONSTANTS_MESSAGES } = require("../Helper");
const ApiError = require("./ErrorHandler");
const { claimApproval, claimClarification, claimUpdation } = require("../Helper/email.template");
const dayjs = require("dayjs");
const bcrypt = require("bcrypt");
const {StatusCodes} = require("http-status-codes");
const Utils = {
    SendSMS :{
      SignIn: async (data) => {
        // return;
        let message = `Dear ${data.name},

Thanks for choosing OPDSure your Assured Health Partner! 

To login to your account, use One-Time Password (OTP): ${data.otp}. This OTP is valid for the next 10 minutes.

Thank you

Best regards,
The OPDSure Team` ;
       
        return SendSMS({phone:data.phone,message:message});
    },

      SignUp: async (data) => {
        // return;
        let message = `Dear User,

Welcome aboard OPDSure! To complete your registration, please use the following One-Time Password (OTP) ${data.otp} This OTP is valid for the next 10 minutes.

Thank you for choosing OPDSure!

Best regards,
The OPDSure Team` ;
       
        return SendSMS({phone:data.phone,message:message});
    },

    ForgotPassword: async (data) => {
      return;
      let message = `Dear ${data.name},

${data.otp} is the OTP to reset your password. This OTP is confidential and will be valid for 10 minutes. If you did not initiate this request, please contact us immediately at +91-9810113654 or email us at support@opdsure.com.

Best regards,
The OPDSure Team`
     
      return SendSMS({phone:data.phone,message:message});
    },

    ClaimSubmission : async (data) => {
      // return;
      let message = `Dear ${data.name},

Your claim (ID: ${data.claim_id}) has been successfully submitted to OPDSure. We will keep you updated on the status.

Thank you for partnering with OPDSure for your health needs!

Best regards,
The OPDSure Team`
     
      return SendSMS({phone:data.phone,message:message});
    },
    PlanExpired : async (data) => {
      return;
      let message;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    ProfileUpdateUser : async (data) => {
      return;
      let message;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    ProfileUpdateAdmin : async (data) => {
      return;
      let message;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    MemberPlanUpdateAdmin : async (data) => {
      return;
      let message;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    MemberUpdateAdmin : async (data) => {
      return;
      let message;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    UserAddMember : async (data) => {
      // return;
      let message=`Dear ${data.name},

A new family member has been successfully added to your OPDSure account. Log in to view the details.

Thank you for choosing OPDSure!

Best regards,
The OPDSure Team`;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    AdminAddMember : async (data) => {
      // return;
      let message=`Dear ${data.name},

A new family member has been successfully added to your OPDSure account. Log in to view the details.

Thank you for choosing OPDSure!

Best regards,
The OPDSure Team`;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },

    ClaimUpdation : async (data) => {
      return;
      let message;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },

    ClaimApproval : async (data) => {
      // return;
      let message=`Dear ${data.name},

Your claim (ID: ${data.claim_id}) has been Approved by OPDSure. For more details, please log in to your account.

Thank you for choosing OPDSure as your health partner!

Best regards,
The OPDSure Team`;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    ClaimSettled : async (data) => {
      // return;
      let message=`Dear ${data.name},

The payment for your claim (ID: ${data.claim_id}) has been released. Please check your email for payment details.

Thank you for trusting OPDSure with your health!

Best regards,
The OPDSure Team`;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    MemberUpdateUser : async (data) => {
      // return;
      let message=`Dear ${data.name},

A request to update family member details has been raised for your OPDSure account. We will notify you of any further updates.

Thank you for choosing OPDSure!

Best regards,
The OPDSure Team`;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    MemberUpdateAdmin : async (data) => {
      // return;
      let message=`Dear ${data.name},

A request to update family member details has been raised for your OPDSure account. We will notify you of any further updates.

Thank you for choosing OPDSure!

Best regards,
The OPDSure Team`;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },

    ClaimRejection : async (data) => {
      return;
      let message;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },

    ClaimClarification : async (data) => {
      // return;
      let message=`Dear ${data.name},

We need additional information regarding your claim (ID: ${data.claim_id}). Please log in to your OPDSure account to provide the required details.

Thank you for your cooperation!

Best regards,
The OPDSure Team`;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    ClaimInvalid : async (data) => {
      return;
      let message;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    PlanPurchase : async (data) => {
      return;
      let message;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    DisputeApproval : async (data) => {
      // return;
      let message=`Dear ${data.name},

Your dispute (ID: ${data.claim_id}) has been ${data.status} by OPDSure. For more information, please log in to your account.

Thank you for choosing OPDSure!

Best regards,
The OPDSure Team`;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    RaiseDispute : async (data) => {
      // return;
      let message=`Dear ${data.name},

Your dispute (ID: ${data.claim_id}) has been successfully raised with OPDSure. We will keep you informed of any updates.

Thank you for your continued trust in OPDSure!

Best regards,
The OPDSure Team`;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },

    DisputeRejection : async (data) => {
      // return;
      let message=`Dear ${data.name},

Your dispute (ID: ${data.claim_id}) has been ${data.status} by OPDSure. For more information, please log in to your account.

Thank you for choosing OPDSure!

Best regards,
The OPDSure Team`;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    PlanPurchase : async (data) => {
      return;
      let message;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    PlanPurchaseFail : async (data) => {
      return;
      let message;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    PlanUpgrade : async (data) => {
      return;
      let message;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    PlanRenew : async (data) => {
      return;
      let message;
      let accusage;
      return SendSMS({phone:data.phone,message:message});
    },
    },
    SendSMSAwait : async (params) => await SendSMSAwait(params),
    sendMail: {
        SignUp: async (data) => {
            const msg = EmailTemplate.SignUp(data)
            return sendMail(msg)
        },

        ForgotPassword: async (data) => {
            const msg = EmailTemplate.ForgotPassword(data)
            return sendMail(msg)
        },

        ClaimSubmission : async (data) => {
            const msg = EmailTemplate.ClaimSubmission(data)
            return sendMail(msg)
        },

        ClaimUpdation : async (data) => {
            const msg = EmailTemplate.ClaimUpdation(data)
            return sendMail(msg)
        },

        ClaimApproval : async (body,subject,user,params) => {
            const msg = EmailTemplate.ClaimApproval(body,subject,user,params)
            return sendMail(msg)
        },

        ClaimRejection : async (data) => {
            const msg = EmailTemplate.ClaimRejection(data)
            return sendMail(msg)
        },

        ClaimClarification : async (data) => {
            const msg = EmailTemplate.ClaimClarification(data)
            return sendMail(msg)
        },
        ClaimInvalid : async (data) => {
          const msg = EmailTemplate.ClaimInvalid(data)
          return sendMail(msg)
        },
        PlanPurchase : async (data) => {
          const msg = EmailTemplate.PlanPurchase(data)
          return sendMail(msg)
        },
    },

    sendBrevoMail: {
      SignUp: async (data) => {
          const msg = EmailTemplate.SignUp(data)
          return sendMailBrevo(msg)
      },

      ForgotPassword: async (data) => {
          const msg = EmailTemplate.ForgotPassword(data)
          return sendMailBrevo(msg)
      },

      AccountRecover : async (data) => {
        return sendMailBrevo(data.template,data.subject,data.user,data.params)
    },

      ClaimSubmission : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      RetailFormSubmitUser : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      RetailFormSubmitAdmin : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      CorpoFormSubmitUser : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      CorpoFormSubmitAdmin : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      EmailFormSubmitUser : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      EmailFormSubmitAdmin : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      DoctorFormSubmitUser : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      DoctorFormSubmitAdmin : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      JobFormSubmitUser : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      JobFormSubmitAdmin : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      PlanExpired : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      ProfileUpdateUser : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      ProfileUpdateAdmin : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      MemberPlanUpdateAdmin : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      MemberUpdateAdmin : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      UserAddMember : async (data) => {
          // const msg = EmailTemplate.ClaimSubmission(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },

      ClaimUpdation : async (data) => {
          // const msg = EmailTemplate.ClaimUpdation(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },

      ClaimApproval : async (data) => {
          // const msg = EmailTemplate.ClaimApproval(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },

      ClaimRejection : async (data) => {
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },

      ClaimClarification : async (data) => {
          // const msg = EmailTemplate.ClaimClarification(data)
          return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      ClaimInvalid : async (data) => {
        // const msg = EmailTemplate.ClaimInvalid(data)
        return sendMailBrevo(data.template,data.subject,data.user,data.params)
      },
      PlanPurchase : async (data) => {
        const msg = EmailTemplate.PlanPurchase(data)
        return sendMailBrevo(msg)
      },
      DisputeApproval : async (data) => {
        // const msg = EmailTemplate.ClaimApproval(data)
        return sendMailBrevo(data.template,data.subject,data.user,data.params);
      },
      RaiseDispute : async (data) => {
        // const msg = EmailTemplate.ClaimApproval(data)
        return sendMailBrevo(data.template,data.subject,data.user,data.params);
      },

      DisputeRejection : async (data) => {
        return sendMailBrevo(data.template,data.subject,data.user,data.params);
      },
      PlanPurchase : async (data) => {
        return sendMailBrevo(data.template,data.subject,data.user,data.params);
      },
      PlanPurchaseFail : async (data) => {
        return sendMailBrevo(data.template,data.subject,data.user,data.params);
      },
      PlanUpgrade : async (data) => {
        return sendMailBrevo(data.template,data.subject,data.user,data.params);
      },
      PlanRenew : async (data) => {
        return sendMailBrevo(data.template,data.subject,data.user,data.params);
      },
      ResetAdminPass : async (data) => {
        return sendMailBrevo(data.template,data.subject,data.user,data.params)
    },
      ResetManagPass : async (data) => {
        return sendMailBrevo(data.template,data.subject,data.user,data.params)
    },
  },

    generateRandomToken: async () => { return uuidv4() },

    generateOTP: async () => { return Math.floor(100000 + Math.random() * 900000) },

    UploadFile: handleFileUploadToS3,

    getFileURL: getImageUrl,
    getFileURL1: getImageUrl1,

    AssignClaim: async (internal_id) => {
      const designation = await DesigDal.CheckUniqueDesignation(internal_id);
      const management_users = await ManagementUserDal.GetUsers({ designation: designation._id });
    
      let assignedToUser = null;
    
      for (let i = 0; i < management_users.length; i++) {
        const currentUser = management_users[i];
        const nextUser = management_users[(i + 1) % management_users.length];
    
        if (currentUser.claim_assign) {
          assignedToUser = nextUser;
          await ManagementUserDal.EditUser({ _id: currentUser._id }, { claim_assign: false });
          await ManagementUserDal.EditUser({ _id: nextUser._id }, { claim_assign: true });
          break;
        } else if (i === management_users.length - 1) {
          assignedToUser = currentUser;
          await ManagementUserDal.EditUser({ _id: assignedToUser._id }, { claim_assign: true });
        }
      }
    
      // Return full user object with name and email
      if (assignedToUser) {
        return {
          _id: assignedToUser._id,
          name: assignedToUser.name,
          email: assignedToUser.email
        };
      } else {
        return null;
      }
    },
    

    CalculateClaimableAmount: async ( amount, claimType, planDetails ) => {
      const {
        opd_max_discount,
        opd_precent_discount,
        lab_max_discount,
        lab_precent_discount,
        pharmacy_max_discount,
        pharmacy_precent_discount,
        combined_lab_plus_test_percent,
        combined_lab_plus_test_max_discount } = planDetails;
        let finalPrice = 0;

        if(claimType === CONSTANTS.CLAIM.TYPE.OPD){
          let temp = (amount * opd_precent_discount ) / 100 ;
          finalPrice = ( temp <= opd_max_discount ) ? temp : opd_max_discount
        }else if(claimType === CONSTANTS.CLAIM.TYPE.PHARMACY){
          let temp = (amount * pharmacy_precent_discount ) / 100 ;
          finalPrice = ( temp <= pharmacy_max_discount ) ? temp : pharmacy_max_discount
        }else if(claimType === CONSTANTS.CLAIM.TYPE.LAB_TEST){
          let temp = (amount * lab_precent_discount ) / 100 ;
          finalPrice = ( temp <= lab_max_discount ) ? temp : lab_max_discount
        }else if(claimType === CONSTANTS.CLAIM.TYPE.COMBINED_PHARMACY_LAB){
          let temp = (amount * combined_lab_plus_test_percent ) / 100 ;
          finalPrice = ( temp <= combined_lab_plus_test_max_discount ) ? temp : combined_lab_plus_test_max_discount
        }
        return parseFloat(finalPrice.toFixed(2));
    },

    CalculateExpiryDate: async ( userDetails, extendedValidDays ) =>{
      let oldStartDate = dayjs().toISOString();
      let oldExpDate = dayjs().toISOString();
      let expectedExpDate = dayjs().add(extendedValidDays,"day");
      let finalExpDate = dayjs().toISOString();
      if(userDetails){
        oldStartDate = dayjs(userDetails.plan.start_date);
        oldExpDate = dayjs(userDetails.plan.end_date);
      }
      if(expectedExpDate.isBefore(oldExpDate)){
        finalExpDate = expectedExpDate.toISOString();
      }else{
        const balanceDays = oldExpDate.diff(dayjs(),"day");
        if(balanceDays > 0){
          finalExpDate = dayjs().add(extendedValidDays,"day").toISOString()
        }
      }
      return finalExpDate;
    },
  
    PayAmount: async (amount, user) => {
      const requestBody = {
        account_number: `${config.RAZORPAY_ACCOUNT_NUMBER}`,
        contact: {
          name: `${user.name}`,
          contact:`${user.phone}`,
          email: `${user.email}`,
          type: 'customer'
        },
        amount: amount,
        currency: 'INR',
        purpose: 'refund',
        description: `Claim reimbursement for ${user.name}`,
        send_sms: true,
        send_email: true
      }
      return await axios({
        method: 'post',
        url: 'https://api.razorpay.com/v1/payout-links',
        headers: {
          'Content-Type': 'application/json'
        },
        auth: {
          username: config.RAZORPAY_KEY_ID_TO_PAY,
          password: config.RAZORPAY_KEY_SECRET_TO_PAY
        },
        data: requestBody
      })
    },

    GenerateHashedPassword : async (password) => {
      try{
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password,salt);
      }
      catch (error) {
        return null;
      }
    },

    CalculateDiscount : (discount_type,discount,price) => {
      if (discount_type === CONSTANTS.COUPON_DISC_TYPE.AMOUNT) {
       return  ( price - discount );
      } else {
        return ((price * discount) / 100);
      }
    },

    VerifyCoupon : async (coupon_code, user, price) => {
        let calculatedDiscount = 0;
        if(coupon_code == null ) throw new ApiError(CONSTANTS_MESSAGES.INVALID_COUPON_CODE, StatusCodes.BAD_REQUEST);
        let coupon = await CouponDal.GetCoupon({coupon_code: coupon_code.toLowerCase()});
        if( coupon == null ) throw new ApiError(CONSTANTS_MESSAGES.INVALID_COUPON_CODE, StatusCodes.BAD_REQUEST);
        const { discount_type, discount, coupon_type, end_date,corporate,usage_type,usage } = coupon;
        if ((dayjs(end_date)).isBefore(dayjs())) throw new ApiError(CONSTANTS_MESSAGES.EXPIRED_COUPON_CODE, StatusCodes.BAD_REQUEST);
        
        if(user.subscriber_type === CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL && coupon_type === CONSTANTS.COUPON_TYPE.CORPORATE){
          throw new ApiError(CONSTANTS_MESSAGES.NOT_VALID_FOR_RETAIL_USERS, StatusCodes.BAD_REQUEST);
        }
        if(user.subscriber_type === CONSTANTS.SUBSCRIBER_TYPE.CORPORATE && coupon_type === CONSTANTS.COUPON_TYPE.INDIVIDUAL){
          throw new ApiError(CONSTANTS_MESSAGES.NOT_VALID_FOR_CORPORATE_USERS, StatusCodes.BAD_REQUEST);
        }

        if(usage_type===CONSTANTS.COUPON_USAGE_TYPE.SINGLE){
          const timesConsumed = await CouponUsagesDal.GetRecordCount({ user:user._id, coupon:coupon._id });
         
          if(timesConsumed>=1) throw new ApiError(CONSTANTS_MESSAGES.COUPON_ALREADY_USED, StatusCodes.BAD_REQUEST);
         
          if(user.subscriber_type === CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL){
            calculatedDiscount = Utils.CalculateDiscount(discount_type,discount,price);
          }else{
            if(user.corporate != null){
              if(!corporate.equals(user.corporate))  throw new ApiError(CONSTANTS_MESSAGES.NOT_VALID_FOR_THIS_CORPORATE, StatusCodes.BAD_REQUEST);
            }
            
            calculatedDiscount = Utils.CalculateDiscount(discount_type,discount,price);
          }
        }else{
          const timesConsumed = await CouponUsagesDal.GetRecordCount({ user:user._id, coupon:coupon._id });
         
          if(timesConsumed>=usage) throw new ApiError(CONSTANTS_MESSAGES.EXCEEDED_MAX_ALLOWED_USAGE, StatusCodes.BAD_REQUEST);
          if(user.subscriber_type === CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL){
            calculatedDiscount = Utils.CalculateDiscount(discount_type,discount,price);
          }else{
            if(user.corporate != null ){
              if(!corporate.equals(user.corporate))  throw new ApiError(CONSTANTS_MESSAGES.NOT_VALID_FOR_THIS_CORPORATE, StatusCodes.BAD_REQUEST);

            }
            
            calculatedDiscount = Utils.CalculateDiscount(discount_type,discount,price);
          }

        }
        return calculatedDiscount;
    },

    CreateCouponConsumption: async (coupon_id, user_id, plan_id, health_plan_id,amount,discount) => {
      await CouponUsagesDal.CreateCouponUsage({
        coupon: coupon_id,
        user: user_id,
        plan: plan_id,
        health_plan: health_plan_id,
        amount,
        discount
      })
    },

    CreateManagementNotification: async (user,message) => {
      ManagementNotificationsDAL.AddNotification({ user, message});
    },
    CreateUserNotification: async (user,message) => {
      UserNotificationsDAL.AddNotification({ user, message});
    },
    CreateAdminNotification: async (user,message) => {
      await AdminNotificationsDAL.AddNotification({ user, message});
    },
}

module.exports = Utils