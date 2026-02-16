const AdminService = require("./admin/admin.service");
const UserService = require("./user/user.service");
const TokenServices = require("./token.service");
const PublicService = require("./public/public.service")
const ManagementService = require("./management/management.service")
const HRService = require("./hr/hr.service");
module.exports = { 
    AdminService,
    UserService,
    TokenServices,
    PublicService,
    ManagementService,
    HRService,
};
