const express = require("express")
const router = express.Router();
const { VERSION } = require("../Config")
const AdminRouter = require("./admin.routes")
const UserRouter = require("./user.routes")
const PublicRouter = require("./public.routes")
const ManagenetRouter = require("./management.router")
const HRRouter = require("./hr.routes");

const defaultRoutes = [
    {
        path: `/${VERSION}/admin`,
        route: AdminRouter
    },
    {
        path: `/${VERSION}/user`,
        route: UserRouter
    },
    {
        path: `/${VERSION}/public`,
        route: PublicRouter
    },
    {
        path: `/${VERSION}/management`,
        route: ManagenetRouter
    },
    {
        path: `/${VERSION}/hr`,
        route: HRRouter
    }
];

defaultRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})

module.exports = router