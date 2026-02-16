const AdminAuthSchema = require("./admin.auth");
const CommonSchema = require("./common");
const UserAuthSchema = require("./user/user.auth");
const TestSchema = require("./admin.test");
const SysSettingsSchema = require("./admin.sysSettings");
const TCSchema = require("./admin.tc");
const UserSchema = require("./user/user");
const CouponSchema = require("./admin.coupon");
const DoctorSchema = require("./admin.doctor");
const ManagementAuthSchema = require("./management/management.auth");
const ManagementSchema = require("./management/management");
const AdminSchema = require("./admin/admin");
const EmailSchema = require("./admin.email");
const HrAuthSchema = require("./hr/hr.auth");
const HRSchema = require("./hr/hr");

module.exports = {
    AdminAuthSchema,
    CommonSchema,
    UserAuthSchema,
    TestSchema,
    SysSettingsSchema,
    TCSchema,
    UserSchema,
    CouponSchema,
    DoctorSchema,
    ManagementAuthSchema,
    ManagementSchema,
    AdminSchema,
    EmailSchema,
    HrAuthSchema,
    HRSchema
};