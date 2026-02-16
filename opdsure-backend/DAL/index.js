const AdminAuthDal = require("./admin/auth.dal");
const DesigDal = require("./admin/desig.dal");
const TCDal = require("./admin/tc.dal");
const CorpoDal = require("./admin/corpo.dal");
const UserAuthDal = require("./user/auth.dal");
const PlanDal = require("./admin/plan.dal");
const TestDal = require("./admin/test.dal");
const TokenActions = require("./token.dal");
const SysSettings = require("./admin/sysSettings.dal");
const ManagementUserDal = require("./admin/managmentUsers.dal");
const CorpoEmpDal = require("./admin/corpoEmp.dal");
const FamilyDAL = require("./user/family.dal");
const UpdateMemberDAL = require("./user/updateMember.dal");
const CouponDal = require("./admin/coupon.dal");
const DoctorDal = require("./admin/doctor.dal");
const PrivilegeDal = require("./admin/privilege.dal");
const ClaimDAL = require("./claim/claim.dal");
const AuditTrail = require("./admin/auditTrail.dal");
const ManagementAuthDal = require("./management/auth.dal")
const HealthCheckDal = require("./healthcheckup/healthcheck.dal");
const HealthCheckupPlanDal = require("./admin/healthCheckupPlans.dal");
const SpecializationDal = require("./admin/specialization.dal");
const PaymentDal = require("./payment.dal");
const DisputedClaimsDAL = require("./claim/claimDispute.dal");
const EmailDal = require("./admin/email.dal");
const ReferedUsersDAL = require("./referedUsers.dal");
const WalletTransactionDal = require("./user/walletTransaction.dal");
const PlanRenewDal = require("./planRenew.dal");
const CorporateHrDAL = require("./admin/corporateHr.dal");
const HrAuthDal = require("./hr/hrAuth.dal");
const CouponUsagesDal = require("./admin/couponUsages.dal");
const PurchasedHealthCheckupDal = require("./healthcheckup/purchasedHealthCheckup.dal");
const ContactUsCorporateDAL = require("./contactUsCorporate.dal");
const ContactUsRetailDAL = require("./contactUsRetail.dal");
const ContactUsEmailDAL = require("./contactUsEmail.dal");
const UserNotificationsDAL = require("./user/userNotification.dal");
const ManagementNotificationsDAL = require("./management/managementNotification.dal");
const AdminNotificationsDAL = require("./admin/admin.notification.dal");
const BlogsDal = require("./admin/blogs.dal");
const FaqDal = require("./admin/faq.dal");
const GoogleReviewsDal = require("./googleReviews.dal");
const MediaDal = require("./admin/media.dal");
const EventsDal = require("./admin/events.dal");
const LinkedinDal = require("./admin/linkedin.dal");
const JobsDal = require("./jobs.dal");
const JobApplicationDal = require("./jobApplication.dal");
const SignupOtpDal = require("./signupOTP.dal");
const SigninOtpDal = require("./signinOTP.dal");
const ResetPassDal = require("./resetPassword.dal")
const MfineSubsDal = require("./mfineSubs.dal")
const MyTestDal = require("./test.dal")
module.exports = {
    AdminAuthDal,
    DesigDal,
    UserAuthDal,
    CorpoDal,
    TCDal,
    PlanDal,
    TestDal,
    TokenActions,
    SysSettings,
    ManagementUserDal,
    CorpoEmpDal,
    FamilyDAL,
    UpdateMemberDAL,
    CouponDal,
    DoctorDal,
    PrivilegeDal,
    ClaimDAL,
    AuditTrail,
    ManagementAuthDal,
    HealthCheckDal,
    HealthCheckupPlanDal,
    SpecializationDal,
    PaymentDal,
    DisputedClaimsDAL,
    EmailDal,
    ReferedUsersDAL,
    WalletTransactionDal,
    PlanRenewDal,
    CorporateHrDAL,
    HrAuthDal,
    CouponUsagesDal,
    PurchasedHealthCheckupDal,
    ContactUsRetailDAL,
    ContactUsCorporateDAL,
    ContactUsEmailDAL,
    UserNotificationsDAL,
    ManagementNotificationsDAL,
    AdminNotificationsDAL,
    BlogsDal,
    FaqDal,
    GoogleReviewsDal,
    MediaDal,
    EventsDal,
    LinkedinDal,
    JobsDal,
    JobApplicationDal,
    SignupOtpDal,
    SigninOtpDal,
    ResetPassDal,
    MfineSubsDal,
    MyTestDal
};
