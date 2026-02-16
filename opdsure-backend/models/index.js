const adminDetails = require("./adminDetails");
const tc = require("./tc")
const designations = require("./designation");
const corporates = require("./corporates");
const user = require("./user.model");
const plans = require("./plan.model");
const tests = require("./test");
const sysSettings = require("./sysSettings.model");
const managmentUsers = require("./managementUser.model");
const corpoEmps = require("./corpoEmp.model");
const family = require("./familyMember");
const updateMember = require("./updateMember.model");
const coupons = require("./coupon.model");
const doctors = require("./doctor.model");
const claim = require("./claim.model");
const adminAuditTrails = require("./adminAuditTrail.model");
const generalUsersAuditTrails = require("./generalUserAuditTrail.model");
const privileges = require("./privilege.model");
const healthcheck = require("./healthcheck.model");
const healthCheckupPlans = require("./healthCheckupPlans.model");
const specializations = require("./specialization.model");
const tempCorpoEmps = require("./tempCorpoEmp.model");
const payments = require("./payments.model");
const disputedClaims = require("./disputedClaim.model");
const email = require("./email");
const referedUsers = require("./referedUsers.model");
const walletTransaction = require("./walletTransaction.model");
const planRenewList = require("./planRenew.model");
const corporateHr = require("./corporateHr.model");
const couponUsages = require("./couponUsages.model");
const purchasedHealthCheckupPlans = require("./purchasedHealthCheckupPlans.model");
const contactUsRetails = require("./contactUsRetail.model");
const contactUsCorporates = require("./contactUsCorporate.model");
const contactUsEmails = require("./contactUsEmails.model");
const userNotifications = require("./userNotification.model");
const managementNotifications = require("./managementNotification.model");
const adminNotifications = require("./adminNotification.model");
const blogs = require("./blogs.model");
const faqs = require("./faq.model");
const googleReviews = require("./googleReviews.model");
const media = require("./media.model");
const events = require("./events.model");
const linkedin = require("./linkedin.model");
const jobs = require("./jobs.model");
const jobApplications = require("./jobApplication.model");
const SignupOTP = require("./signupOtp.model");
const SigninOTP = require("./signinOtp.model");
const ResetPass = require("./resetPass.model");
const MfineSubs = require("./mfineSub.model");

module.exports = {
    adminDetails,
    designations,
    user,
    corporates,
    tc,
    plans,
    tests,
    sysSettings,
    managmentUsers,
    corpoEmps,
    family,
    updateMember,
    coupons,
    doctors,
    claim,
    adminAuditTrails,
    generalUsersAuditTrails,
    privileges,
    healthcheck,
    healthCheckupPlans,
    specializations,
    tempCorpoEmps,
    payments,
    disputedClaims,
    email,
    referedUsers,
    walletTransaction,
    planRenewList,
    corporateHr,
    couponUsages,
    purchasedHealthCheckupPlans,
    contactUsRetails,
    contactUsCorporates,
    contactUsEmails,
    userNotifications,
    managementNotifications,
    adminNotifications,
    blogs,
    faqs,
    googleReviews,
    media,
    events,
    linkedin,
    jobs,
    jobApplications,
    SignupOTP,
    SigninOTP,
    ResetPass,
    MfineSubs
};
