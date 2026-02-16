const DesigController = require("./admin/designation.controller");
const TCController = require("./admin/t&c.controller");
const AdminAuthController = require("./admin/auth.controller");
const CorpoController = require("./admin/corpo.controller")
const UserAuthController = require("./user/auth.controller");
const TestController = require("./admin/test.controller");
const SysSettingsController = require("./admin/sysSettings.controller");
const PublicController = require("./public/public.controller");
const UserController = require("./user/user.controller");
const CouponController = require("./admin/coupon.controller");
const AdminController = require("./admin/admin.controller");
const ManagementAuthController = require("./management/auth.controller");
const ManagementController = require("./management/management.controller");
const HRAuthController = require("./hr/auth.controller");
const HRController = require("./hr/hr.controller");


module.exports = { 
    AdminAuthController,
    DesigController,
    UserAuthController,
    CorpoController,
    TCController,
    TestController,
    SysSettingsController,
    PublicController,
    UserController,
    CouponController,
    AdminController,
    ManagementAuthController,
    ManagementController,
    HRAuthController,
    HRController,
 };
