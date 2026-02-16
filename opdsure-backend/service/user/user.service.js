const bcrypt = require("bcrypt");
const axios = require("axios");
// const { doctorsfromclaims } = require("../../models/doctorfromclaims.model.js");
const DoctorsFromClaims = require("../../models/doctorfromclaims.model.js");
const mongoose = require('mongoose');
const { CONSTANTS_MESSAGES, NOTIFICATIONS } = require("../../Helper");
const otpGenerator = require('otp-generator');
const { 
  UserAuthDal,
  FamilyDAL,
  UpdateMemberDAL,
  ClaimDAL,
  CouponDal,
  HealthCheckDal,
  PlanDal,
  PaymentDal,
  HealthCheckupPlanDal,
  DisputedClaimsDAL,
  EmailDal,
  ReferedUsersDAL,
  WalletTransactionDal,
  PlanRenewDal,
  CorporateHrDAL,
  CouponUsagesDal,
  PurchasedHealthCheckupDal,
  UserNotificationsDAL,
  ManagementNotificationsDAL,
  AdminNotificationsDAL,
  SignupOtpDal,
  BlogsDal,
  SigninOtpDal,
  MfineSubsDal,
} = require("../../DAL");
const { JwtSign, ApiError, Utils, GetExtendedDays } = require("../../Utils");
const { StatusCodes } = require("http-status-codes");
const TokenServices = require("../token.service");
const config = require("../../Config");
const { CONSTANTS } = require("../../Constant");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const dayjs = require("dayjs");
const { healthcheck } = require("../../models/index.js");

const UserSideService = {
  CalculatePlanPrice: async (user_id,data) => {
    const { plan_id, membership_id, coupon_code, order_for, health_plan_id } = data
    let membership_option, plan, health_plan, price
    let calculatedDiscount = 0;
    const userData = await UserAuthDal.GetUser({ _id:user_id },"-token -password");
    if(!userData) throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND );
    if (order_for == CONSTANTS.PAYMENT.ORDER_FOR.PLAN) {
      plan = await PlanDal.GetPlan({ _id: plan_id });
      if (!plan) {
        throw new ApiError(CONSTANTS_MESSAGES.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND)
      }
      membership_option = plan.membership_options.filter((m) => m.membership_id == membership_id);
      membership_option = membership_option[0];
      price = membership_option.charges
    } else {
      health_plan = await HealthCheckupPlanDal.GetHealthCheckupPlan({ _id: health_plan_id })
      if (!health_plan) {
        throw new ApiError(CONSTANTS_MESSAGES.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND)
      }
      price = health_plan.discounted_price
    }
    if (coupon_code) {
    //   let coupon = await CouponDal.GetCoupon({coupon_code: coupon_code.toLowerCase()});
    //   if (coupon) {
    //   const { discount_type, discount, coupon_type, end_date } = coupon;
    //   if (new Date > end_date) throw new ApiError(CONSTANTS_MESSAGES.EXPIRED_COUPON_CODE, StatusCodes.BAD_REQUEST);
    //   if (discount_type === CONSTANTS.COUPON_DISC_TYPE.AMOUNT) {
    //     calculatedDiscount = price - discount;
    //   } else {
    //     calculatedDiscount =(price * discount) / 100;
    //   }
    // }
    calculatedDiscount = await Utils.VerifyCoupon(coupon_code,userData,price);
  }
    let gst = ( (price - calculatedDiscount) * CONSTANTS.PAYMENT.GST) / 100
    if(price - calculatedDiscount <= 0 ){
      calculatedDiscount = price
      gst = 0
    }
    return { plan_price: price, gst, coupon_discount: calculatedDiscount };
  },

  CalculateUpgradePlanPrice: async (user_id,data) => {
    const { plan_id, membership_id, coupon_code, order_for } = data;
    let membership_option, plan,  price,memberCount=0,oldStartDate,oldEndDate;
    let calculatedDiscount = 0, preDiscount=0, oldPricePaid=0, daysUsed=0, daysLeft=0;
    const userData = await UserAuthDal.GetUser({ _id:user_id },"-token -password");
    if(!userData) throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND );
    oldStartDate = userData.plan.start_date;
    oldEndDate = userData.plan.end_date;
    oldPricePaid = Math.ceil(userData.plan.paid_price / 1.18);
    if(dayjs(oldEndDate).isBefore(dayjs(),"day")) throw new ApiError(CONSTANTS_MESSAGES.PLAN_EXPIRED_UPGRADE, StatusCodes.BAD_REQUEST);
   
    const userPlanDetails = await PlanDal.GetPlan({_id:userData.plan.id},"membership_options");
    const userMembershipDetails = userPlanDetails.membership_options.find(m=>m.membership_id===userData.plan.membership_id)
    
    if (order_for == CONSTANTS.PAYMENT.ORDER_FOR.PLAN_UPGRADE) {
      plan = await PlanDal.GetPlan({ _id: plan_id });

      if (!plan) throw new ApiError(CONSTANTS_MESSAGES.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND)
  
      membership_option = plan.membership_options.filter((m) => m.membership_id == membership_id);
      membership_option = membership_option[0];
      price = membership_option.charges;
      memberCount = membership_option.member_count;
      daysUsed = dayjs().diff(dayjs(oldStartDate),"day");
      daysLeft = dayjs(oldEndDate).diff(dayjs(),"day");
      if(daysUsed>0){
        preDiscount = Math.ceil(oldPricePaid - oldPricePaid* (daysUsed / 365));
      }else if(daysUsed===0){
        preDiscount = oldPricePaid;
      }      
      if(preDiscount<0)preDiscount=0;
      
    } 
  
    if( price < userMembershipDetails.charges && memberCount < userMembershipDetails.member_count ) throw new ApiError(CONSTANTS_MESSAGES.CANNOT_DOWNGRADE_PLAN, StatusCodes.BAD_REQUEST );
   
    if (coupon_code) {
    //   let coupon = await CouponDal.GetCoupon({coupon_code: coupon_code.toLowerCase()});
    //   if (coupon) {
    //   const { discount_type, discount, coupon_type, end_date } = coupon;
    //   if (new Date > end_date) throw new ApiError(CONSTANTS_MESSAGES.EXPIRED_COUPON_CODE, StatusCodes.BAD_REQUEST);
    //   if (discount_type === CONSTANTS.COUPON_DISC_TYPE.AMOUNT) {
    //     calculatedDiscount = price - preDiscount - discount;
    //   } else {
    //     calculatedDiscount =((price - preDiscount) * discount) / 100;
    //   }
    // }
     calculatedDiscount = await Utils.VerifyCoupon(coupon_code,userData,(price - preDiscount));
    
  }
   
    let gst = ( (price - calculatedDiscount - preDiscount) * CONSTANTS.PAYMENT.GST) / 100
    if(price - calculatedDiscount <= 0 ){
      gst = 0
      preDiscount = 0
    }
    return { plan_price: price, gst, coupon_discount: calculatedDiscount, pre_discount: preDiscount,
       consumed_days:daysUsed, remaining_days: daysLeft };
  },

  CalculateRenewPlanPrice: async (user_id,data) => {
    const { plan_id, membership_id, coupon_code, order_for } = data;
    let membership_option, plan,  price;
    let calculatedDiscount = 0;

    const userData = await UserAuthDal.GetUser({ _id:user_id },"plan");
    if(!userData) throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND );

    if(dayjs(userData.plan.end_date).isBefore(dayjs())) throw new ApiError(CONSTANTS_MESSAGES.PLAN_EXPIRED_CANNOT_RENEW, StatusCodes.NOT_FOUND);
   
    if (order_for == CONSTANTS.PAYMENT.ORDER_FOR.PLAN_RENEW ) {
      plan = await PlanDal.GetPlan({ _id: plan_id });

      if (!plan) throw new ApiError(CONSTANTS_MESSAGES.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND);
  
      membership_option = plan.membership_options.find((m) => m.membership_id == membership_id);

      if(!membership_option) throw new ApiError(CONSTANTS_MESSAGES.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND);
     
      price = membership_option.charges;
      
    } 
     
    if (coupon_code) {
    //   let coupon = await CouponDal.GetCoupon({coupon_code: coupon_code.toLowerCase()});
    //   if (coupon) {
    //   const { discount_type, discount, end_date } = coupon;
    //   if (dayjs().isAfter(dayjs(end_date))) throw new ApiError(CONSTANTS_MESSAGES.EXPIRED_COUPON_CODE, StatusCodes.BAD_REQUEST);
    //   if (discount_type === CONSTANTS.COUPON_DISC_TYPE.AMOUNT) {
    //     calculatedDiscount = price - discount;
    //   } else {
    //     calculatedDiscount = (price * discount) / 100;
    //   }
    // }
    calculatedDiscount = await Utils.VerifyCoupon(coupon_code,userData,price);
  }
    let gst = ( (price - calculatedDiscount) * CONSTANTS.PAYMENT.GST) / 100

    if(price < 0 ){
      calculatedDiscount = price
      price = 0
      gst = 0
    }
    return { plan_price: price, gst, coupon_discount: calculatedDiscount };
  },
  GetMembershipOption: async (plan_id, membership_id) => {
    let plan = await PlanDal.GetPlan({ _id: plan_id });
    if (!plan) {
      throw new ApiError(CONSTANTS_MESSAGES.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND)
    }
    let membership_option = plan.membership_options.filter((m) => m.membership_id == membership_id);
    return membership_option[0];
  }
};

const UserService = {
  Login: async (data) => {
    const { email, phone, otp } = data;
    let projection = {}
    if(email && phone){
      projection ={ $or: [{email}, {phone}]}
    } else if(email){
      projection = { email }
    } else if(phone){
      projection = { phone }
    }
    const existingUser = await UserAuthDal.GetUser(projection, "_id email phone password token subscriber_type reset_default_password corporate status");

    if (!existingUser) {
      throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
   
    if(!existingUser.status && existingUser.status != undefined &&  existingUser.status != null){
      throw new ApiError(CONSTANTS_MESSAGES.USER_INACTIVE, StatusCodes.UNAUTHORIZED);
    }

    const otpExist = await SigninOtpDal.getRequestForOTP({email:data.email,otp:otp});
   
    if (!otpExist) {
      throw new ApiError(CONSTANTS_MESSAGES.INVALID_OTP, StatusCodes.BAD_REQUEST)
    }
    if(dayjs().diff(otpExist.createdAt,"minutes") > 10){
      throw new ApiError(CONSTANTS_MESSAGES.OTP_EXPIRED, StatusCodes.BAD_REQUEST)
    }

    if(existingUser.phone!=otpExist.phone){
      throw new ApiError(CONSTANTS_MESSAGES.INVALID_OTP, StatusCodes.BAD_REQUEST)
    }
    
    const token = await JwtSign({
      email: existingUser.email,
      _id: existingUser._id,
    },{
      expiresIn:"1d"
    });

    existingUser.token.push(token)
    await UserAuthDal.UpdateUser({ _id: existingUser._id }, existingUser)
   
    return { token: token, 
      user_id: existingUser._id, 
      role: CONSTANTS.USER_ROLES.GENERAL_USER, 
      subscriber_type: existingUser.subscriber_type,
      corporate: existingUser.corporate,
      first_plan_purchase: existingUser.first_plan_purchase
     };
  },

  LoginInOtp : async (data) => {
    if(data.phone == 1234567890){
      await SigninOtpDal.deleteOTP({ phone: data.phone });
      await SigninOtpDal.saveOTP({phone:data.phone,otp:123456});
      console.log("Signin OTP: ",123456);
      return {};
    }
    const OTP = await Utils.generateOTP();
    const existingUser = await UserAuthDal.GetUser({phone:data.phone});
    if (!existingUser) throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    await SigninOtpDal.deleteOTP({ phone: data.phone });
    await SigninOtpDal.saveOTP({phone:data.phone,otp:OTP});
    console.log("Signin OTP: ",OTP);

    if(existingUser?.phone){
      Utils.SendSMS.SignIn({
        name:existingUser?.name, phone:existingUser?.phone, otp: OTP
      });
     }

    if (existingUser?.email) {
      const emailTemplate = await EmailDal.GetOneEmail({});
      Utils.sendBrevoMail.ClaimSubmission({
      template: emailTemplate?.signin,
      subject: `Welcome back to OPDSure! Login OTP Request`,
      user: {name:existingUser?.name, email:existingUser?.email},
      params:{name:existingUser?.name, otp:OTP}
    });
   }
   
    return{};
  },

  SignUpOtp : async (data) => {
    const OTP = await Utils.generateOTP();
    const existingUser = await UserAuthDal.GetUser({phone:data.phone});
    if (existingUser) throw new ApiError(CONSTANTS_MESSAGES.USER_EXISTS, StatusCodes.CONFLICT);
    await SignupOtpDal.deleteOTP({ phone: data.phone });
    await SignupOtpDal.saveOTP({phone:data.phone,otp:OTP});
    console.log("Signup OTP: ",OTP);
      if(OTP && data?.phone){
       Utils.SendSMS.SignUp({
        name:"User", phone:data.phone, otp: OTP
       });
     }
    return{};
  },

  VerifySignUpOtp : async (data) => {
    
    const otpExist = await SignupOtpDal.getRequestForOTP({phone:data.phone,otp:data.otp});
    
    if (!otpExist) {
      throw new ApiError(CONSTANTS_MESSAGES.INVALID_OTP, StatusCodes.BAD_REQUEST)
    }
    if(dayjs().diff(otpExist.createdAt,"minutes") > 10){
      throw new ApiError(CONSTANTS_MESSAGES.OTP_EXPIRED, StatusCodes.BAD_REQUEST)
    }
    if(data.phone!=otpExist.phone){
      throw new ApiError(CONSTANTS_MESSAGES.INVALID_OTP, StatusCodes.BAD_REQUEST)
    }
    
    if(data.phone==otpExist.phone){
      await SignupOtpDal.deleteOTP({phone:data.phone});
      return {verified:true};
    }
    return{verified:false};

  },

  SignUp: async (data) => {
    const {email, phone} = data
    let projection = {}
    if(email && phone){
      projection ={ $or: [{email}, {phone}]}
    } else if(email){
      projection = { email }
    } else if(phone){
      projection = {phone}
    }
    const existingUser = await UserAuthDal.GetUser(projection, "_id token");
    if (existingUser) throw new ApiError(CONSTANTS_MESSAGES.USER_EXISTS, StatusCodes.CONFLICT);
    const userCount = JSON.stringify(100 + await UserAuthDal.GetCount());
    let padded = userCount.padStart(9,"0");
    data.unique_id = `R${padded}`
    const user = await UserAuthDal.CreateUser(data);
   
    const emailTemplate = await EmailDal.GetOneEmail({});
    if(email){
      await Utils.sendMail.SignUp({
        name: "User",
        email: data?.email,
        template: emailTemplate?.registration,
      })
    }
    const token = await JwtSign({ _id: user._id });
    user.token.push(token)
    await UserAuthDal.UpdateUser({ _id: user._id }, user)
    return { token, user_id: user._id, role: CONSTANTS.USER_ROLES.GENERAL_USER,subscriber_type: CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL,
      corporate: null, 
      first_plan_purchase: CONSTANTS.FIRST_PURCHASE.FALSE
     };
  },

  Logout: async (token, _id) => {
    const user = await UserAuthDal.GetUser(_id);
    await UserAuthDal.UpdateUser({_id},  { $pull: { token: token } });
    return {}
  },

  GetProfile: async ( _id) => {
    const user = await UserAuthDal.GetUser(_id, "_id name profile_image dob gender country_code phone address email state city pin_code verified plan country_code wallet_balance first_plan_purchase subscriber_type corporate");
    return user
  },

  ResetPassword: async (_id,password) => {
    const validUser = await UserAuthDal.GetUser({ _id });
    if(validUser == null) throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    const hashedPassword = await Utils.GenerateHashedPassword(password);
    await UserAuthDal.UpdateUser({ _id },{ password:hashedPassword, reset_default_password:1 });
    return {};
  },

  GetSubscribedPlan: async ( plan ) => {
    const {id:plan_id,membership_id} = plan;  
    const planData = await PlanDal.GetPlan({_id:plan_id},"-createdAt -updatedAt -__v");
    const subscribedMembership = planData.membership_options.filter((m)=>m.membership_id === membership_id);
    planData.membership_options = subscribedMembership[0];
    return planData ;
  },

  UpdateProfile: async ( _id, body, token) => {
    const {email, phone} = body
    const user = await UserAuthDal.GetUser(_id, "_id name profile_image dob gender country_code phone address email password");

    
    if(email || phone){
      let projection = {}
      if(email && phone){
        projection ={ $or: [{email}, {phone}]}
      } else if(email){
        projection = { email }
      } else if(phone){
        projection = {phone}
      }
      const existingUser = await UserAuthDal.GetUser(projection);
      if(existingUser){
        throw new ApiError(CONSTANTS_MESSAGES.USER_EXISTS, StatusCodes.CONFLICT);
      }
    }
    var matched
    if (body.password){
      matched = await bcrypt.compare(body.password, user.password);
    }
    if (body.password && !matched){
      throw new ApiError(CONSTANTS_MESSAGES.WRONG_PASSWORD, StatusCodes.UNAUTHORIZED)
    }
    if(body.password){
      body.password = body.newPassword
      body.password = await bcrypt.hash(body.password, 10);
      body.token = [token]
    }
    await UserAuthDal.UpdateUser({_id}, body) 

    
    const existingFamilyMember = await FamilyDAL.GetMember({ user_id: _id, relation: CONSTANTS.FAMILY_RELATION.SELF });
    if (!existingFamilyMember) {
      const userDetails = await UserAuthDal.GetUser(_id, "_id name profile_image dob gender country_code phone address email password");
      await FamilyDAL.AddMember({
        user_id: _id,
        relation: CONSTANTS.FAMILY_RELATION.SELF,
        country_code: userDetails.country_code,
        phone: userDetails.phone,
        name: userDetails.name,
      });
    }
    return {}
  },

  ForgotPassword: async (data) => {
    const {email, phone} = data
    let projection = {}
    if(email && phone){
      projection ={ $or: [{email}, {phone}]}
    } else if(email){
      projection = { email }
    } else if(phone){
      projection = {phone}
    }
    const user = await UserAuthDal.GetUser(projection);
    if (!user){
      throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND)
    }
    const randomToken = await Utils.generateRandomToken();
    const randomOTP = await Utils.generateOTP();
    const forgotPasswordUser = {
      userId: user._id,
      token: randomToken,
      otp: randomOTP
    }
    // await TokenService.SaveToken(forgotPasswordUser);
    await TokenServices.SaveToken(forgotPasswordUser)
    if (randomToken && user && user?.email) {
      const emailTemplate = await EmailDal.GetOneEmail({});
      Utils.sendBrevoMail.ClaimSubmission({
      template: emailTemplate?.forget_password,
      subject: `Password Change Request`,
      user: {name:user?.name, email:user?.email},
      params:{name:user?.name, otp:randomOTP}
    });
   }
  //  if(randomOTP && user?.phone){
  //   Utils.SendSMS.ForgotPassword({
  //     name:user?.name, otp:randomOTP,phone:user.phone
  //   });
  //  }
  // console.log(randomOTP,"randomOTP")
  //   console.log(`${config.WEB_URL}forgotpassword?token=${randomToken}`);
    return {}
  },

  UpdatePassword: async (data) => {
    const { password, otp } = data;
    const otpExist = await TokenServices.GetUserForToken({otp})
    if (!otpExist) {
      console.log("otp dont exists")
      throw new ApiError(CONSTANTS_MESSAGES.INVALID_OTP, StatusCodes.BAD_REQUEST)
    }
    if(dayjs().diff(otpExist.createdAt,"minutes")>10){
      throw new ApiError(CONSTANTS_MESSAGES.OTP_EXPIRED, StatusCodes.BAD_REQUEST)
    }
    const _id = otpExist.userId
    const user = await UserAuthDal.GetUser(_id);
    if(data.email!==user.email){
      console.log("email dont match")
      throw new ApiError(CONSTANTS_MESSAGES.INVALID_OTP, StatusCodes.BAD_REQUEST)
    }
    const matched = await bcrypt.compare(password, user.password);
    if (matched){
      throw new ApiError(CONSTANTS_MESSAGES.OLD_NEW_PASSWORD_ERROR, StatusCodes.CONFLICT)
    }
    data.password = await bcrypt.hash(password, 10);
    await UserAuthDal.UpdateUser({_id}, { password: data.password, token: [] })
    await TokenServices.DeleteByToken({token:otpExist.token});
    if (user && user?.email) {
      const emailTemplate = await EmailDal.GetOneEmail({});
      Utils.sendBrevoMail.AccountRecover({
      template: emailTemplate?.account_recover,
      subject: "Account Recovered Successfully",
      user: {name:user?.name, email:user?.email},
      params:{name:user?.name}
    });
  }
    return {}
  },

  AddMember: async (_id, data) => {
    const userData = await UserAuthDal.GetUser({ _id },"plan name email phone");
    if(!userData) throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.BAD_REQUEST);
    if (data.relation == CONSTANTS.FAMILY_RELATION.SELF) {
      const member = await FamilyDAL.GetMember({ user_id: _id, relation: CONSTANTS.FAMILY_RELATION.SELF });
      if (member) throw new ApiError(CONSTANTS_MESSAGES.CONFLICT_SELF, StatusCodes.CONFLICT);
    }
    const planData = await PlanDal.GetPlan({_id:userData.plan.id},"_id membership_options");
    const subscribedOption = planData.membership_options.find(p=> p.membership_id === userData.plan.membership_id);
    planData.member_count = subscribedOption.member_count;
    const familyList = await FamilyDAL.GetMembers({ user_id: _id });
    const paidMemberCount = familyList.filter(f=>f.relation !== CONSTANTS.FAMILY_RELATION.SELF && f.plan_status === CONSTANTS.PLAN_STATUS.PAID ).length;
    const allowedPaidMember = planData.member_count - 1 - paidMemberCount;
    const count = await FamilyDAL.GetCount({ user_id: _id });
    if(count > 10) throw new ApiError(CONSTANTS_MESSAGES.MEMBER_LIMIT, StatusCodes.BAD_REQUEST);
   
    if(Boolean(allowedPaidMember)){
      await FamilyDAL.AddMember({
        user_id: _id,
        plan_status: CONSTANTS.PLAN_STATUS.PAID,
        ...data
      });
    }else{
      await FamilyDAL.AddMember({
        user_id: _id,
        ...data
      });
    }
    if (userData && userData.email) {
      const emailTemplate = await EmailDal.GetOneEmail({});
      Utils.sendBrevoMail.UserAddMember({
      template: emailTemplate?.user_add_member,
      subject: "New Family Member Added",
      user: {name:userData?.name, email:userData?.email},
      params:{name:userData?.name,member_name:data.name}
    });
  }
  if(userData && userData.phone){
      Utils.SendSMS.UserAddMember({
        name:userData.name,phone:userData.phone
      });
  }
    return {};
  },

  GetMembers: async (_id) => await FamilyDAL.GetMembers({ user_id:_id }),

  UpdateMember: async (user_id,data) => {
    const member = await FamilyDAL.GetMember({ user_id, _id: data.member_id})
    if (!member){
      throw new ApiError (CONSTANTS_MESSAGES.MEMBER_NOT_FOUND, StatusCodes.NOT_FOUND)
    }
    const requested_member = await UpdateMemberDAL.GetMemberRequest({member_id: member._id})
    if(requested_member){
      await UpdateMemberDAL.DeleteMemberRequest({member_id: member._id})
    }
    data.plan_status = member.plan_status
    await UpdateMemberDAL.AddMemberRequest({...data, user_id:user_id});
    UserNotificationsDAL.AddNotification({
      user: user_id, message: NOTIFICATIONS.FAMILY_UPDATE + member.name + "."
    });
    AdminNotificationsDAL.AddNotification({
       message: NOTIFICATIONS.MEMBER_REQUEST_RAISED_ADMIN + member.name + "."
      });
    await FamilyDAL.UpdateMember({_id: member._id}, { review_status: CONSTANTS.REVIEW_STATUS.PENDING })
    const user = await UserAuthDal.GetUser({_id:user_id},"name email phone")
    if (user && user.email) {
      const emailTemplate = await EmailDal.GetOneEmail({});
      await Utils.sendBrevoMail.ProfileUpdateUser({
      template: emailTemplate?.profile_update,
      subject: "Family Member Update Request Raised",
      user: {name:user?.name, email:user?.email},
      params:{name:user?.name,member_name:member.name}
    });    
  }
  if(user && user.phone){
    Utils.SendSMS.MemberUpdateUser({
      name:user.name,phone:user.phone
    });
}
    return {}
  },

  DeleteMember: async (user_id, data) => {
    const member = await FamilyDAL.GetMember({ user_id, _id: data.id})
    if (!member){
      throw new ApiError (CONSTANTS_MESSAGES.MEMBER_NOT_FOUND, StatusCodes.NOT_FOUND)
    }
    if (member.relation == CONSTANTS.FAMILY_RELATION.SELF){
      throw new ApiError (CONSTANTS_MESSAGES.MEMBER_CANNOT_DELETE_ERROR, StatusCodes.BAD_REQUEST)
    }
    if(member.review_status == CONSTANTS.REVIEW_STATUS.PENDING){
      throw new ApiError (CONSTANTS_MESSAGES.MEMBER_DELETE_ERROR, StatusCodes.BAD_REQUEST)
    }
    return await FamilyDAL.DeleteMember({_id: data.id})
  },

  UploadFile: async (_id, files) => {
    const uploadPromises = files.map(async (file) => {
      const token = await Utils.generateRandomToken();
      const fileName = `user/${token}/${file.originalname}`;
      return Utils.UploadFile(file.buffer, fileName, file.mimetype);
    });
    return await Promise.all(uploadPromises);
  },

  AddHealthTest: async (user_id, unique_id, data) => {
    const user = await UserAuthDal.GetUser({ _id: user_id }, "email name plan phone");
    if(dayjs(user?.plan?.end_date).isBefore(dayjs())){
      throw new ApiError(CONSTANTS_MESSAGES.PLAN_EXPIRED_CANNOT_RAISE_CLAIM, StatusCodes.BAD_REQUEST);
    }  
    const member = await FamilyDAL.GetMember({ user_id, _id: data.member_id });
        
    if (!member) {
      throw new ApiError(CONSTANTS_MESSAGES.MEMBER_NOT_FOUND, StatusCodes.NOT_FOUND)
    }
    const alreadyAvailed = await HealthCheckDal.GetCount({member_id:data.member_id, createdAt: {
      $gte: new Date(user.plan.start_date),
      $lte: new Date(user.plan.end_date)
    }});    
    if(alreadyAvailed > 0){
      throw new ApiError(CONSTANTS_MESSAGES.FREE_TEST_ALREADY_AVAILED, StatusCodes.NOT_FOUND)
    }
    let healthCheckupCount = JSON.stringify(1 + (await HealthCheckDal.GetCount({user_id})));
    let padded = healthCheckupCount.padStart(4,"0");
    data.health_checkup_id = `HC${unique_id}-${padded}`;
    return await HealthCheckDal.CreateHealthCheck({ user_id, ...data })
  },

  GetHealthTests: async (user_id, data) => {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = -1,
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    if (search) {
      searchQuery = {
        name: { $regex: search, $options: "i" },
        user_id
      };
    } else {
      searchQuery = {user_id};
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pipeline = [
      { $match: searchQuery },
      { $sort: { ["createdAt"]: -1 } },
      { $skip: offset },
      { $limit: pageSize },
      {
        $lookup: {
          from: 'families',
          localField: 'member_id',
          foreignField: '_id',
          as: 'member_details'
        }
      },
      {
        $lookup: {
          from: 'tests', 
          localField: 'checkup_for',
          foreignField: '_id',
          as: 'checkup_details'
        }
      },
      {
        $addFields: {
          member_details: { $arrayElemAt: ['$member_details', 0] }
        }
      },
     
    ];

    const resp = await HealthCheckDal.aggregate(pipeline);
    const totalCount = await HealthCheckDal.GetCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      records: resp,
      pagination: {
        totalRecords: totalCount,
        pageSize: Number(pageSize),
        totalPages,
        currentPage: Number(page),
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      },
    };
  },

  AddClaim: async (_id, unique_id, data) => {
      const user = await UserAuthDal.GetUser({ _id }, "email name plan phone");
      if(dayjs(user?.plan?.end_date).isBefore(dayjs())){
        throw new ApiError(CONSTANTS_MESSAGES.PLAN_EXPIRED_CANNOT_RAISE_CLAIM, StatusCodes.BAD_REQUEST);
      }  
      const member = await FamilyDAL.GetMember({ _id: data.member_id, user_id: _id });
      if (!member) {
        throw new ApiError(CONSTANTS_MESSAGES.MEMBER_NOT_FOUND, StatusCodes.NOT_FOUND);
      }
      data.user_id = _id;
      const assignedToManagementUser  = await Utils.AssignClaim({ internal_id: CONSTANTS.DESIGNATIONS[3].internal_id });
      data.assigned_to_verifier = assignedToManagementUser; 
      let mangname = assignedToManagementUser.name;
      let mangemail = assignedToManagementUser.email;
      let claimCount = JSON.stringify(1 + (await ClaimDAL.GetClaimCount({user_id: _id})));
      let padded = claimCount.padStart(4,"0");
      data.claim_id = `OPD${unique_id}-${padded}`;
      const subscriberRemark = {
        designation: null,
        approver_id: null,
        message: data.user_remark,
        message_claim_internal_status: null
      };
      const finalData = {
          ...(data.user_remark && { remark:subscriberRemark }),
          ...(data.user_remark && { subscriber_remark:subscriberRemark }),
          claim_type: CONSTANTS.CLAIM.TYPE.OPD,
          ...data      
      }
      
    const doctorData = {
      name: data.doc_name,
      reg_no: data.doc_registration,
      specialization: data.specialization,
      hospital: data.hospital,
      address: data.doc_address,
      mobile: data.doc_phone,
      email: data.doc_email,
      country_code: data.doc_country_code,
      city: data.city,
      pincode : data.pincode
  };

  const existingDoctor = await DoctorsFromClaims.findOne({ reg_no: doctorData.reg_no });

  if (!existingDoctor) {
      await DoctorsFromClaims.create(doctorData);
      console.log("Doctor record added:", doctorData);
  } else {
      console.log("Doctor already exists:", existingDoctor);
  }


    const addedClaim = await ClaimDAL.AddClaim(finalData);
    
    UserNotificationsDAL.AddNotification({user: _id, message: NOTIFICATIONS.CLAIM_RAISED + " Claim ID: " + addedClaim.claim_id + "." })
    ManagementNotificationsDAL.AddNotification({user: assignedToManagementUser, message: " Claim ID: " + addedClaim.claim_id + NOTIFICATIONS.CLAIM_RAISED_MANAGEMENT})
   
    if (addedClaim && user && user?.email) {
        const emailTemplate = await EmailDal.GetOneEmail({});
        Utils.sendBrevoMail.ClaimSubmission({
        template: emailTemplate?.claim_submission_mail,
        subject: `Claim Submission Successful - Claim (ID: ${addedClaim?.claim_id})`,
        user: {name:user?.name, email:user?.email},
        params:{name:user?.name,claim_id:addedClaim?.claim_id}
      });
    }
    if (addedClaim && user && user?.phone) {        
        Utils.SendSMS.ClaimSubmission({
        name:user?.name, claim_id:addedClaim?.claim_id,phone:user.phone
      });
    }
    if (addedClaim && user) {
      const emailTemplate = await EmailDal.GetOneEmail({});
      Utils.sendBrevoMail.ClaimSubmission({
      template: emailTemplate?.claim_submission_mail,
      subject: `Claim Submission Successful - Claim (ID: ${addedClaim?.claim_id})`,
      user: {name:mangname, email: mangemail},
      params:{name:mangname,claim_id:addedClaim?.claim_id}
    });
  }
    return addedClaim;
  
  },

  EditClaim: async ( _id, data ) => {
    console.log(_id)
    const isValidClaim = await ClaimDAL.GetClaim({_id});
    console.log(isValidClaim)
    if(isValidClaim==="null") throw new ApiError((CONSTANTS_MESSAGES.CLAIM_NOT_FOUND, StatusCodes.NOT_FOUND));
        
    if(isValidClaim.subscriber_reaction) {
      throw new ApiError(CONSTANTS_MESSAGES.ACTION_ALREADY_TAKEN, StatusCodes.BAD_REQUEST);
    }
    const { user_remark,fee_receipt,prescription,pharmacy_receipt,test_receipt,...filteredData } = data;
    // const assignedToManagementUser  = await Utils.AssignClaim({ internal_id: CONSTANTS.DESIGNATIONS[3].internal_id });
    filteredData.assigned_to_manager = null;
    filteredData.assigned_to_financer = null;
    filteredData.internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION;
    filteredData.resubmission = true;
    const newSubscriberRemark = {
      designation: null,
      approver_id: null,
      message: data.user_remark,
      message_claim_internal_status: null
    };
    const finalData = {
      $push : { 
          ...(user_remark && { remark: newSubscriberRemark }),
          ...(user_remark && { subscriber_remark: newSubscriberRemark }),
          ...(fee_receipt && { fee_receipt: { $each: fee_receipt } }),
          ...(prescription && { prescription: { $each: prescription } }),
          ...(pharmacy_receipt && { pharmacy_receipt: { $each: pharmacy_receipt } }),
          ...(test_receipt && { test_receipt: { $each: test_receipt } })
          },
      $set : { ...filteredData, subscriber_reaction: true }
    }
    const updatedClaim = await ClaimDAL.EditClaimStatus( { _id }, finalData );

    UserNotificationsDAL.AddNotification({user: isValidClaim.user_id, message: NOTIFICATIONS.CLAIM_CLARIFICATION_SUBMITTED + isValidClaim.claim_id + "." })
    ManagementNotificationsDAL.AddNotification({user: isValidClaim.verifier, message: NOTIFICATIONS.CLAIM_CLARIFICATION_SUBMITTED_MANAGEMENT + " Claim ID: " + isValidClaim.claim_id + "." })
    
    
        const emailTemplate = await EmailDal.GetOneEmail({});
        // await Utils.sendMail.ClaimUpdation({
        //     name: isValidClaim?.user_id?.name, 
        //     email: isValidClaim?.user_id?.email,
        //     template: emailTemplate?.claim_updation_mail,
        //     claim_id: isValidClaim?.claim_id
        // });
    

    return updatedClaim;
  },

  RaiseClaimDispute: async ( _id, data ) => {
    const isValidClaim = await ClaimDAL.GetClaim({_id});
    if(isValidClaim==="null") throw new ApiError((CONSTANTS_MESSAGES.CLAIM_NOT_FOUND, StatusCodes.NOT_FOUND));
    if(isValidClaim.dispute) {
      throw new ApiError(CONSTANTS_MESSAGES.DISPUTE_ALREADY_RAISED, StatusCodes.BAD_REQUEST);
    }
    const user = await UserAuthDal.GetUser({ _id:isValidClaim.user_id }, "email name plan phone");
    const claimStatus = isValidClaim.status;
    if(claimStatus === CONSTANTS.CLAIM.STATUS.CLARIFICATION || claimStatus === CONSTANTS.CLAIM.STATUS.IN_PROCESS || claimStatus === CONSTANTS.CLAIM.STATUS.PENDING){
      throw new ApiError(CONSTANTS_MESSAGES.DISPUTE_CANNOT_BE_RAISED, StatusCodes.BAD_REQUEST);
    }
    await ClaimDAL.EditClaimStatus( { _id }, { dispute: true } );
    const assignedToManagementUser  = await Utils.AssignClaim({ internal_id: CONSTANTS.DESIGNATIONS[3].internal_id });
    data.assigned_to_verifier = assignedToManagementUser; 
    const { user_remark, ...restData } = data;  
    restData.internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION;
    restData.dispute_status = CONSTANTS.CLAIM.DISPUTE_STATUS.RAISED;
    restData.status = CONSTANTS.CLAIM.STATUS.DISPUTE;
    restData.dispute = true;
    restData.original_claim_id = isValidClaim._id;
    const newSubscriberRemark = {
      designation: null,
      approver_id: null,
      message: user_remark,
      message_claim_internal_status: null
    };
    const finalData = {
          ...(user_remark && { remark: newSubscriberRemark }),
          ...(user_remark && { subscriber_remark: newSubscriberRemark }),
          dispute: true, 
          claim_id: isValidClaim.claim_id,
          ...restData, 
        }    
    UserNotificationsDAL.AddNotification({user: isValidClaim.user_id, message: NOTIFICATIONS.DISPUTE_RAISED + " Claim ID: " + isValidClaim.claim_id + "." })
    ManagementNotificationsDAL.AddNotification({user: assignedToManagementUser, message: NOTIFICATIONS.DISPUTE_RAISED + " Claim ID: " + isValidClaim.claim_id + "." })
   
    if (user && user?.email) {
        const emailTemplate = await EmailDal.GetOneEmail({});
        await Utils.sendBrevoMail.RaiseDispute({
        template: emailTemplate?.dispute_submission_mail,
        subject: `Dispute Submission Successful Dispute (ID: ${isValidClaim?.claim_id})`,
        user: {name:user.name, email:user.email},
        params:{name:user.name,claim_id:isValidClaim.claim_id}
      });
    }   
    if (user && user?.phone) {
        await Utils.SendSMS.RaiseDispute({
        name:user.name, claim_id:isValidClaim.claim_id,phone:user.phone
      });
    }   
    return await DisputedClaimsDAL.RaiseClaimDispute( finalData );
  },

  GetDisputedClaims: async (user_id, data) => {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = -1,
    } = data;
  
    // Validate inputs
    const validSortOrder = sortOrder === 1 || sortOrder === -1 ? sortOrder : -1;
    const offset = (page - 1) * pageSize;
  
    // Create sorting object
    const sortObject = { [sortBy]: validSortOrder };
  
    // Create search query based on provided search term
    const searchQuery = search
      ? { name: { $regex: search, $options: "i" }, user_id }
      : { user_id };
  
    // Pagination and sorting configuration
    const pagination = {
      offset,
      sortObject,
      pageSize,
      searchQuery
    };
  
    try {
      // Fetch claims with specified filters, projection, and pagination
      const resp = await ClaimDAL.GetClaims(
        searchQuery,
        "-internal_status -assigned_to_verifier -assigned_to_manager -assigned_to_financer -assigned_to_approver -approver -financer -verifier -remark -manager",
        pagination
      );
  
      // Fetch the total count of claims for pagination
      const totalCount = await ClaimDAL.GetClaimCount(searchQuery);
      const totalPages = Math.ceil(totalCount / pageSize);
  
      return {
        records: resp,
        pagination: {
          totalRecords: totalCount,
          pageSize: Number(pageSize),
          totalPages,
          currentPage: Number(page),
          nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
          prevPage: Number(page) > 1 ? Number(page) - 1 : null,
        },
      };
    } catch (error) {
      console.error("Error in GetDisputedClaims:", error);
      throw new ApiError("Failed to fetch disputed claims", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },  
  
  GetClaims: async (user_id, data) => {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = -1,
      statusFilter = "ALL",
      startDate = dayjs().subtract(1730, "day").startOf("day").toISOString(),
      endDate = dayjs().endOf("day").toISOString(),
      claimStatus = "ALL",
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
   
    if (search) {
    searchQuery = {
     $and: [
      { user_id },
         {
        $or: [   
          { claim_id: { $regex: search, $options: "i" } },
          { hospital: { $regex: search, $options: "i" } },        
          ]
       }
      ]
      };
      } else {
     searchQuery = { user_id }; 
    }

    if (startDate && endDate) {
      searchQuery.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    if (claimStatus && claimStatus !== "ALL") {
      searchQuery.status = Number(claimStatus);
    }

    sortObject[sortBy] = parseInt(sortOrder);
    if(statusFilter &&  statusFilter!=="ALL"){
      const statusArray = statusFilter.split(",").map(Number)
      searchQuery.status = { $in : statusArray }
    }
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await ClaimDAL.GetClaims(searchQuery, 
      "-internal_status -assigned_to_verifier -assigned_to_manager -assigned_to_financer -assigned_to_approver -approver -financer -verifier -remark -manager",
       pagination);
    const updatedClaims = await Promise.all(resp.map(async (claim) => {
        if (claim.dispute) {
          const disputed_claim_details = await DisputedClaimsDAL.GetDisputeClaim(
            { original_claim_id: claim._id },
            "dispute_status"
          );
          claim.dispute_details = disputed_claim_details?.dispute_status;          
        } else {
          claim.dispute_details = null;
        }
        return claim;
    }));
    const totalCount = await ClaimDAL.GetClaimCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      records: updatedClaims,
      pagination: {
        totalRecords: totalCount,
        pageSize: Number(pageSize),
        totalPages,
        currentPage: Number(page),
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      },
    };
  },

  GetClaim: async (user_id, _id) => {
    let data = await ClaimDAL.GetClaim({ user_id, _id },"-internal_status -assigned_to -approver -financer -verifier -assigned_to_manager -assigned_to_verifier -assigned_to_financer ");
    const familyDetails = await FamilyDAL.GetMember({ _id: data.member_id });
    
    if (!data) return null;

    const { name, _id : member_id, phone } = familyDetails;
    const tempData = {...data};
    tempData.member_details = { name, member_id, phone };

    const receiptTypes = ['fee_receipt', 'prescription', 'pharmacy_receipt', 'test_receipt','test_reports'];
    
    await Promise.all(receiptTypes.map(async (type) => {
      if (Array.isArray(tempData[type])) {
        tempData[type] = await Promise.all(tempData[type].map(async (receipt) => {
          return await Utils.getFileURL(receipt);
        }));
      }
    }));

    return tempData;
  },

  GetDisputedClaims: async (user_id, data) => {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = -1,
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    if (search) {
      searchQuery = {
        name: { $regex: search, $options: "i" },
        user_id
      };
    } else {
      searchQuery = {user_id};
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await DisputedClaimsDAL.GetDisputeClaims(searchQuery, 
      "-internal_status -assigned_to_verifier -assigned_to_manager -assigned_to_financer -assigned_to_approver -approver -financer -verifier -remark -manager",
       pagination);
    const totalCount = await DisputedClaimsDAL.GetClaimCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      records: resp,
      pagination: {
        totalRecords: totalCount,
        pageSize: Number(pageSize),
        totalPages,
        currentPage: Number(page),
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      },
    };
  },

  GetDisputedClaim: async (user_id, _id) => {
    let data =  await DisputedClaimsDAL.GetDisputeClaim({ original_claim_id:_id },"-internal_status -assigned_to -approver -financer -manager -verifier -assigned_to_manager -assigned_to_verifier -assigned_to_financer -remark -__v -createdAt -updatedAt");
    if (!data) return null;
    data.files = await Promise.all(data.files.map(async (file) => await Utils.getFileURL(file)))
    return data;
  },

  GetCouponDiscount: async (user_id,data) => await UserSideService.CalculatePlanPrice(user_id,data),

  GetCouponDiscountPlanUpgrade: async (user_id,data) => await UserSideService.CalculateUpgradePlanPrice(user_id,data),

  GetCouponDiscountPlanRenew: async (user_id,data) => await UserSideService.CalculateRenewPlanPrice(user_id,data),

  GetClaimCalculation: async ( amount, claimType, user ) => {

    if(Number(amount) < 0 ) throw new ApiError (CONSTANTS_MESSAGES.NEGATIVE_AMOUNT, StatusCodes.BAD_REQUEST);
    
    if(Number(amount) === 0) return { finalPrice:0 };

    const { id:planId } = user.plan;
   
    const planDetails = await PlanDal.GetPlan({_id:planId},"-plan_benefits -files -__v");

    const finalPrice = await Utils.CalculateClaimableAmount( Number(amount), Number(claimType), planDetails );
 
    return { finalPrice };
  },

   CreateOrder: async ( data, user_id ) => {
   
    const { plan_price: price, gst, coupon_discount } = await UserSideService.CalculatePlanPrice(user_id,data)
    const coupon_details = await CouponDal.GetCoupon({ coupon_code: data.coupon_code.toLowerCase() },"_id");
    if (( price + gst - coupon_discount ) * 100 <= 0 ){
      const user = await UserAuthDal.GetUser({_id: user_id}, "wallet_balance email phone")
      let walletBalance = user.wallet_balance
      let membershipOption, paidPrice = 0
      const selectedPlan = await PlanDal.GetPlan({_id:data.plan_id},"frequency name");
      const extendedValidDays = GetExtendedDays(selectedPlan.frequency);
  
      if (data.plan_id){
        membershipOption = await UserSideService.GetMembershipOption(data.plan_id, data.membership_id)
        walletBalance = walletBalance + membershipOption.wallet_balance
        await WalletTransactionDal.AddWalletTransaction({
          user_id,
          amount: walletBalance,
          type: CONSTANTS.TRANSACTION.TYPE.CREDIT,
          plan_id: data.plan_id
        })
        await FamilyDAL.UpdateMember(
          { user_id, relation: CONSTANTS.FAMILY_RELATION.SELF },
          { plan_status: CONSTANTS.PLAN_STATUS.PAID }
        );
        UserNotificationsDAL.AddNotification({user: user_id, message: `Plan ${selectedPlan?.name} purchased successfully.` })
        paidPrice = (membershipOption.charges) * ((CONSTANTS.PAYMENT.GST + 100)/100);
        if(user.email){
          emailTemplate = await EmailDal.GetOneEmail({});
          templateData = {
            name: user.name,
            email: user.email,
            template: emailTemplate?.plan_purchase_mail,
            plan_name: selectedPlan.name
          };
          Utils.sendBrevoMail.PlanPurchase({
            template:templateData.template,
            subject:`Plan Purchase Successful`,
            user:{name:templateData.name,email:templateData.email},
            params:{name:templateData.name,plan_name:templateData.plan_name}
          });
        }
        if(user.phone){
          Utils.SendSMS.PlanPurchase({
            name:user.name,phone:user.phone,plan_name:selectedPlan.name
          });
        }
      }
      if(data.health_plan_id){
        await PurchasedHealthCheckupDal.CreatePurchasedHealthCheck({
          health_plan: data.health_plan_id,
          user: user_id,
          paid_price: 0,
        });
      }
      await UserAuthDal.UpdateUser({_id: user_id}, {
        plan: {
          purchased: true,
          id: data.plan_id,
          membership_id: data.membership_id,
          health_plan_id: data.health_plan_id,
          start_date: dayjs().toISOString(),
          end_date: dayjs().add(extendedValidDays, 'day').toISOString(),
          paid_price: paidPrice,
        },
        first_plan_purchase: CONSTANTS.FIRST_PURCHASE.TRUE,
        wallet_balance: walletBalance
      })

      if(coupon_details){
        if(data.plan_id){
          await Utils.CreateCouponConsumption( coupon_details._id, user_id, data.plan_id, null, 0, coupon_discount);
        }else{
          await Utils.CreateCouponConsumption( coupon_details._id, user_id, null, data.health_plan_id, 0, coupon_discount);
        }
      }  

      return {}
    }
    const instance = new Razorpay({
			key_id: config.RAZORPAY_KEY_ID,
			key_secret: config.RAZORPAY_KEY_SECRET,
		});
    console.log(Number(Math.round( price + gst - coupon_discount ).toFixed(2)) * 100);
		const options = {
			amount: Number(Math.round( price + gst - coupon_discount ).toFixed(2)) * 100,
			currency: "INR",
			receipt: await Utils.generateRandomToken(),
      notes: {
        plan_id: data.plan_id,
        coupon_discount: coupon_discount,
        membership_id: data.membership_id,
        health_plan_id: data.health_plan_id,
        coupon_id:coupon_details?._id ?? null,
        user_id
      }
		};
    return await instance.orders.create(options)
  },


  CreateUpgradePlanOrder: async ( data, user_id ) => {
    
    const { plan_price: price, gst, coupon_discount,pre_discount } = await UserSideService.CalculateUpgradePlanPrice(user_id,data)
    const coupon_details = await CouponDal.GetCoupon({ coupon_code: data.coupon_code.toLowerCase() },"_id");
    if (( price + gst - pre_discount - coupon_discount ) * 100 <= 0 ){
      const selectedPlan = await PlanDal.GetPlan({_id:data.plan_id},"frequency name");
      const extendedValidDays = GetExtendedDays(selectedPlan.frequency);
      const userDetails = await UserAuthDal.GetUser({_id:user_id});
      const oldPlan = await PlanDal.GetPlan({_id:userDetails.plan.id},"name");
      let finalExpiry = await Utils.CalculateExpiryDate(userDetails,extendedValidDays)
      let walletBalance = 0
      let allowedPaidMembers = 0;
      if (data.plan_id){
        membershipOption = await UserSideService.GetMembershipOption(data.plan_id, data.membership_id)
        walletBalance = walletBalance + membershipOption.wallet_balance
        allowedPaidMembers = membershipOption.member_count-1;
      }
      await UserAuthDal.UpdateUser({_id: user_id}, {
        plan: {
          purchased: true,
          id: data.plan_id,
          membership_id: data.membership_id,
          health_plan_id: data.health_plan_id,
          start_date: dayjs().toISOString(),
          end_date: finalExpiry,
          paid_price: (membershipOption.charges) * ((CONSTANTS.PAYMENT.GST + 100)/100)
        },
        wallet_balance: walletBalance
      })
      await WalletTransactionDal.AddWalletTransaction({
        user_id,
        amount: walletBalance,
        type: CONSTANTS.TRANSACTION.TYPE.CREDIT,
        plan_id: data.plan_id,
        amount:(membershipOption.charges) * ((CONSTANTS.PAYMENT.GST + 100)/100),
        discount:(membershipOption.charges) * ((CONSTANTS.PAYMENT.GST + 100)/100)
      })

      let familyList = await FamilyDAL.GetMembers({user_id,relation:{$ne:CONSTANTS.FAMILY_RELATION.SELF}});      
      let updatePromises = [];
      for (const f of familyList) {
        if (allowedPaidMembers === 0) break; 
        if (f.plan_status === CONSTANTS.PLAN_STATUS.UNPAID) {
          updatePromises.push(FamilyDAL.UpdateMember(
            { _id: f._id }, 
            { plan_status: CONSTANTS.PLAN_STATUS.PAID }
          ));
          allowedPaidMembers--;
         }
      }
      await Promise.all(updatePromises);

      if(coupon_details){
        await Utils.CreateCouponConsumption( coupon_details._id, user_id, data.plan_id, null, 0, coupon_discount);
      }    
      UserNotificationsDAL.AddNotification({user: user_id, message: `Your plan has been upgraded to ${selectedPlan.name} successfully.` });
      if(userDetails.email){
        emailTemplate = await EmailDal.GetOneEmail({});
        templateData = {
          name: userDetails.name,
          email: userDetails.email,
          template: emailTemplate?.plan_upgrade_mail,
          plan_name: selectedPlan.name,
          old_plan: oldPlan.name,
        };
        Utils.sendBrevoMail.PlanPurchase({
          template:templateData.template,
          subject:`Your OPDSure Plan Has Been Upgraded!`,
          user:{name:templateData.name,email:templateData.email},
          params:{name:templateData.name,plan_name:templateData.plan_name,old_plan:templateData.old_plan}
        });
      }
      if(userDetails.phone){
        Utils.SendSMS.PlanUpgrade({
          name:userDetails.name,phone:userDetails.phone,plan_name:selectedPlan.plan_name,old_plan:oldPlan.name
        });
      }
      return {}
    }
    const instance = new Razorpay({
			key_id: config.RAZORPAY_KEY_ID,
			key_secret: config.RAZORPAY_KEY_SECRET,
		});
		const finalAmount = Number(Math.round( price - pre_discount + gst - coupon_discount )  * 100).toFixed(0);
    
    const options = {
			amount: finalAmount,
			currency: "INR",
			receipt: await Utils.generateRandomToken(),
      notes: {
        plan_id: data.plan_id,
        coupon_discount: coupon_discount,
        pre_discount: data.pre_discount,
        membership_id: data.membership_id,
        coupon_id:coupon_details?._id ?? null,
        user_id
      }
		};
    return await instance.orders.create(options)
  },

  CreateRenewPlanOrder: async ( data, user_id ) => {
    const { plan_price: price, gst, coupon_discount } = await UserSideService.CalculateRenewPlanPrice(user_id,data)
    const coupon_details = await CouponDal.GetCoupon({ coupon_code: data.coupon_code.toLowerCase() },"_id");
    const selectedPlan = await PlanDal.GetPlan({_id:data.plan_id},"name");
    const user = await UserAuthDal.GetUser({_id:user_id},"name email phone")
    if (( price + gst - coupon_discount ) * 100 <= 0 ){
      membershipOption = await UserSideService.GetMembershipOption(data.plan_id, data.membership_id)
     
      await PlanRenewDal.Create({
        plan_id: data.plan_id,
        membership_id: data.membership_id,
        user_id: user_id,
        activated: false,
        paid_price: (membershipOption.charges) * ((CONSTANTS.PAYMENT.GST + 100)/100)
      })
      if(coupon_details){
        await Utils.CreateCouponConsumption( coupon_details._id, user_id, data.plan_id, null, 0, coupon_discount);
      }
      UserNotificationsDAL.AddNotification({user: user_id, message: `The Advance plan ${selectedPlan.name} has been purchased successfully.` })   
      if(user.email){
        emailTemplate = await EmailDal.GetOneEmail({});
        templateData = {
          name: user.name,
          email: user.email,
          template: emailTemplate?.plan_purchase_mail,
          plan_name: selectedPlan.name
        };
        Utils.sendBrevoMail.PlanPurchase({
          template:templateData.template,
          subject:`Advance Plan Purchase Successful`,
          user:{name:templateData.name,email:templateData.email},
          params:{name:templateData.name,plan_name:templateData.plan_name}
        });
      }
      if(user.phone){
        Utils.SendSMS.PlanPurchase({
          name:user.name,phone:user.phone,plan_name:selectedPlan.name
        });
      }
      return {}
    }
    const instance = new Razorpay({
			key_id: config.RAZORPAY_KEY_ID,
			key_secret: config.RAZORPAY_KEY_SECRET,
		});
		const finalAmount = Number(Math.round( price + gst - coupon_discount ).toFixed(2)) * 100
    const options = {
			amount: finalAmount,
			currency: "INR",
			receipt: await Utils.generateRandomToken(),
      notes: {
        plan_id: data.plan_id,
        coupon_discount: coupon_discount,
        membership_id: data.membership_id,
        coupon_id:coupon_details?._id ?? null,
        user_id
      }
		};
    return await instance.orders.create(options)
  },

  VerifyPayment: async (data, _id) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');
  
    if (razorpay_signature !== expectedSign) {
      throw new ApiError(CONSTANTS_MESSAGES.INTERNAL_SERVER_ERROR, StatusCodes.BAD_REQUEST);
    }
  
    const instance = new Razorpay({
      key_id: config.RAZORPAY_KEY_ID,
      key_secret: config.RAZORPAY_KEY_SECRET,
    });
  
    const payment = await instance.payments.fetch(razorpay_payment_id);
    const { coupon_id,coupon_discount, membership_id, plan_id, health_plan_id } = payment.notes;
  
    const [user, plan, healtchekup] = await Promise.all([
      UserAuthDal.GetUser({ _id }, 'wallet_balance'),
      plan_id ? PlanDal.GetPlan({ _id: plan_id }, 'frequency membership_options name') : null,
      health_plan_id ? HealthCheckupPlanDal.GetHealthCheckupPlan({ _id: health_plan_id }, 'discounted_price base_price name') : null
    ]);
  
    let planValidity = 0;
  
    if (plan) {
      planValidity = GetExtendedDays(plan.frequency);
    }
  
    let walletBalance = user.wallet_balance;
  
    if (plan_id) {
      const membershipOption = await UserSideService.GetMembershipOption(plan_id, membership_id);
      walletBalance += membershipOption.wallet_balance;
    }
    let price = 0
    if (healtchekup) {
      price = Math.ceil(healtchekup.discounted_price + 18 * healtchekup.discounted_price/ 100)
      walletBalance -= price;
    }
  
    await PaymentDal.Create({
      user_id: _id,
      payment,
    });
  
    if (!health_plan_id) {
      await UserAuthDal.UpdateUser({ _id }, {
        plan: {
          purchased: true,
          id: plan_id,
          membership_id,
          health_plan_id,
          start_date: dayjs().toISOString(),
          end_date: dayjs().add(planValidity, 'day').toISOString(),
          paid_price: payment.amount / 100,
        },
        wallet_balance: walletBalance,
        first_plan_purchase: CONSTANTS.FIRST_PURCHASE.TRUE
      });

      await WalletTransactionDal.AddWalletTransaction({
        user_id: _id,
        amount: walletBalance,
        type: CONSTANTS.TRANSACTION.TYPE.CREDIT,
        plan_id
      })
  
      await FamilyDAL.UpdateMember(
        { user_id: _id, relation: CONSTANTS.FAMILY_RELATION.SELF },
        { plan_status: CONSTANTS.PLAN_STATUS.PAID }
      );
      UserNotificationsDAL.AddNotification({user: _id, message: `Plan ${plan.name} purchased successfully.` })

    }
    if(payment.notes.coupon_id){
      await Utils.CreateCouponConsumption( coupon_id, _id, plan_id, health_plan_id,(payment.amount / 100).toFixed(2),coupon_discount);
    }
    if(payment.notes.health_plan_id){
      await PurchasedHealthCheckupDal.CreatePurchasedHealthCheck({
        health_plan: payment.notes.health_plan_id,
        user: _id,
        paid_price: payment.amount / 100,
      });

      await UserAuthDal.UpdateUser({ _id }, {
        wallet_balance: walletBalance,
      });

      await WalletTransactionDal.AddWalletTransaction({
        user_id: _id,
        amount: price,
        type: CONSTANTS.TRANSACTION.TYPE.DEBIT,
      })
    }
    if(user.email){
      emailTemplate = await EmailDal.GetOneEmail({});
      templateData = {
        name: user.name,
        email: user.email,
        template: emailTemplate?.plan_purchase_mail,
        plan_name: plan.name
      };
      Utils.sendBrevoMail.PlanPurchase({
        template:templateData.template,
        subject:`Plan Purchase Successful`,
        user:{name:templateData.name,email:templateData.email},
        params:{name:templateData.name,plan_name:templateData.plan_name}
      });
    }
    if(user.phone){
      Utils.SendSMS.PlanUpgrade({
        name:user.name,phone:user.phone,plan_name:plan.name
      });
    }
    
    return {};
  },

  VerifyPlanUpgradePayment: async (data, _id) => {
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      var instance = new Razorpay({ key_id: config.RAZORPAY_KEY_ID, key_secret: config.RAZORPAY_KEY_SECRET })
      const payment = await instance.payments.fetch(razorpay_payment_id);
      const selectedPlan = await PlanDal.GetPlan({_id:payment.notes.plan_id},"frequency membership_options name");
      const subscribedOption = selectedPlan.membership_options.find(p=> p.membership_id === payment.notes.membership_id);
      let allowedPaidMembers = subscribedOption.member_count-1;
      let familyList = await FamilyDAL.GetMembers({user_id:_id,relation:{$ne:CONSTANTS.FAMILY_RELATION.SELF}});      
      let updatePromises = [];
      for (const f of familyList) {
        if (allowedPaidMembers === 0) break; 
        if (f.plan_status === CONSTANTS.PLAN_STATUS.UNPAID) {
          updatePromises.push(FamilyDAL.UpdateMember(
            { _id: f._id }, 
            { plan_status: CONSTANTS.PLAN_STATUS.PAID }
          ));
          allowedPaidMembers--;
         }
      }
      await Promise.all(updatePromises);      
      
      const extendedValidDays = GetExtendedDays(selectedPlan.frequency);     
      const userDetails = await UserAuthDal.GetUser({_id},"plan name email phone");
      const oldPlan = await PlanDal.GetPlan({_id:userDetails.plan.id},"name")
      if(userDetails){
        oldStartDate = dayjs(userDetails.plan.start_date);
        oldExpDate = dayjs(userDetails.plan.end_date);
        previousPricePaid = userDetails.plan.paid_price;
      }
     
      let finalExpDate = await Utils.CalculateExpiryDate(userDetails,extendedValidDays)
      if(previousPricePaid<0)previousPricePaid=0;
      let walletBalance = 0
      if (payment.notes.plan_id){
        let membershipOption = await UserSideService.GetMembershipOption(payment.notes.plan_id, payment.notes.membership_id)
        walletBalance = walletBalance + membershipOption.wallet_balance
      }
     
      await UserAuthDal.UpdateUser(
        { _id: _id },
        {
          $set: {
            'plan.purchased': true,
            'plan.id': payment.notes.plan_id,
            'plan.membership_id': payment.notes.membership_id,
            'plan.health_plan_id': data.health_plan_id,
            'plan.start_date': dayjs().toISOString(),
            'plan.end_date': finalExpDate,
            'wallet_balance': walletBalance
          },
          $inc: {
            'plan.paid_price': (payment.amount / 100).toFixed(2)
          }
        }
      );

      await WalletTransactionDal.AddWalletTransaction({
        user_id: _id,
        amount: walletBalance,
        type: CONSTANTS.TRANSACTION.TYPE.CREDIT,
        plan_id: payment.notes.plan_id
      })

      await FamilyDAL.UpdateMember({user_id:_id,relation:CONSTANTS.FAMILY_RELATION.SELF},
        {plan_status:CONSTANTS.PLAN_STATUS.PAID});

      if(payment.notes.coupon_id){
        await Utils.CreateCouponConsumption( payment.notes.coupon_id, _id, payment.notes.plan_id, null,(payment.amount / 100).toFixed(2),payment.notes.coupon_discount);
      }     

      await PaymentDal.Create({
        user_id: _id,
        payment
      })
      UserNotificationsDAL.AddNotification({user: _id, message: `Your plan has been upgraded to ${selectedPlan.name} successfully.` })
      
      if(userDetails.email){emailTemplate = await EmailDal.GetOneEmail({});
      templateData = {
        name: userDetails.name,
        email: userDetails.email,
        template: emailTemplate?.plan_upgrade_mail,
        plan_name: selectedPlan.name,
        old_plan: oldPlan.name
      };
      Utils.sendBrevoMail.PlanUpgrade({
        template:templateData.template,
        subject:`Your OPDSure Plan Has Been Upgraded!`,
        user:{name:templateData.name,email:templateData.email},
        params:{name:templateData.name,old_plan: templateData.old_plan, plan_name:templateData.plan_name}
      })}
      if(userDetails.phone){
        Utils.SendSMS.PlanUpgrade({
          name:userDetails.name,phone:userDetails.phone,plan_name:selectedPlan.name,old_plan:oldPlan.name
        });
      }
      
      return {}
    } else {
      if(user.email){
        emailTemplate = await EmailDal.GetOneEmail({});
        templateData = {
          name: userDetails.name,
          email: userDetails.email,
          template: emailTemplate?.plan_purchase_failure,
          plan_name: selectedPlan.name
        };
        Utils.sendBrevoMail.PlanPurchaseFail({
          template:templateData.template,
          subject:`Plan Purchase Failed`,
          user:{name:templateData.name,email:templateData.email},
          params:{name:templateData.name,plan_name:templateData.plan_name}
        });
      }
      if(user.phone){
        Utils.SendSMS.PlanPurchaseFail({
          name:userDetails.name,phone:userDetails.phone,plan_name:selectedPlan.name
        });
      }
      
      throw new ApiError(CONSTANTS_MESSAGES.INTERNAL_SERVER_ERROR, StatusCodes.BAD_REQUEST)
    }
  },

  VerifyPlanRenewPayment: async (data, _id) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      var instance = new Razorpay({ key_id: config.RAZORPAY_KEY_ID, key_secret: config.RAZORPAY_KEY_SECRET })
      const payment = await instance.payments.fetch(razorpay_payment_id);
      const selectedPlan = await PlanDal.GetPlan({_id:payment.notes.plan_id}," name");
      const userDetails = await UserAuthDal.GetUser({_id:payment.notes.user_id},"name email phone");
      await PlanRenewDal.Create({
        plan_id: payment.notes.plan_id,
        membership_id: payment.notes.membership_id,
        user_id: payment.notes.user_id,
        activated: false,
        paid_price: (payment.amount / 100).toFixed(2),
      });
      UserNotificationsDAL.AddNotification({user: payment.notes.user_id, message: `The Advance plan ${selectedPlan.name} has been purchased successfully.` });   
      await PaymentDal.Create({
        user_id: _id,
        payment
      });
      if(payment.notes.coupon_id){
        await Utils.CreateCouponConsumption( payment.notes.coupon_id, _id, payment.notes.plan_id, null,(payment.amount / 100).toFixed(2),payment.notes.coupon_discount);
      }  
      if(userDetails.email)
      {emailTemplate = await EmailDal.GetOneEmail({});
      templateData = {
        name: userDetails.name,
        email: userDetails.email,
        template: emailTemplate?.plan_purchase_mail,
        plan_name: selectedPlan.name
      };
      Utils.sendBrevoMail.PlanRenew({
        template:templateData.template,
        subject:`Advance Plan Purchase Successful`,
        user:{name:templateData.name,email:templateData.email},
        params:{name:templateData.name,plan_name:templateData.plan_name}
      });}
      if(userDetails.phone){
        Utils.SendSMS.PlanRenew({
          name:userDetails.name,phone:userDetails.phone,plan_name:selectedPlan.name
        });
      }
      return {};
    } else {
      if(userDetails.email){
        emailTemplate = await EmailDal.GetOneEmail({});
        templateData = {
          name: userDetails.name,
          email: userDetails.email,
          template: emailTemplate?.plan_purchase_failure,
          plan_name: selectedPlan.name
        };
        Utils.sendBrevoMail.PlanPurchaseFail({
          template:templateData.template,
          subject:`Plan Purchase Failed`,
          user:{name:templateData.name,email:templateData.email},
          params:{name:templateData.name,plan_name:templateData.plan_name}
        });
      }
      if(userDetails.phone){
        Utils.SendSMS.PlanPurchaseFail({
          name:userDetails.name,phone:userDetails.phone,plan_name:selectedPlan.name
        });
      }
      throw new ApiError(CONSTANTS_MESSAGES.INTERNAL_SERVER_ERROR, StatusCodes.BAD_REQUEST)
    }
  },

  AddReferUsers : async (_id, data, user) => {
    if(user.email == data.refer_email || user.phone == data.refer_phone){
      throw new ApiError(CONSTANTS_MESSAGES.SELF_REFER, StatusCodes.BAD_REQUEST);
    }
    const existingRefer = await ReferedUsersDAL.GetReferedUser({ user_id: _id, refer_phone: data.refer_phone, refer_email: data.refer_email });
    if (existingRefer) {
      throw new ApiError(CONSTANTS_MESSAGES.REFER_USER_EXIST, StatusCodes.CONFLICT);
    }
    data.user_id = _id;
    await ReferedUsersDAL.AddReferUsers(data);
    return {};
  },

  GetWalletBalance: async(_id) => {
    const balance = await WalletTransactionDal.GetWalletTransaction({_id});
    console.log(balance);
  },

  GetUpgradePlans: async (user,data) => {
    const {
      sortBy = "name",
      sortOrder = -1,
      subscriberTypeFilter = CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL,
      corporateFilter = "ALL"
      } = data;
      const userData = await UserAuthDal.GetUser({_id: user._id},"plan");
      if(!userData) throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND );
      const sortObject = {};
      const searchQuery = {};
      
      sortObject[sortBy] = parseInt(sortOrder);

      if ( subscriberTypeFilter !== "ALL" ) {
        searchQuery.subscriber_type = Number(subscriberTypeFilter);
      }        
      if (Number(subscriberTypeFilter) === CONSTANTS.SUBSCRIBER_TYPE.CORPORATE && corporateFilter !== "ALL") {
        searchQuery.corporate = corporateFilter;
      }
     
      const resp = await PlanDal.GetAllPlan(searchQuery)
      const userPlanDetails =await PlanDal.GetPlan({ _id:userData.plan.id });
      const userMembershipDetails = userPlanDetails.membership_options.find(m=>m.membership_id===userData.plan.membership_id)
      
      const tempPlan = resp.filter(p => {
        if (p.membership_options[0].charges < userPlanDetails.membership_options[0].charges ) {
          return false;
        }
        return true;
      });
      
      await Promise.all(tempPlan.map(async (data) => {
          data.files = await Promise.all(data.files.map(async (file) => {
            return await Utils.getFileURL(file);
          }));
          await Promise.all(data.membership_options.map(async (option) => {
            option.charges_incl_GST = option.charges + (option.charges * CONSTANTS.PAYMENT.GST / 100);
          }));
        
      }));
      
      return {
        records: tempPlan,
      };
  },
    
  GetQueuedPlans: async (user_id,data) => {
    const { page, pageSize, sortBy="createdAt", sortOrder="-1" } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    searchQuery = {user_id};
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await PlanRenewDal.GetQueuedPlans(searchQuery, "", pagination);
    
    const totalCount = await PlanRenewDal.GetRecordCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      records: resp,
      pagination: {
        totalRecords: totalCount,
        pageSize: Number(pageSize),
        totalPages,
        currentPage: Number(page),
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      },
    };
  },
    
  GetPurchasedHealthCheckupPlans: async (user_id,data) => {
    const { page=1, pageSize=10, sortBy="createdAt", sortOrder="-1",
      startDate = dayjs().subtract(30, "day").startOf("day").toISOString(),
      endDate = dayjs().endOf("day").toISOString(),
     } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};
    searchQuery.user = user_id;
    sortObject[sortBy] = parseInt(sortOrder);
    if (startDate && endDate) {
      searchQuery.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await PurchasedHealthCheckupDal.GetPurchasedHealthChecks(searchQuery, "", pagination);    
    const totalCount = await PurchasedHealthCheckupDal.GetCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      records: resp,
      pagination: {
        totalRecords: totalCount,
        pageSize: Number(pageSize),
        totalPages,
        currentPage: Number(page),
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      },
    };
  },
    
  GetWalletTransactions: async(user_id) => await WalletTransactionDal.GetWalletTransactions({user_id}, 10),

  GetRequestedMembers: async (user_id) => {
    const resp = await UpdateMemberDAL.GetMembersRequestByUser({user_id});
    return await Promise.all(resp.map(async (r) => {
      if (r.file) {
        r.file = await Utils.getFileURL(r.file);
      }
      return r;
    }));
  },

  GetReferedUsers: async (user_id,data) => {
    const { page=1, pageSize=1000, sortBy="createdAt", sortOrder="-1"} = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};
    searchQuery.user_id = user_id;
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await ReferedUsersDAL.GetReferUsersUser(searchQuery, "refer_email refer_name refer_phone createdAt", pagination);    
    // const totalCount = await ReferedUsersDAL.GetRecorsCount(searchQuery);
    // const totalPages = Math.ceil(totalCount / pageSize);
    return {
      records: resp,
      // pagination: {
      //   totalRecords: totalCount,
      //   pageSize: Number(pageSize),
      //   totalPages,
      //   currentPage: Number(page),
      //   nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
      //   prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      // },
    };
  },

  GetNotifications: async (user_id,data) => {
    const { page=1, pageSize=1000, sortBy="createdAt", sortOrder="-1"} = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};
    searchQuery.user = user_id;
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await UserNotificationsDAL.GetAllNotifications(searchQuery, "-__v -updatedAt -read -user", pagination);    
    return {
      records: resp,
    };
  },

  DeleteNotification: async (user_id,_id) => {
    
    await UserNotificationsDAL.DeleteNotifications({ user: user_id, _id });    
    return {};
  },

  GetAllReferedUsers: async (user_id,data) => {
    const {
      page = 1,
      pageSize = 10000,
      sortBy = "createdAt",
      sortOrder = -1,
    } = data;
    const offset = (page-1) * pageSize;
    const sortObject = {};
    let searchQuery = {};
    searchQuery.user_id = user_id;
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery };
    const resp = await ReferedUsersDAL.GetReferUsers(searchQuery,"-__v",pagination);
    // const totalCount = await ReferedUsersDAL.GetRecorsCount(searchQuery);
    // const totalPages = Math.ceil( totalCount/ pageSize );
    return {
      records: resp,
    };
  },

  MfineRedirect: async(user) => {
    console.log(user)
    const { name,email,phone,plan, _id } = user;
    const silent_login = process.env.MFINE_SILENT_LOGIN;
    const mfine_subscription = process.env.MFINE_SUBSCRIPTION;
    const target_url = process.env.MFINE_TARGET_URL;
    const secret_key = process.env.MFINE_SECRET_KEY;
    const client_id = process.env.MFINE_CLIENT_ID;
    const plan_id = process.env.MFINE_PLAN_ID;
    const parent_orgid = process.env.MFINE_PARENT_ORGID;
    let resp;

    if(dayjs().isAfter(plan.end_date))throw new ApiError(CONSTANTS_MESSAGES.PLAN_EXPIRED, StatusCodes.BAD_REQUEST ); 
    
    const isUserRegistedMfine = await MfineSubsDal.CheckSubscription({user_id:_id});
    //  console.log(isUserRegistedMfine)
      if(isUserRegistedMfine == null){
        try {
          // let subs = await axios.post(mfine_subscription,
          //   {           
          //     mobile_number: `91${phone}`,
          //     plan_id: plan_id,
          //   }         
          //   ,
          //   {
          //   headers: {
          //     "client_id":client_id,
          //     "secret_key":secret_key,
          //     "Content-Type":"application/json",
          //     "x-parent-org-id":parent_orgid
          //   }
          // })
          // if(subs.status === 200){
            await MfineSubsDal.CreateSubscription({user_id:_id});
            resp = await axios.post(silent_login,
          {
            user_type: "patient",
            target_url:target_url,
            user_details: {
                mobile_number: `91${phone}`,
                firstname: name,
                lastname: "",
                email: email
              }
          }
          ,
          {
          headers: {
            "client_id":client_id,
            "secret_key":secret_key,
            "Content-Type":"application/json"
          }
        })
          // }
        } catch (error) {
          console.log(error)
          if(error.status === 404) throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.BAD_REQUEST );
          else if(error.status === 471) throw new ApiError(CONSTANTS_MESSAGES.UNAUTHORIZED, StatusCodes.UNAUTHORIZED );
          else if(error.status === 500) throw new ApiError(CONSTANTS_MESSAGES.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR );
        }
      }
      else{
        try{
        resp = await axios.post(silent_login,
          {
            user_type: "patient",
            target_url:target_url,
            user_details: {
                mobile_number: `91${phone}`,
                firstname: name,
                lastname: "",
                email: email
              }
          }
          ,
          {
          headers: {
            "client_id":client_id,
            "secret_key":secret_key,
            "Content-Type":"application/json"
          }
        })
        
       }catch(error){
        console.log("myerror", error)
        if(error.status === 400) throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.BAD_REQUEST );
        else if(error.status === 471) throw new ApiError(CONSTANTS_MESSAGES.UNAUTHORIZED, StatusCodes.UNAUTHORIZED );
       }
      }
      return resp.data;
    
  },

  GetHealthTest: async (_id) => {
    const user = await UserAuthDal.GetUser({ _id }, "email name plan phone");
    if(dayjs(user?.plan?.end_date).isBefore(dayjs())){
      throw new ApiError(CONSTANTS_MESSAGES.PLAN_EXPIRED_CANNOT_RAISE_CLAIM, StatusCodes.BAD_REQUEST);
    }  
    const tests = await HealthCheckDal.GetTestList({plan:user.plan.id});    
    return {records:tests}
  },

  AddHTCollectionDetails : async (_id, data) => {
    const latest = await PurchasedHealthCheckupDal.GetLatestPurchasedHealthCheck();
    if(latest.details_submitted){
     throw new ApiError(CONSTANTS_MESSAGES.APPOINTEMNT_ALREADY_TAKEN, StatusCodes.CONFLICT);
    }
    data.details_submitted = true;
    await PurchasedHealthCheckupDal.EditPurchasedHealthCheck(latest._id,data);
    return {}
   },

  AddPreviousHTCollectionDetails : async (_id, data) => {
    const test = await PurchasedHealthCheckupDal.GetPurchasedHealthCheck({_id},"");
    if(test == null) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.CONFLICT);
    if(test.details_submitted){
     throw new ApiError(CONSTANTS_MESSAGES.APPOINTEMNT_ALREADY_TAKEN, StatusCodes.CONFLICT);
    }
    data.details_submitted = true;
    await PurchasedHealthCheckupDal.EditPurchasedHealthCheck({_id},data);
    return {}
   },
 
   DeleteAccount : async (user) => {
  
    await UserAuthDal.UpdateUser({_id:user._id},{
      phone: user.phone.concat("_DEL")
    })
    return {}
   }


};

module.exports = UserService;