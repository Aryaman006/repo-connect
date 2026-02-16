import { createBrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminSignin from "./pages/Authentication/AdminSignin";
import AdminSignup from "./pages/Authentication/AdminSignup";
import UserSignin from "./pages/Authentication/UserSignin";
import UserSignup from "./pages/Authentication/UserSignup";
import Signin from "./pages/Authentication/Signin";
import LayoutWrapper from "./components/LayoutWrapper";
import ErrorPage from "./pages/ErrorPage";
import ForgetPassword from "./pages/Authentication/ForgetPassword";
import Logout from "./pages/Authentication/Logout";
import Designation from "./pages/admin/master/designation";
import Corporate from "./pages/admin/master/corporate";
import Plan from "./pages/admin/master/plan";
import "./index.css";
import UserDashboard from "./pages/user/UserDashboard";
import UserProfile from "./pages/user/UserProfile";
import FreeHealthCheckUpForm from "./pages/user/FreeHealthCheckUpForm";
import HealthTest from "./pages/admin/master/healthTest";
import SystemSettings from "./pages/admin/master/settings";
import PlanSelection from "./pages/PlanSelection";
import UserClaimsForm from "./pages/user/UserClaimsForm";
import Conditions from "./pages/admin/master/conditions";
import CorpoEmp from "./pages/admin/master/corpoEmp";
import ManagmentUsers from "./pages/admin/master/managmentUsers";
import AdminLayoutWrapper from "./components/AdminLayoutWrapper";
import Coupon from "./pages/admin/master/coupon";
import Doctor from "./pages/admin/master/doctor";
import UserTermsConditions from "./pages/user/UserTermsConditions";
import UserClaimDisplay from "./pages/user/UserClaimDisplay";
import ClaimDocuments from "./pages/user/ClaimDocuments";
import HealthCheckUpDisplay from "./pages/user/HealthCheckUpDisplay";
import HealthCheckupPlan from "./pages/admin/master/healthCheckupPlan";
import UserDisputeViewClaim from "./pages/user/UserDisputeViewClaimDetails";

import ManagementDashboard from "./pages/Management/ManagementDashboard";
import ClaimDisplay from "./pages/Management/ClaimDisplay";
import CouponDetails from "./pages/Management/CouponDetails";
import ClaimDetails from "./pages/Management/ClaimDetails";
import Privilege from "./pages/admin/master/privilegs";
import AuditLogs from "./pages/admin/auditTrail";
import UserCouponApply from "./pages/user/UserCouponApply";
import Specialization from "./pages/admin/master/specialization";

import ManagementLayoutWrapper from "./components/ManagementLayoutWrapper";
import HealthCheckUpDetails from "./pages/user/HealthCheckUpDetails";

import UserSignUp from "./pages/Auth/UserSignUp";
import UserSignIn from "./pages/Auth/UserSignIn";
import OnboardingDetails from "./pages/Auth/OnboardingDetails";
import RestPassword from "./pages/Authentication/ResetPassword";
import ManagementHealthCheckUpDisplay from "./pages/Management/ManagementHealthCheckUpDisplay";
import UserHealthPlanSelection from "./pages/user/UserHealthPlanSelection";
import GeneralUserProtectedRoute from "./components/GeneralUserProtectedRoute";
import CONSTANTS from "./constant/Constants";
import Unauthorized from "./pages/Unauthorized";
import ManagementUserProtectedRoute from "./components/ManagementUserProtectedRoute";
import PlanProtectedRoute from "./components/PlanProtectedRoute";
import EmailSettings from "./pages/admin/master/EmailSettings";
import DisputedClaimDisplay from "./pages/Management/DisputedClaimDisplay";
import DisputedClaimDetails from "./pages/Management/DisputedClaimDetails";
import PurchasedPlanDetails from "./pages/user/PurchasedPlanDetails";
import PaymentSuccess from "./pages/user/PaymentSuccess";
import UserTips from "./pages/user/UserTips";
import Refer from "./pages/user/Refer";
import ReferedUsers from "./pages/admin/referedUsers";
import UpgradePlanSelection from "./pages/user/UpgradePlanSelection";
import UserMyPlanPage from "./pages/user/UserMyPlanPage";
import UserPlanUpgradeCouponApply from "./pages/user/UserPlanUpgradeCouponApply";
import TransferClaims from "./pages/Management/TransferClaims";
import ApproveUpdatedMembers from "./pages/admin/approveUpdatedMembers";
import FamilyList from "./pages/admin/familyList";
import RenewPlanSelection from "./pages/user/RenewPlanSelection";
import UserPlanRenewCouponApply from "./pages/user/UserPlanRenewCouponApply";
import AdminClaimsDisplay from "./pages/admin/Claims/AdminClaimsDisplay";

import WebHomePage from "./WebApp/Pages/WebHomePage";
import PlanPage from "./WebApp/Pages/PlanPage";
import LayoutWrapperWeb from "./WebApp/CommonComponents/LayoutWrapperWeb";
import CorporateHR from "./pages/admin/master/corporateHR";
import HrSignin from "./pages/Authentication/HRSignin";
import HRProtectedRoute from "./components/HRProtectedLayoutWrapper";
import CorporateEmp from "./pages/hr/corporateEmp";
import ResetPassword from "./pages/user/ResetPassword";
import CouponUsage from "./pages/admin/couponUsage";
import SubscriberList from "./pages/admin/SubscriberList";
import JoinUsPage from "./WebApp/Pages/JoinUsPage";
import PurchasedHealthCheckups from "./pages/admin/PurchasedHealthCheckups";
import ContactUsRetail from "./pages/admin/contactUsRetail";
import ContactUsCorporate from "./pages/admin/contactUsCorporate";
import ContactUsEmail from "./pages/admin/contactUsEmail";
import Faq from "./WebApp/Pages/Faq";
import FAQMaster from "./pages/admin/master/faqMaster";
import Blogs from "./pages/admin/blogs";
import PrivacyPolicy from "./WebApp/Pages/PrivacyPolicy";
import BlogPage from "./WebApp/Pages/BlogPage";
import IndividualBlog from "./WebApp/Pages/IndividualBlog";
import ContactUsPage from "./WebApp/Pages/ContactUsPage";
import GoogleReviews from "./pages/admin/googleReviews";
import Disclaimer from "./WebApp/Pages/Disclaimer";
import AboutUsPage from "./WebApp/Pages/AboutUsPage";
import MediaPage from "./WebApp/Pages/MediaPage";
import Media from "./pages/admin/media";
import Services from "./WebApp/Pages/Services";
import Careers from "./WebApp/Pages/Careers";
import Events from "./pages/admin/events";
import Linkedin from "./pages/admin/linkedin";
import EventsPage from "./WebApp/Pages/EventsPage";
import IndividualEvent from "./WebApp/Pages/IndividualEvents";
import AppliedJobs from "./pages/admin/AppliedJobs";
import Jobs from "./pages/admin/jobs";
import UnderDevelopment from "./WebApp/UnderDevelopment";
import EmployeeWellnessCorporate from "./WebApp/Pages/EmployeeWellnessCorporate";
import WellGiftsPage from "./WebApp/Pages/WellGiftsPage";
import ResetPasswordAdmin from "./pages/Authentication/ResetPasswordAdmin";
import ResetPasswordManag from "./pages/Authentication/ResetPasswordManagement";
import ThankYouPage from "./WebApp/Pages/ThankYouPage";
import FailedDetails from "./pages/user/resubmitDetails";
import PurchasedFreeHealthTests from "./pages/PurchasedFreeHealthTests";
import FillTestDetails from "./pages/user/FillTestDetails";
import HealthCheckupPlans from "./WebApp/Pages/HealthCheckup";
import DoctorFromClaims from "./pages/admin/doctorsFromClaims";
import DoctorsFromClaimsDetails from "./pages/admin/doctorsFromClaimsDetails";
import DoctorToggleComponents from "./pages/admin/master/doctormain";
import SubscriberListEmpl from "./pages/Subscriberlist";
import ContactUsEmailEmply from "./pages/ContactUsEmail";
import ContactUsCorporateEmply from "./pages/ContactUsCorporate";
import ContactUsRetailEmply from "./pages/ContactUsRetail";
import AdminClaimDetails from "./pages/admin/Claims/AdminClaimDetails";
import CorpoPlan from "./pages/hr/corpoPlan";



const router = createBrowserRouter([
  {
    path: "/homepage", element: <LayoutWrapperWeb />, children: [{ index: true, element: <WebHomePage /> }],
  },
  {
    path:'/subscription-plans', element:<LayoutWrapperWeb/>, children: [{ index: true, element: <PlanPage /> }],
  },
  {
    path: '/subscription-plans-corporate', element:<LayoutWrapperWeb/>, children: [{ index: true, element: <PlanPage /> }],
  },
  {
    path:'/health-plans', element:<LayoutWrapperWeb/>, children: [{ index: true, element: <HealthCheckupPlans /> }],
  },
  {
    path:'/join-us', element:<LayoutWrapperWeb/>, children : [{index:true, element:<JoinUsPage/>}],
  },
  {
    path:'/FAQs', element:<LayoutWrapperWeb />, children: [{index: true, element: <Faq/>}],
  },
   { 
    path:'/contact-us', element:<LayoutWrapperWeb/>, children: [{ index: true, element: <ContactUsPage /> }],
   },
  {
    path: '/privacy-policy', element: <LayoutWrapperWeb />, children: [{ index: true, element: <PrivacyPolicy /> }],
  },
  {
    path: '/disclaimer' , element: <LayoutWrapperWeb />, children: [{index: true, element: <Disclaimer />}],
  },
  {
    path: '/blogs', element: <LayoutWrapperWeb />, children: [{ index: true, element: <BlogPage /> }],
  },
  {
    path:'/blogs/:id', element:<LayoutWrapperWeb/>, children: [{ index: true, element: <IndividualBlog /> }],
  },
  {
    path: '/media', element: <LayoutWrapperWeb />, children: [{ index: true, element: <MediaPage /> }],
  },
  {
    path:'/media/:id', element:<LayoutWrapperWeb/>, children: [{ index: true, element: <MediaPage /> }],
  },
  {
    path: '/events', element: <LayoutWrapperWeb />, children: [{ index: true, element: <EventsPage /> }],
  },
  {
    path:'/events/:id', element:<LayoutWrapperWeb/>, children: [{ index: true, element: <IndividualEvent /> }],
  },
  {
    path:"/about-us", element:<LayoutWrapperWeb/>, children:[{index:true, element:<AboutUsPage/>}],
  },
  {
    path:"/thank-you", element:<LayoutWrapperWeb/>, children:[{index:true, element:<ThankYouPage/>}],
  },
{
  path:"/services", element:<LayoutWrapperWeb/>, children:[{index:true, element:<Services/>}],
},
{
  path:"/careers", element:<LayoutWrapperWeb/>, children:[{index:true, element:<Careers/>}],
},
{
  path:"/wellness-gifts", element:<LayoutWrapperWeb/>, children:[{index:true, element:<WellGiftsPage/>}],
},
{
  path:"/employee-health-wellness", element:<LayoutWrapperWeb/>, children:[{index:true, element:<EmployeeWellnessCorporate/>}],
},

{
  path: "terms-and-conditions/:TC_TYPE_ENUM",
  element:<LayoutWrapperWeb/>, children:[{index:true, element: <UserTermsConditions />}],
}, 
  {
    path: "/", element: <LayoutWrapperWeb />, children: [{ index: true, element: <WebHomePage /> }],
  },
  {
    path: "/logout",element: <Logout />,
  },
  {path: "/fill-test-details", element:<FillTestDetails />},
  {
    path:"/hr",
    children:[
      { path: "login", element: <HrSignin /> },
      // { path: "reset-password", element: <RestPassword /> },        
      ]
  },
  {
    element: <HRProtectedRoute allowedRole={CONSTANTS.USER_ROLES.HR_USER} />,
    children: [
      {
        path: "/hr",
        element: <LayoutWrapper />,
        errorElement: <ErrorPage />,
        children: [
          { path: "master/employees", element: <CorporateEmp /> },
          {path :"corporatePlan", element:<CorpoPlan/>},
          // { path: "contact-us-retail-empl",element: <ContactUsRetailEmply/> },
          // { path: "contact-us-corporate-empl",element: <ContactUsCorporateEmply /> },
          // { path: "contact-us-email-empl",element: <ContactUsEmailEmply /> },
        ],
      },
    ],
  },
  {
    path:"/user",
    children:[
      { path: "signup", element: <UserSignUp /> },
      { path: "login", element: <UserSignIn /> },
      // { path: "reset-password", element: <RestPassword /> },
      { path: "plans", element: <PlanSelection /> },
      {
        path: "terms-and-conditions/:TC_TYPE_ENUM",
        element: <UserTermsConditions />,
      }, 
      { path : "health-plans", element:<UserHealthPlanSelection/>},
      { path: "plans", element: <PlanSelection /> },
       {path: "payment", element:<UserCouponApply />},
       {path: "payment/upgrade-plan", element:<UserPlanUpgradeCouponApply />},
       {path: "payment/renew-plan", element:<UserPlanRenewCouponApply />},
       {path: "register", element: <UserSignUp />},
       {path: "signin", element: <UserSignIn />},
       {path:"onboarding", element: <OnboardingDetails/>},
       {path:"resubmit-details", element: <FailedDetails/> },
       {path: "tips", element: <UserTips />},
      //  {path:"forgot", element: <ForgetPassword />},
       {path: "paymentsuccess", element: <PaymentSuccess /> },
       { path: "plan-upgrade", element: <UpgradePlanSelection /> },  
       { path: "plan-renew", element: <RenewPlanSelection /> },  
      //  { path:"forced-reset-password", element:<ResetPassword /> },           
      ]
    },
    {
      element: <GeneralUserProtectedRoute allowedRole={CONSTANTS.USER_ROLES.GENERAL_USER} />,
      children: [
        {
          path: "/user",
          element: <LayoutWrapper />,
          errorElement: <ErrorPage />,
          children: [
            {
              element: <PlanProtectedRoute allowedRole={CONSTANTS.USER_ROLES.GENERAL_USER} />,
              children: [
              { path: "dashboard", element: <UserDashboard /> },
              { path: "profile", element: <UserProfile /> },
              { path: "claims", element: <UserClaimDisplay /> },
              { path: "addclaims", element: <UserClaimsForm /> },
              { path: "claim/dispute/:id", element: <UserDisputeViewClaim /> },
              { path: "upload-claim-documents", element: <ClaimDocuments /> },
              { path: "addclaims/:id", element: <UserClaimsForm /> },
              { path: "addhealth-checkups", element: <FreeHealthCheckUpForm /> },
              { path: "health-checkups", element: <HealthCheckUpDisplay /> },
              { path: "checkup-details/:id", element: <FreeHealthCheckUpForm /> },
              { path:"myplan", element:<UserMyPlanPage/> },
              { path:"refer", element:<Refer/> },
                
              
            ],
          },
        ],
      },
    ],
  },
  {
    path:"/admin",
    children:[
      { path: "signup", element: <AdminSignup /> },
      { path:"login",element:<AdminSignin />, },
      { path: "forgot", element: <ForgetPassword /> },     
      { path: "recover", element: <ResetPasswordAdmin /> },     
    ]
  },
  {
    element: <ProtectedRoute allowedRole={CONSTANTS.USER_ROLES.ADMIN} />,
    children: [
      {
        path: "/admin",
        element: <LayoutWrapper />,
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Homepage /> },
          { path: "master/users", element: <ManagmentUsers /> },
          { path: "master/corporate", element: <Corporate /> },
          { path: "master/designation", element: <Designation /> },
          { path: "master/plan", element: <Plan /> },
          { path: "master/conditions", element: <Conditions /> },
          { path: "master/test", element: <HealthTest /> },
          { path: "master/settings", element: <SystemSettings /> },
          { path: "master/email-settings", element :<EmailSettings/>},
          { path: "master/corpoEmp", element: <CorpoEmp /> },
          { path: "master/corporateHR", element: <CorporateHR /> },
          { path: "master/coupon", element: <Coupon /> },
          { path: "master/doctor", element: <Doctor /> },
          { path: "master/doctormain", element: <DoctorToggleComponents /> },
          { path: "master/specialization", element: <Specialization /> },
          { path: "master/healthCheckupPlans", element: <HealthCheckupPlan /> },
          { path: "master/privilege", element: <Privilege /> },
          { path: "audit/logs", element: <AuditLogs /> },
          { path: "refered-users", element: <ReferedUsers /> },
          { path: "approve-updated-users", element: <ApproveUpdatedMembers /> },
          { path: "families/:id", element: <FamilyList /> },
          { path:"claims", element:<AdminClaimsDisplay /> },
          { path:"doctorfromclaims", element:<DoctorFromClaims /> },
          { path:"doctorfromclaims-details/:id", element:<DoctorsFromClaimsDetails /> },
          { path:"claim-details/:id", element:<AdminClaimDetails /> },
          { path:"coupon-usages", element:<CouponUsage /> },
          {path :"registered-users", element:<SubscriberList/>},
          { path: "purchased-health-checkups",element: <PurchasedHealthCheckups/> },
          { path: "purchased-free-health-tests",element: <PurchasedFreeHealthTests /> },
          { path: "contact-us-retail",element: <ContactUsRetail/> },
          { path: "contact-us-corporate",element: <ContactUsCorporate /> },
          { path: "contact-us-email",element: <ContactUsEmail /> },
          { path: "blogs",element: <Blogs /> },
          { path: "google-reviews",element: <GoogleReviews/> },
          {path: "master/faqs", element: <FAQMaster/>},
          {path: "media", element: <Media />},
          {path: "events", element: <Events />},
          {path: "linkedin", element: <Linkedin />},
          {path:"application-recieved", element:<AppliedJobs/>},
          {path: "jobs", element: <Jobs/>},

        ],
      },
    ],
  },
  {
    path:"/management",
    children:[  
      { path: "recover", element: <ResetPasswordManag /> },     
    ]
  },
  {
    element: <ManagementUserProtectedRoute allowedRole={CONSTANTS.USER_ROLES.MANAGEMENT_USER} />,
    children: [
      {
        path: "/management",
        element: <LayoutWrapper />,
        errorElement: <ErrorPage />,
        children: [
          { path: "claims", element: <ClaimDisplay /> },
          { path: "claims/disputed", element: <DisputedClaimDisplay /> },
          { path: "coupons-details", element: <CouponDetails /> },
          { path: "claim-details/:id", element: <ClaimDetails /> },
          { path: "claim-details/disputed/:id", element: <DisputedClaimDetails /> },
          { path: "health-checkups", element: <ManagementHealthCheckUpDisplay /> },
          { path: "health-checkups-details/:id", element: <FreeHealthCheckUpForm /> },
          {path :"registered-users-empl", element:<SubscriberListEmpl/>},
          { path: "contact-us-retail-empl",element: <ContactUsRetailEmply/> },
          { path: "contact-us-corporate-empl",element: <ContactUsCorporateEmply /> },
          { path: "contact-us-email-empl",element: <ContactUsEmailEmply /> },
          { path: "dashboard", element: <ManagementDashboard /> },
          {path: "claims-transfer",element: <TransferClaims/>},
        ],
      },
    ],
  },
  {
    path:"/unauthorized", element: <Unauthorized />
  },
  {
    path:"*", element:<ErrorPage />
  },
  {
    path:"/under-development", element:<UnderDevelopment />
  }
 
]);

export default router;
