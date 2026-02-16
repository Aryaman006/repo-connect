const ValidateRequest = require("./validationRequest");
const AdminAuth =require("./adminAuth");
const UserAuth =require("./userAuth");
const ValidatePrivilege = require("./validatePrivilege");
const ManagementUsersAuth = require("./managementUserAuth");
const HRAuth = require("./hrAuth");

module.exports = {
    ValidateRequest,
    AdminAuth,
    UserAuth,
    ValidatePrivilege,
    ManagementUsersAuth,
    HRAuth,
}