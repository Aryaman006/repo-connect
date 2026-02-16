const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const crypto = require('crypto');
const {
  AdminAuthDal,
  DesigDal,
  CorpoDal,
  TCDal,
  PlanDal,
  TestDal,
  SysSettings,
  ManagementUserDal,
  CorpoEmpDal,
  CouponDal,
  DoctorDal,
  PrivilegeDal,
  HealthCheckupPlanDal,
  SpecializationDal,
  EmailDal,
  ReferedUsersDAL,
  UpdateMemberDAL,
  FamilyDAL,
  UserAuthDal,
  ClaimDAL,
  CorporateHrDAL,
  CouponUsagesDal,
  DisputedClaimsDAL,
  PurchasedHealthCheckupDal,
  ContactUsRetailDAL,
  ContactUsCorporateDAL,
  ContactUsEmailDAL,
  AdminNotificationsDAL,
  UserNotificationsDAL,
  BlogsDal,
  FaqDal,
  GoogleReviewsDal,
  MediaDal,
  EventsDal,
  LinkedinDal,
  JobsDal,
  JobApplicationDal,
  ResetPassDal,
  HealthCheckDal,
  WalletTransactionDal
} = require("../../DAL");
const { CONSTANTS_MESSAGES, NOTIFICATIONS } = require("../../Helper");
const { JwtSign, ApiError, Utils, GetExtendedDays } = require("../../Utils");
const { StatusCodes } = require("http-status-codes");
const { CONSTANTS } = require("../../Constant");
const AuditTrailDal = require("../../DAL/admin/auditTrail.dal");
const { purchasedHealthCheckupPlans } = require("../../models");
const AdminService = {

  UploadFile: async (_id, files) => {
    const uploadPromises = files.map(async (file) => {
      const token = await Utils.generateRandomToken();
      const fileName = `admin/${token}/${new Date()}${file.originalname}`;
      return Utils.UploadFile(file.buffer, fileName, file.mimetype);
    });
    return await Promise.all(uploadPromises);
  },

  Login: async (data) => {
    const { email, password } = data;

    const existingUser = await AdminAuthDal.GetAdmin(
      { email },
      "_id email password token admin_type status"
    );
    if (!existingUser) {
      throw new ApiError(
        CONSTANTS_MESSAGES.ADMIN_NOT_FOUND,
        StatusCodes.NOT_FOUND
      );
    }
    if (existingUser.status === CONSTANTS.STATUS.INACTIVE) {
      throw new ApiError(CONSTANTS_MESSAGES.ADMIN_INACTIVE, StatusCodes.UNAUTHORIZED);
    }


    const matched = await bcrypt.compare(password, existingUser.password);

    if (!matched) {
      throw new ApiError(
        CONSTANTS_MESSAGES.WRONG_PASSWORD,
        StatusCodes.BAD_REQUEST
      );
    }
    const token = await JwtSign({
      email: existingUser.email,
      _id: existingUser._id,
      admin_type: existingUser.admin_type
    });

    existingUser.token.push(token);
    await AdminAuthDal.UpdateAdmin({ _id: existingUser._id }, existingUser);

    return { token: token, _id: existingUser._id, role: CONSTANTS.USER_ROLES.ADMIN };
  },

  Logout: async (token, _id) => {
    const user = await AdminAuthDal.GetAdmin(_id);
    await AdminAuthDal.UpdateAdmin({ _id }, { $pull: { token: token } });
    return {}
  },


  GetProfile: async (_id) => {
    const existingUser = await AdminAuthDal.GetAdmin({ _id }, "_id name email phone designation country_code");
    if (!existingUser) {
      throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return existingUser;
  },

  SignUp: async (data) => {
    const { email, password, admin_type = CONSTANTS.ADMIN_TYPE.ADMIN, name, phone, country_code } = data;

    const existingUser = await AdminAuthDal.GetAdmin({ email }, "_id token");
    if (existingUser) throw new ApiError(CONSTANTS_MESSAGES.EMAIL_EXISTS, StatusCodes.CONFLICT);

    const user = await AdminAuthDal.CreateAdmin({ email, password, admin_type, name, phone, country_code });
    // await Utils.sendMail.signup({
    //   name: "Utkarsh Singh Tomar",
    //   email: "ust816@gmail.com",
    // });
    const privilige = [
      { user_id: user.id, module_id: CONSTANTS.MODULE_TYPE.ADMIN, program_id: CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.DESIGNATION.id, GET: 1, POST: 1, PATCH: 1, DELETE: 1 },
      { user_id: user.id, module_id: CONSTANTS.MODULE_TYPE.ADMIN, program_id: CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.USER.id, GET: 1, POST: 1, PATCH: 1, DELETE: 1 },
      { user_id: user.id, module_id: CONSTANTS.MODULE_TYPE.ADMIN, program_id: CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE.id, GET: 1, POST: 1, PATCH: 1, DELETE: 1 },
      { user_id: user.id, module_id: CONSTANTS.MODULE_TYPE.ADMIN, program_id: CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE_EMPLOYEE.id, GET: 1, POST: 1, PATCH: 1, DELETE: 1 },
      { user_id: user.id, module_id: CONSTANTS.MODULE_TYPE.ADMIN, program_id: CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.PLANS.id, GET: 1, POST: 1, PATCH: 1, DELETE: 1 },
      { user_id: user.id, module_id: CONSTANTS.MODULE_TYPE.ADMIN, program_id: CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.TESTS.id, GET: 1, POST: 1, PATCH: 1, DELETE: 1 },
      { user_id: user.id, module_id: CONSTANTS.MODULE_TYPE.ADMIN, program_id: CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.DOCTORS.id, GET: 1, POST: 1, PATCH: 1, DELETE: 1 },
      { user_id: user.id, module_id: CONSTANTS.MODULE_TYPE.ADMIN, program_id: CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.COUPONS.id, GET: 1, POST: 1, PATCH: 1, DELETE: 1 },
      { user_id: user.id, module_id: CONSTANTS.MODULE_TYPE.ADMIN, program_id: CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.TC.id, GET: 1, POST: 1, PATCH: 1, DELETE: 1 },
      { user_id: user.id, module_id: CONSTANTS.MODULE_TYPE.ADMIN, program_id: CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.SYSTEM.id, GET: 1, POST: 1, PATCH: 1, DELETE: 1 },
      { user_id: user.id, module_id: CONSTANTS.MODULE_TYPE.ADMIN, program_id: CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.PRIVILEGES.id, GET: 1, POST: 1, PATCH: 1, DELETE: 1 },
      { user_id: user.id, module_id: CONSTANTS.MODULE_TYPE.ADMIN, program_id: CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.AUDIT_LOGS.id, GET: 1, POST: 1, PATCH: 1, DELETE: 1 },
      { user_id: user.id, module_id: CONSTANTS.MODULE_TYPE.ADMIN, program_id: CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.LOGIN_LOGS.id, GET: 1, POST: 1, PATCH: 1, DELETE: 1 }
    ]
    await PrivilegeDal.CreatePrivilege(privilige);
    const token = await JwtSign({ email: user.email, _id: user._id });
    user.token.push(token);
    await AdminAuthDal.UpdateAdmin({ _id: user._id }, user);
    return { token, _id: user._id };
  },

  AddDesig: async (data) => {
    const uniqueDesignation = await DesigDal.CheckUniqueDesignation({ designation: data.designation });
    if (uniqueDesignation) throw new ApiError(CONSTANTS_MESSAGES.NAME_EXISTS, StatusCodes.BAD_REQUEST);
    return await DesigDal.CreateDesig(data);
  },
  GetAllDesig: async (data) => {
    const { search, page = 1, pageSize = 10, sortBy = "name", sortOrder = "-1" } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    if (search) {
      searchQuery = {
        designation: { $regex: search, $options: "i" }
      };
    } else {
      searchQuery = {};
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await DesigDal.GetAllDesig(searchQuery, "", pagination);
    const totalCount = await DesigDal.GetRecordCount(searchQuery);
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

  EditDesig: async (data, _id) => {
    const uniqueDesignation = await DesigDal.CheckUniqueDesignation({ designation: data.designation });
    if (uniqueDesignation) throw new ApiError(CONSTANTS_MESSAGES.NAME_EXISTS, StatusCodes.BAD_REQUEST);
    return await DesigDal.EditDesig({ _id }, data, { new: false });
  },

  DeleteDesig: async (_id) => await DesigDal.DeleteDesig({ _id, id: null }),

  GetTC: async () => {
    const resp = await TCDal.GetTC();
    return { records: resp };
  },

  EditTC: async (data) => {
    const { condition, id } = data;
    return await TCDal.EditTC({ _id: id }, { condition });

  },

  AddCorpo: async (data) => {
    const checkUniqueName = await CorpoDal.CheckUniqueName({ name: data.name })
    if (checkUniqueName) throw new ApiError(CONSTANTS_MESSAGES.NAME_EXISTS, StatusCodes.BAD_REQUEST);
    return await CorpoDal.CreateCorpo(data);
  },

  GetAllCorpo: async (data) => {
    const { search, page, pageSize, sortBy, sortStateBy, sortOrder, stateSortOrder } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    if (search) {
      searchQuery = {
        $or: [{ name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
        ],
      };
    } else {
      searchQuery = {};
    }
    sortObject[sortBy] = parseInt(sortOrder);
    sortObject[sortStateBy] = parseInt(stateSortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await CorpoDal.GetAllCorpo(searchQuery, "", pagination);
    const totalCount = await CorpoDal.GetRecordCount(searchQuery);
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

  GetAllCorpoUsers: async (data) => {
    const records = await CorpoDal.GetAllCorpoUsers();
    return {
      records,
      totalRecords: records.length, // Return total count
      message: "All corporation fetched successfully"
  };
  },

  EditCorpo: async (data, _id) => await CorpoDal.EditCorpo({ _id }, data),

  DeleteCorpo: async (_id) => await CorpoDal.DeleteCorpo({ _id }),

  AddPlan: async (data) => {
    return await PlanDal.CreatePlan(data);
  },
  EditPlan: async (data, _id) => {
    if (data.claim_combination === CONSTANTS.CLAIM_COMBINATION.SEPERATE) {
      data.combined_lab_plus_test_max_discount = null;
      data.combined_lab_plus_test_percent = null
    } else if (data.claim_combination === CONSTANTS.CLAIM_COMBINATION.PHARMACY_LAB_COMBINED) {
      data.lab_max_discount = null;
      data.lab_precent_discount = null
      data.pharmacy_max_discount = null;
      data.pharmacy_precent_discount = null
    }
    return await PlanDal.EditPlan({ _id }, data);
  },
  DeletePlan: async (_id) => {
    const childTestCount = await PlanDal.CheckChildTest({ _id });
    if (childTestCount > 0) throw new Error("Plan has tests registerd under it.");
    const resp = await PlanDal.DeletePlan({ _id });
    return resp;
  },

  AddTest: async (data) => {
    return await TestDal.CreateTest(data);
  },
  GetAllTest: async (data) => {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "name",
      sortOrder = -1,
      subscriberType = CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL,
    } = data;

    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    if (search) {
      searchQuery = {
        name: { $regex: search, $options: "i" },
      };
    } else {
      searchQuery = {};
    }
    sortObject[sortBy] = parseInt(sortOrder);
    searchQuery.subscriber_type = Number(subscriberType);

    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await TestDal.GetAllTest(searchQuery, "", pagination);
    const totalCount = await TestDal.GetRecordCount(searchQuery);
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

  EditTest: async (_id, data) => {
    return await TestDal.EditTest({ _id }, data);
  },

  DeleteTest: async (data) => {
    const { id } = data;
    const resp = await TestDal.DeleteTest({ _id: id });
    return resp;
  },

  GetSettings: async () => await SysSettings.GetSysSettings({}, ""),

  EditSysSettings: async (data) => await SysSettings.EditSysSettings({ _id: data.id }, { ...data }),

  AddManagmentUser: async (data) => {
    const { email, mobile } = data;
    const userWithEmail = await ManagementUserDal.GetUser({ email });
    if (userWithEmail) throw new ApiError(CONSTANTS_MESSAGES.EMAIL_EXISTS, StatusCodes.BAD_REQUEST);
    const userWithMobile = await ManagementUserDal.GetUser({ mobile });
    if (userWithMobile) throw new ApiError(CONSTANTS_MESSAGES.MOBILE_EXISTS, StatusCodes.BAD_REQUEST);
    if (data.user_type === CONSTANTS.MAN_USER_TYPES.ADMIN) {
      data.designation = null;
    }
    return await ManagementUserDal.CreateUser(data)
  },

  GetAllManagmentUser: async (data) => {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "name",
      sortOrder = -1,
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    if (search) {
      searchQuery = {
        name: { $regex: search, $options: "i" }
      };
    } else {
      searchQuery = {};
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await ManagementUserDal.GetAllUsers(searchQuery, "-token -password -createdAt -updatedAt -__v", pagination);
    const totalCount = await ManagementUserDal.GetRecordCount(searchQuery);
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

  EditManagmentUser: async (data, _id) => {
    const { email, mobile } = data;
    const findUser = await ManagementUserDal.GetUser({ _id });
    if (!findUser) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    const userWithEmail = await ManagementUserDal.GetUser({ email, _id: { $ne: _id } });
    if (userWithEmail) throw new ApiError(CONSTANTS_MESSAGES.EMAIL_EXISTS, StatusCodes.BAD_REQUEST);
    const userWithMobile = await ManagementUserDal.GetUser({ mobile, _id: { $ne: _id } });
    if (userWithMobile) throw new ApiError(CONSTANTS_MESSAGES.MOBILE_EXISTS, StatusCodes.BAD_REQUEST);

    return await ManagementUserDal.EditUser({ _id }, data);
  },
  RenewCorporateEmpPlan: async (data) => {

    const plan = await PlanDal.GetPlan({ _id: data.plan, corporate: data.corporate }, 'frequency membership_options name');
    if (!plan) throw new ApiError(CONSTANTS_MESSAGES.PLAN_NOT_FOUND, StatusCodes.BAD_REQUEST);

    const subscribedOption = plan.membership_options.find(p => p.membership_id === data.membership);
    const planValidity = GetExtendedDays(plan.frequency);
    const walletBalance = subscribedOption.wallet_balance;
    
    const updatePromises = data.employees.map(async (emp) => {
        const userData = await UserAuthDal.GetUser({_id:emp},"wallet_balance plan");
        if(!userData) return;
        await WalletTransactionDal.AddWalletTransaction({
          user_id: emp,
          amount: walletBalance,
          type: CONSTANTS.TRANSACTION.TYPE.DEBIT,
          plan_id: userData.plan._id,
      });
        const userPlan = {
            purchased: true,
            id: plan._id,
            membership_id: subscribedOption.membership_id,
            start_date: dayjs().toISOString(),
            end_date: dayjs().add(planValidity, 'day').toISOString(),
            paid_price: 0,
        };

        await UserAuthDal.UpdateUser({ _id: emp }, { plan: userPlan,wallet_balance: walletBalance });

         await FamilyDAL.UpdateMember({ user_id: emp }, {
            plan_status: CONSTANTS.PLAN_STATUS.PAID,
        });
       

        await FamilyDAL.UpdateMember({ relation: { $ne: CONSTANTS.FAMILY_RELATION.SELF }, user_id: emp }, {
            plan_status: CONSTANTS.PLAN_STATUS.UNPAID,
        });
       
        await WalletTransactionDal.AddWalletTransaction({
            user_id: emp,
            amount: walletBalance,
            type: CONSTANTS.TRANSACTION.TYPE.CREDIT,
            plan_id: plan._id,
        });

        await UserNotificationsDAL.AddNotification({
            user: emp,
            message: `Plan ${plan.name} re-activated successfully.`,
        });
    });

    await Promise.all(updatePromises);

   return {}; 
},


  EditManagmentUserPass: async (password, _id) => {
    const findUser = await ManagementUserDal.GetUser({ _id });
    if (!findUser) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    const hashedPassword = await Utils.GenerateHashedPassword(password);
    return await ManagementUserDal.EditUser({ _id }, { password: hashedPassword });
  },

  DeleteManagmentUser: async (_id) => {
    const findUser = await ManagementUserDal.GetUser({ _id });
    if (!findUser) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    const userHasClaims = await ClaimDAL.GetClaim({
      $or: [
        { assigned_to_verifier: _id },
        { assigned_to_manager: _id },
        { assigned_to_financer: _id }
      ]
    })
    if (userHasClaims) throw new ApiError(CONSTANTS_MESSAGES.MANAGEMENT_USER_HAS_ASSIGNED_CLAIMS, StatusCodes.BAD_REQUEST);
    return await ManagementUserDal.DeleteUser({ _id })
  },

  AddCorpoEmp: async (data) => {
    const checkUniqueEmail = await UserAuthDal.GetUser({ email: data.email });
    if (checkUniqueEmail) throw new ApiError(CONSTANTS_MESSAGES.EMAIL_EXISTS, StatusCodes.BAD_REQUEST);
    const checkUniqueMobile = await UserAuthDal.GetUser({ phone: data.phone });
    if (checkUniqueMobile) throw new ApiError(CONSTANTS_MESSAGES.MOBILE_EXISTS, StatusCodes.BAD_REQUEST);
    const plan = await PlanDal.GetPlan({ _id: data.plan }, 'frequency membership_options name');  
    const subscribedOption = plan.membership_options.find(p=> p.membership_id === data.membership); 
    const planValidity = GetExtendedDays(plan.frequency);
    const walletBalance = subscribedOption.wallet_balance;
    data.wallet_balance = walletBalance;
    data.first_plan_purchase = 1;
    const userPlan = {
      purchased: true,
      id: plan._id,
      membership_id: subscribedOption.membership_id,
      health_plan_id: null,
      start_date: dayjs().toISOString(),
      end_date: dayjs().add(planValidity, 'day').toISOString(),
      paid_price: 0,
    }
    const verified = {
      email:true, phone:true
    }
    data.verified = verified;
    data.plan = userPlan;
    
    const userCount = JSON.stringify(100 + await UserAuthDal.GetCount());
    let padded = userCount.padStart(9, "0");
    data.unique_id = `R${padded}`;
    data.subscriber_type = CONSTANTS.SUBSCRIBER_TYPE.CORPORATE;
    const resp = await UserAuthDal.CreateUser(data);
    await FamilyDAL.AddMember({
      name: resp.name, phone: resp.phone, country_code: resp.country_code,plan_status:CONSTANTS.PLAN_STATUS.PAID,
      gender: resp.gender, dob: resp.dob, user_id: resp._id, address: resp.address, relation: CONSTANTS.FAMILY_RELATION.SELF
    });
    await WalletTransactionDal.AddWalletTransaction({
      user_id: resp._id,
      amount: walletBalance,
      type: CONSTANTS.TRANSACTION.TYPE.CREDIT,
      plan_id: plan._id
    })
    UserNotificationsDAL.AddNotification({user: resp._id, message: `Plan ${plan.name} activated successfully.` })
  
    return {};
  },

AddBulkCorpoEmp: async (data) => {
    // const hashedPassword = await Utils.GenerateHashedPassword(CONSTANTS.DEFAULT_PASSWORD);
    const failedInsertions = [];
    const plan = await PlanDal.GetPlan({ _id: data.plan }, 'frequency membership_options name');  
    const subscribedOption = plan.membership_options.find(p=> p.membership_id === data.membership); 
    const planValidity = GetExtendedDays(plan.frequency);
    const walletBalance = subscribedOption.wallet_balance;
    const userPlan = {
      purchased: true,
      id: plan._id,
      membership_id: subscribedOption.membership_id,
      health_plan_id: null,
      start_date: dayjs().toISOString(),
      end_date: dayjs().add(planValidity, 'day').toISOString(),
      paid_price: 0,
    }
  
    let successful_inserts = 0;
    try {
      // Get the initial count once
      const initialCount = await UserAuthDal.GetCount();
      let currentCounter = initialCount;
      
      const createPromises = data.employee_details.map(async (employee, index) => {
        try {
          const checkUniqueEmail = await CorpoEmpDal.CheckUnique({ email: employee.email });

          if (checkUniqueEmail != null) {
            failedInsertions.push({
              ...employee,
              reason: CONSTANTS_MESSAGES.EMAIL_EXISTS
            });

            await CorpoEmpDal.CreateTempFailedCorpoEmp({ corporate: data.corporate, ...employee, reason: CONSTANTS_MESSAGES.EMAIL_EXISTS });
            return null;
          }

          const checkUniqueMobile = await CorpoEmpDal.CheckUnique({ phone: employee.phone });

          if (checkUniqueMobile != null) {
            failedInsertions.push({
              ...employee,
              reason: CONSTANTS_MESSAGES.MOBILE_EXISTS
            });
            await CorpoEmpDal.CreateTempFailedCorpoEmp({ corporate: data.corporate, ...employee, reason: CONSTANTS_MESSAGES.MOBILE_EXISTS })
            return null;
          }

          // Generate unique ID for each user with sequential numbering
          currentCounter++; // Increment counter for each user
          const userCount = currentCounter;
          let padded = userCount.toString().padStart(9, "0");
          let unique_id = `R${padded}`;
          
          console.log(`Generated unique_id for user ${index + 1}:`, unique_id);

          const result = await UserAuthDal.CreateUser({
            verified: {
              email: true, 
              phone: true
            },
            corporate: data.corporate,
            reset_default_password: true,
            wallet_balance: walletBalance,
            first_plan_purchase: 1,
            // password: hashedPassword,
            unique_id,
            subscriber_type: CONSTANTS.SUBSCRIBER_TYPE.CORPORATE,
            plan: userPlan,
            ...employee
          });

          await FamilyDAL.AddMember({
            name: result.name, 
            phone: result.phone, 
            country_code: result.country_code,
            plan_status: CONSTANTS.PLAN_STATUS.PAID,
            gender: result.gender, 
            dob: result.dob, 
            user_id: result._id, 
            address: result.address, 
            relation: CONSTANTS.FAMILY_RELATION.SELF
          });

          await WalletTransactionDal.AddWalletTransaction({
            user_id: result._id,
            amount: walletBalance,
            type: CONSTANTS.TRANSACTION.TYPE.CREDIT,
            plan_id: plan._id
          });

          UserNotificationsDAL.AddNotification({ 
            user: result._id, 
            message: `Plan ${plan.name} activated successfully.` 
          });
        
          successful_inserts++;
          return result;
        } catch (error) {
          failedInsertions.push({
            ...employee,
            reason: error.message || 'Unknown error during user creation'
          });
        }
      });

      await Promise.all(createPromises);

      return {
        successful_inserts,
        failed_inserts: failedInsertions.length,
        failedInsertions
      };
    } catch (error) {
      throw new ApiError(CONSTANTS_MESSAGES.BULK_UPLOAD_FAILED, StatusCodes.BAD_REQUEST);
    }
  },

  GetAllAdminUsers: async (data) => {
    const resp = await AdminAuthDal.GetAllAdmin();
    return {
      records: resp,
    };

    return await CorpoEmpDal.CreateCorpoEmp(data)
  },

  GetAllCorpoEmp: async (data) => {
    const { search, page, pageSize, sortBy, sortOrder, organizationFilter } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
        subscriber_type: CONSTANTS.SUBSCRIBER_TYPE.CORPORATE
      };
    } else {
      searchQuery = { subscriber_type: CONSTANTS.SUBSCRIBER_TYPE.CORPORATE };
    }
    if (organizationFilter && organizationFilter !== "ALL") {
      searchQuery.corporate = organizationFilter; 
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await UserAuthDal.GetAllUsers(searchQuery, "-password -token -verified -__v -createdAt -updatedAt", pagination);
    const totalCount = await UserAuthDal.GetCount(searchQuery);
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

  GetCorpoEmp: async (data) => {
    const records = await UserAuthDal.GetUsers("-password -token -verified -__v -createdAt -updatedAt");

    return {
        records,
        totalRecords: records.length, // Return total count
        message: "All registered users fetched successfully"
    };
  },

  EditCorpoEmp: async (data, _id) => {
    const findOneEmp = await UserAuthDal.GetUser({ _id });
    if (!findOneEmp) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    const checkUniqueEmail = await UserAuthDal.GetUser({ email: data.email, _id: { $ne: _id } });
    if (checkUniqueEmail) throw new ApiError(CONSTANTS_MESSAGES.EMAIL_EXISTS, StatusCodes.BAD_REQUEST);
    const checkUniqueMobile = await UserAuthDal.GetUser({ phone: data.phone, _id: { $ne: _id } });
    if (checkUniqueMobile) throw new ApiError(CONSTANTS_MESSAGES.MOBILE_EXISTS, StatusCodes.BAD_REQUEST);
    return await UserAuthDal.UpdateUser({ _id }, data)
  },

  EditCorpoEmpPass: async (password, _id) => {
    const findOneEmp = await UserAuthDal.GetUser({ _id });
    if (!findOneEmp) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    const hashedPassword = await Utils.GenerateHashedPassword(password);
    return await UserAuthDal.UpdateUser({ _id }, {
      password: hashedPassword,
      // reset_default_password:true
    });
  },


  DeleteCorpoEmp: async (data) => {
    const findOneEmp = await UserAuthDal.GetUser({ _id: data.id });
    if (!findOneEmp) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    const findClaim = await ClaimDAL.GetClaim({ user_id: data.id })
    if (findClaim != null) throw new ApiError(CONSTANTS_MESSAGES.CANNOT_DELETE_USER_CLAIM_RAISED, StatusCodes.BAD_REQUEST);
    return await UserAuthDal.DeleteUser({ _id: data.id })
  },
  DeleteAllFailedInsertsCorpoEmp: async (corporate) => {
    return await CorpoEmpDal.DeleteFailedInsertsCorpoEmp({ corporate })
  },
  GetAllFailedInsertsCorpoEmp: async (corporate) => {
    return await CorpoEmpDal.GetAllFailedInsertsCorpoEmp({ corporate })
  },

  // AddCoupon: async (data) => {
  //   if (data.coupon_type === CONSTANTS.COUPON_TYPE.INDIVIDUAL) {
  //     data.corporate = null;
  //   }
  //   if (data.usage_type === CONSTANTS.COUPON_USAGE_TYPE.SINGLE) {
  //     data.usage = 1;
  //   }
  //   const uniqueCode = await CouponDal.GetCoupon({ coupon_code: data.coupon_code.toLowerCase() });
  //   if (uniqueCode) throw new ApiError(CONSTANTS_MESSAGES.COUPON_CODE_EXISTS, StatusCodes.BAD_REQUEST);
  //   return await CouponDal.CreateCoupon(data)
  // },

  AddCoupon: async (data) => {
    if (data.coupon_type === CONSTANTS.COUPON_TYPE.INDIVIDUAL) {
        data.corporate = null;
    }
    if (data.usage_type === CONSTANTS.COUPON_USAGE_TYPE.SINGLE) {
        data.usage = 1;
    }

    const count = data.count || 1; // Default to 1 if count is not provided
    const baseCouponCode = data.coupon_code.toLowerCase();
    const codePrefix = baseCouponCode.slice(0, -5);
    let codeNumber = parseInt(baseCouponCode.slice(-5));

    let couponsToInsert = [];

    for (let i = 0; i < count; i++) {
        let newCouponCode = codePrefix + (codeNumber + i).toString().padStart(5, '0');

        // Check if the coupon code is unique
        const existingCoupon = await CouponDal.GetCoupon({ coupon_code: newCouponCode });
        if (existingCoupon) {
            throw new ApiError(CONSTANTS_MESSAGES.COUPON_CODE_EXISTS, StatusCodes.BAD_REQUEST);
        }

        let couponData = { ...data, coupon_code: newCouponCode };
        couponsToInsert.push(couponData);
    }

    return await CouponDal.CreateMultipleCoupons(couponsToInsert);
},

  GetAllCoupons: async (data) => {
    const { search = "", page = 1, pageSize = 10, sortBy = "start_date", sortOrder = "-1", CouponType, UsageType } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    if (search) {
      searchQuery = {
        $or: [
        {coupon_code: { $regex: search, $options: "i" }},
        {name: { $regex: search, $options: "i" }},
        ]
      };
    } else {
      searchQuery = {};
    }
    sortObject[sortBy] = Number(sortOrder);
    searchQuery.coupon_type = Number(CouponType);
    searchQuery.usage_type = Number(UsageType);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await CouponDal.GetAllCoupons(searchQuery, "", pagination);
    const totalCount = await CouponDal.GetRecordCount(searchQuery);
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

  GetAllCouponsList: async () => {
    const records = await CouponDal.GetAllCouponsList();
    return {
      records,
      totalRecords: records.length, // Return total count
      message: "All registered users fetched successfully"
  };
  },

  EditCoupon: async (data) => {
    const validCoupon = CouponDal.GetCoupon({ _id: data.id });
    if (validCoupon == null) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    if (data.coupon_type === CONSTANTS.COUPON_TYPE.INDIVIDUAL) {
      data.corporate = null;
    }
    if (data.usage_type === CONSTANTS.COUPON_USAGE_TYPE.SINGLE) {
      data.usage = 1;
    }
    return await CouponDal.EditCoupon({ _id: data.id }, data)
  },

  DeleteCoupon: async (data) => await CouponDal.DeleteCoupon({ _id: data.id }),

  AddDoctor: async (data) => {
    const checkPromises = [
      DoctorDal.CheckUniqueRegNo({ reg_no: data.reg_no }).then(res => res ? 'DOC_REGNO_EXISTS' : null),
      DoctorDal.CheckUniqueRegNo({ email: data.email }).then(res => res ? 'EMAIL_EXISTS' : null),
      DoctorDal.CheckUniqueRegNo({ mobile: data.mobile }).then(res => res ? 'MOBILE_EXISTS' : null)
    ];
    const results = await Promise.all(checkPromises);
    const error = results.find(result => result !== null);
    if (error) throw new ApiError(CONSTANTS_MESSAGES[error], StatusCodes.BAD_REQUEST);
    data.added_by = CONSTANTS.DOCTOR.ADDED_BY_ADMIN;
    data.approved_by_admin = CONSTANTS.DOCTOR.APPROVED_BY_ADMIN;
    return await DoctorDal.CreateDoc(data)
  },

  GetAllDocFromClaims: async (data) => {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "name",
      sortOrder = -1,
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { hospital: { $regex: search, $options: "i" } },
          { specialization: { $regex: search, $options: "i" } },
          { reg_no: { $regex: search, $options: "i" } }
        ]
      };
    } else {
      searchQuery = {};
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await DoctorDal.GetAllDocFromClaims(searchQuery, "", pagination);
    const totalCount = await DoctorDal.GetRecordCountFromClaims(searchQuery);
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

  GetAllDoctor: async (data) => {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "name",
      sortOrder = -1,
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { hospital: { $regex: search, $options: "i" } },
          { specialization: { $regex: search, $options: "i" } },
          { reg_no: { $regex: search, $options: "i" } }
        ]
      };
    } else {
      searchQuery = {};
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await DoctorDal.GetAllDoc(searchQuery, "", pagination);
    const totalCount = await DoctorDal.GetRecordCount(searchQuery);
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

  GetAllDoctorList: async (data) => {
    const records = await DoctorDal.GetAllDoctorList();
    return {
      records,
      totalRecords: records.length, // Return total count
      message: "All registered users fetched successfully"
  };
  },

  GetAllDocFromClaimsList: async (data) => {
    const records = await DoctorDal.GetAllDocFromClaimsList();
    return {
      records,
      totalRecords: records.length, // Return total count
      message: "All doctors fetched successfully"
  };
  },

  GetDoctorFromClaimsDetails: async (id) => {

    const resp = await DoctorDal.GetDoctorDetails({ id });
    return {
      records: resp,
    };
  },

  EditDoctor: async (data, _id) => {
    const findOneDoc = await DoctorDal.FindOneDoc({ _id });
    if (!findOneDoc) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    const findUniqFields = await DoctorDal.CheckUniqueRegNo({
      $or: [
        { reg_no: data.reg_no, _id: { $ne: _id } },
        { email: data.email, _id: { $ne: _id } },
        { mobile: data.mobile, _id: { $ne: _id } }
      ]
    });
    if (findUniqFields) throw new ApiError(CONSTANTS_MESSAGES.DOC_REGNO_EXISTS, StatusCodes.BAD_REQUEST);

    return await DoctorDal.EditDoc({ _id }, data)
  },

  DeleteDoctor: async (data) => {
    const findUniqDoc = await DoctorDal.FindOneDoc({ _id: data.id });
    if (!findUniqDoc) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    return await DoctorDal.DeleteDoc({ _id: data.id })
  },

  GetAdminPrograms: async () => CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN,

  GetGeneralPrograms: async () => CONSTANTS.PRIVILEGE.PROGRAMME.GENERAL,

  AddPrivilege: async (data) => {
    return await PrivilegeDal.CreatePrivilege(data);
  },

  GetAllPrivilege: async (data) => {
    const resp = await PrivilegeDal.GetAllPrivilege({ user_id: data.user_id });
    return {
      records: resp,
    };
  },

  GetIndividualPrivilege: async (data) => await PrivilegeDal.GetIndividualPrivilege({ program_id: data.program_id, user_id: data.user_id }),

  EditPrivilege: async (data, user_id, module_id) => {
    const bulkOps = data.map(update => {
      const filter = { user_id, module_id, program_id: update.program_id };
      const updateData = {
        $set: {
          POST: update.POST,
          PATCH: update.PATCH,
          DELETE: update.DELETE,
          GET: update.GET
        }
      };
      return {
        updateOne: {
          filter: filter,
          update: updateData
        }
      };
    });

    try {
      return await PrivilegeDal.EditBulkPrivilege(bulkOps);
    } catch (error) {
      throw new ApiError(CONSTANTS_MESSAGES.PERMISSION_UPDATE_FAILED, StatusCodes.BAD_REQUEST);
    }
  },

  GetAllAdminUsers: async (data) => {
    const resp = await AdminAuthDal.GetAllAdmin({},"-token -password");
    return {
      records: resp,
    };
  },

  GetAllAdminAuditTrail: async (data) => {
    const { search, page = 1, pageSize = 10, sortBy = "updatedAt", sortOrder = 1, method = "ALL",
      startDate = dayjs().subtract(30, "day").startOf("day").toISOString(),
      endDate = dayjs().endOf("day").toISOString(),
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};

    if (search) {
      searchQuery = {
        $or: [
          { program_name: { $regex: search, $options: 'i' } },
          { 'user_id.name': { $regex: search, $options: 'i' } }
        ]
      };
    }
    if (method && method !== "ALL") {
      searchQuery.method = method;
    }
    if (startDate && endDate) {
      searchQuery.updatedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await AuditTrailDal.GetAllAdminAuditTrail(searchQuery, "", pagination);
    const totalCount = await AuditTrailDal.GetAdminRecordCount(searchQuery);
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

  GetAllGeneralUsersAuditTrail: async (data) => {
    const { search, page = 1, pageSize = 10, sortBy = "updatedAt", sortOrder = 1, method = "ALL", startDate, endDate } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};

    if (search) {
      searchQuery = {
        $or: [
          { program_name: { $regex: search, $options: 'i' } },
          { 'user_id.name': { $regex: search, $options: 'i' } }
        ]
      };
    }
    if (method && method !== "ALL") {
      searchQuery.method = method;
    }

    if (startDate && endDate) {
      searchQuery.updatedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await AuditTrailDal.GetAllGeneralUsersAuditTrail(searchQuery, "", pagination);
    const totalCount = await AuditTrailDal.GetGeneralUsersRecordCount(searchQuery);
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

  AddHealthCheckupPlan: async (data) => {
    const uniqueCheckupCode = await HealthCheckupPlanDal.CheckUnique({ checkup_code: data.checkup_code });
    if (uniqueCheckupCode) throw new ApiError(CONSTANTS_MESSAGES.CHECKUP_CODE_EXISTS, StatusCodes.BAD_REQUEST);
    return HealthCheckupPlanDal.CreateHealthCheckupPlan(data);
  },
  EditHealthCheckupPlan: async (_id, data) => {
    const findPlan = await HealthCheckupPlanDal.CheckUnique({ _id });
    if (!findPlan) throw new ApiError(CONSTANTS_MESSAGES.CHECKUP_PLAN_NOT_EXISTS, StatusCodes.BAD_REQUEST);
    const uniqueCheckupCode = await HealthCheckupPlanDal.CheckUnique({ checkup_code: data.checkup_code, _id: { $ne: _id } });
    if (uniqueCheckupCode) throw new ApiError(CONSTANTS_MESSAGES.CHECKUP_CODE_EXISTS, StatusCodes.BAD_REQUEST);
    return HealthCheckupPlanDal.EditHealthCheckupPlan({ _id }, data);
  },
  DeleteHealthCheckupPlan: async (_id) => {
    const findPlan = await HealthCheckupPlanDal.CheckUnique({ _id });
    if (!findPlan) throw new ApiError(CONSTANTS_MESSAGES.CHECKUP_PLAN_NOT_EXISTS, StatusCodes.BAD_REQUEST);
    return HealthCheckupPlanDal.DeleteHealthCheckupPlan({ _id });
  },

  AddSpecialization: async (data) => {
    const uniqueCheckupCode = await SpecializationDal.CheckUnique({ name: data.name });
    if (uniqueCheckupCode) throw new ApiError(CONSTANTS_MESSAGES.NAME_EXISTS, StatusCodes.BAD_REQUEST);
    return SpecializationDal.CreateSpecialization(data);
  },
  EditSpecialization: async (_id, data) => {
    const findSpecialization = await SpecializationDal.CheckUnique({ _id });
    if (!findSpecialization) throw new ApiError(CONSTANTS_MESSAGES.SPECIALIZATION_NOT_FOUND, StatusCodes.BAD_REQUEST);
    const uniqueSpecialization = await SpecializationDal.CheckUnique({ name: data.name, _id: { $ne: _id } });
    if (uniqueSpecialization) throw new ApiError(CONSTANTS_MESSAGES.NAME_EXISTS, StatusCodes.BAD_REQUEST);
    return SpecializationDal.EditSpecialization({ _id }, data);
  },
  DeleteSpecialization: async (_id) => {
    const findSpecialization = await SpecializationDal.CheckUnique({ _id });
    if (!findSpecialization) throw new ApiError(CONSTANTS_MESSAGES.SPECIALIZATION_NOT_FOUND, StatusCodes.BAD_REQUEST);
    return SpecializationDal.DeleteSpecialization({ _id });
  },

  GetEmail: async () => await EmailDal.GetOneEmail(),

  EditEmail: async (data, _id) => {
    return await EmailDal.EditEmail({ _id }, data);
  },

  GetAllReferedUsers: async (data) => {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "name",
      sortOrder = -1,
      startDate = dayjs().subtract(30, "day").startOf("day").toISOString(),
      endDate = dayjs().endOf("day").toISOString(),
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { refer_name: { $regex: search, $options: "i" } },
          { refer_email: { $regex: search, $options: "i" } },
        ]
      }
    }
    if (startDate && endDate) {
      searchQuery.createdAt = {
        $gt: startDate,
        $lt: endDate
      }
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery };
    const resp = await ReferedUsersDAL.GetReferUsers(searchQuery, "-__v", pagination);
    const totalCount = await ReferedUsersDAL.GetRecorsCount(searchQuery);
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

  EditReferedUsers: async (_id, data) => {
    const isValidUser = await ReferedUsersDAL.GetReferedUser({ _id });
    if (isValidUser == null) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    return ReferedUsersDAL.EditReferUsers({ _id }, data);
  },

  DeleteReferedUsers: async (_id) => {
    const isValidUser = await ReferedUsersDAL.GetReferedUser({ _id });
    if (isValidUser == null) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    return ReferedUsersDAL.DeleteReferUser({ _id });
  },

  GetAllUpdateMembers: async (data) => {
    const { search, page, pageSize, sortBy = "createdAt", sortOrder = "-1",
      startDate = dayjs().subtract(30, "day").startOf("day").toISOString(),
      endDate = dayjs().endOf("day").toISOString(),
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    if (search) {
      searchQuery = {
        $or: [{ name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } }],
      };
    } else {
      searchQuery = {};
    }
    if (startDate && endDate) {
      searchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await UpdateMemberDAL.GetMembersRequest(searchQuery, "", pagination);
    const newResp = await Promise.all(resp.map(async (r) => {
      if (r.file) {
        r.file = await Utils.getFileURL(r.file);
      }
      return r;
    }));
    const totalCount = await UpdateMemberDAL.GetMembersCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      records: newResp,
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

  UpdateMemberAction: async (_id, data) => {
    const validMember = await UpdateMemberDAL.GetMemberRequest({ _id });
    if (!validMember) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    const validFamilyMember = await FamilyDAL.GetMember({ _id: validMember.member_id })
    if (!validFamilyMember) throw new ApiError(CONSTANTS_MESSAGES.FAMILY_MEMBER_NOT_FOUND, StatusCodes.BAD_REQUEST);
    if (validFamilyMember.review_status !== CONSTANTS.REVIEW_STATUS.PENDING) throw new ApiError(CONSTANTS_MESSAGES.ACTION_ALREADY_TAKEN, StatusCodes.BAD_REQUEST);
    if (data.review_status == CONSTANTS.REVIEW_STATUS.ACCEPTED) {
      if (validFamilyMember.relation === CONSTANTS.FAMILY_RELATION.SELF) {
        await UserAuthDal.UpdateUser({ _id: validFamilyMember.user_id }, {
          gender: validMember.gender,
          dob: validMember.dob,
          address: validMember.address,
        })
      }
      await FamilyDAL.UpdateMember({ _id: validMember.member_id }, {
        name: validMember.name,
        phone: validMember.phone,
        country_code: validMember.country_code,
        gender: validMember.gender,
        dob: validMember.dob,
        relation: validMember.relation,
        review_status: data.review_status,
        address: validMember.address,
      });
      UserNotificationsDAL.AddNotification({
        user: validFamilyMember.user_id,
        message: NOTIFICATIONS.FAMILY_UPDATE_APPROVED + validMember.name + "."
      })
    } else if (data.review_status == CONSTANTS.REVIEW_STATUS.REJECTED) {
      await FamilyDAL.UpdateMember({ _id: validMember.member_id }, { review_status: data.review_status });
      UserNotificationsDAL.AddNotification({
        user: validFamilyMember.user_id,
        message: NOTIFICATIONS.FAMILY_UPDATE_REJECTED + validMember.name + "."
      })
    }
    const resp = await UpdateMemberDAL.UpdateMemberRequest({ _id }, { review_status: data.review_status });
    const user = await UserAuthDal.GetUser({ _id: validFamilyMember.user_id }, "name email");
    if (user && user.email) {
      const emailTemplate = await EmailDal.GetOneEmail({});
      await Utils.sendBrevoMail.ProfileUpdateAdmin({
        template: emailTemplate?.profile_update_action,
        subject: `Family Member Update Request Status`,
        user: { name: user?.name, email: user?.email },
        params: {
          name: user?.name, member_name: validFamilyMember.name,
          status: data.review_status == CONSTANTS.REVIEW_STATUS.REJECTED ? "Rejected" : "Accepted"
        }
      });
    }
    return resp;
  },

  AddFamilyMember: async (data) => {
    const validSubscriber = await UserAuthDal.GetUser({ _id: data.user_id });
    if (!validSubscriber) throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.BAD_REQUEST);
    if (data.relation === CONSTANTS.FAMILY_RELATION.SELF) throw new ApiError(CONSTANTS_MESSAGES.CANNOT_ADD_MAIN_MEMBER, StatusCodes.BAD_REQUEST);

    const resp = await FamilyDAL.AddMember({
      name: data.name,
      relation: data.relation,
      dob: data.dob,
      gender: data.gender,
      phone: data.phone,
      country_code: data.country_code,
      address: data.address,
      user_id: data.user_id,
    });
    UserNotificationsDAL.AddNotification({
      user: data.user_id,
      message: data.name + NOTIFICATIONS.FAMILY_ADDED_ADMIN
    });
    if (validSubscriber && validSubscriber?.email) {
      const emailTemplate = await EmailDal.GetOneEmail({});
      Utils.sendBrevoMail.MemberUpdateAdmin({
        template: emailTemplate?.member_personal_details_action,
        subject: `Family Member Details Updated by Admin`,
        user: { name: validSubscriber?.name, email: validSubscriber?.email },
        params: {
          name: validSubscriber?.name, member_name: data.name,
          action: "added"
        }
      });
    }
    if (validSubscriber?.phone) {
      Utils.SendSMS.AdminAddMember({
        name: validSubscriber.name, phone: validSubscriber.phone, member_name: data.name
      });
    }
    return resp;
  },

  EditFamilyMemberPersonalDetails: async (_id, data) => {
    const validFamilyMember = await FamilyDAL.GetMember({ _id });
    if (!validFamilyMember) throw new ApiError(CONSTANTS_MESSAGES.FAMILY_MEMBER_NOT_FOUND, StatusCodes.BAD_REQUEST);
    if (validFamilyMember.relation === CONSTANTS.FAMILY_RELATION.SELF) throw new ApiError(CONSTANTS_MESSAGES.CANNOT_EDIT_MAIN_MEMBER, StatusCodes.BAD_REQUEST);

    const resp = await FamilyDAL.UpdateMember({ _id }, {
      name: data.name,
      phone: data.phone,
      country_code: data.country_code,
      gender: data.gender,
      dob: data.dob,
      relation: data.relation,
      address: data.address,
    });
    UserNotificationsDAL.AddNotification({
      user: validFamilyMember.user_id,
      message: NOTIFICATIONS.FAMILY_EDITED_ADMIN + validFamilyMember.name
    });
    const user = await UserAuthDal.GetUser({ _id: validFamilyMember.user_id }, "name email phone");
    if (user && user.email) {
      const emailTemplate = await EmailDal.GetOneEmail({});
      Utils.sendBrevoMail.MemberUpdateAdmin({
        template: emailTemplate?.member_personal_details_action,
        subject: `Family Member Update Request Status`,
        user: { name: user?.name, email: user?.email },
        params: {
          name: user?.name, member_name: validFamilyMember.name,
          action: "edited"
        }
      });
    }
    if (user.phone) {
      Utils.SendSMS.MemberUpdateAdmin({
        name: user.name, phone: user.phone
      });
    }
    return resp;
  },

  EditFamilyMemberDetails: async (_id, data) => {

    const validFamilyMember = await FamilyDAL.GetMember({ _id });
    if (!validFamilyMember) throw new ApiError(CONSTANTS_MESSAGES.FAMILY_MEMBER_NOT_FOUND, StatusCodes.BAD_REQUEST);
    if (validFamilyMember.relation === CONSTANTS.FAMILY_RELATION.SELF) throw new ApiError(CONSTANTS_MESSAGES.CANNOT_EDIT_MAIN_MEMBER, StatusCodes.BAD_REQUEST);
    const userDetails = await UserAuthDal.GetUser({ _id: validFamilyMember.user_id }, "plan");
    if (userDetails.plan.purchased === false) throw new ApiError(CONSTANTS_MESSAGES.PLAN_EXPIRED, StatusCodes.BAD_REQUEST);
    plan = await PlanDal.GetPlan({ _id: userDetails.plan.id });
    if (!plan) {
      throw new ApiError(CONSTANTS_MESSAGES.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND)
    }
    membership_option = plan.membership_options.find((m) => m.membership_id === userDetails.plan.membership_id);
    const maxPaidMember = membership_option.member_count;
    const memberList = await FamilyDAL.GetMembers({ user_id: userDetails._id }, "plan_status _id");
    let paidMemberCount = 0;
    memberList.forEach(m => {
      if (m.plan_status) {
        paidMemberCount++;
      }
    });
    if (paidMemberCount === maxPaidMember && data.plan_status === CONSTANTS.PLAN_STATUS.PAID) throw new ApiError(CONSTANTS_MESSAGES.PAID_MEMBER_LIST_FULL, StatusCodes.BAD_REQUEST);
    const resp = await FamilyDAL.UpdateMember({ _id: validFamilyMember._id }, { plan_status: data.plan_status });
    UserNotificationsDAL.AddNotification({
      user: validFamilyMember.user_id,
      message: validFamilyMember.name +
        (data.plan_status === CONSTANTS.PLAN_STATUS.PAID
          ? NOTIFICATIONS.FAMILY_EDITED_PAID
          : NOTIFICATIONS.FAMILY_EDITED_UNPAID
        )
    });
    const user = await UserAuthDal.GetUser({ _id: validFamilyMember.user_id }, "name email phone");
    if (user && user.email) {
      const emailTemplate = await EmailDal.GetOneEmail({});
      Utils.sendBrevoMail.MemberPlanUpdateAdmin({
        template: emailTemplate?.member_status_action,
        subject: `Member Plan Status Updated by Admin`,
        user: { name: user?.name, email: user?.email },
        params: {
          name: user?.name, member_name: validFamilyMember.name,
          plan_status: data.plan_status === CONSTANTS.PLAN_STATUS.PAID ? "paid" : "unpaid"
        }
      });
    }
    if (user.phone) {
      Utils.SendSMS.MemberUpdateAdmin({
        name: user.name, phone: user.phone, member_name: validFamilyMember.name,
        plan_status: data.plan_status === CONSTANTS.PLAN_STATUS.PAID ? "paid" : "unpaid"
      });
    }
    return resp;
  },

  DeleteUpdateMember: async (_id) => {
    const validUpdate = await UpdateMemberDAL.GetMemberRequest({ _id })
    if (!validUpdate) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    const validFamilyMember = await FamilyDAL.GetMember({ _id: validUpdate.member_id })
    if (!validFamilyMember) throw new ApiError(CONSTANTS_MESSAGES.FAMILY_MEMBER_NOT_FOUND, StatusCodes.BAD_REQUEST);
    if (!validFamilyMember.review_status) throw new ApiError(CONSTANTS_MESSAGES.FAMILY_MEMBER_UPDATE_PENDING, StatusCodes.BAD_REQUEST);
    const resp = await UpdateMemberDAL.DeleteMemberRequest({ _id });
    return resp;
  },

  GetFamilyMemberList: async (user_id) => {

    const resp = await FamilyDAL.GetMembers({ user_id });
    const userProfile = await UserAuthDal.GetUser({ _id: user_id }, "-token -password");
    plan = await PlanDal.GetPlan({ _id: userProfile.plan.id }, "-plan_benefits");
    membership_option = plan.membership_options.find((m) => m.membership_id === userProfile.plan.membership_id);
    plan.selected_membership_option = membership_option;
    const finalData = await Promise.all(resp.map(async (m) => {
      const updatedData = await UpdateMemberDAL.GetMemberRequest({ member_id: m._id });
      if (updatedData != null) {
        updatedData.file = await Utils.getFileURL(updatedData.file);
      }
      return {
        ...m,
        update_request: updatedData || null
      };
    }));
    return {
      records: finalData,
      userPlan: plan,
      userProfile
    };
  },

  GetClaims: async (data) => {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      // sortBy = "internal_status",
      sortBy = "createdAt",
      sortOrder = -1,
      startDate = dayjs().subtract(1730, "day").startOf("day").toISOString(),
      endDate = dayjs().endOf("day").toISOString(),
      claimInternalStatus = "ALL"
    } = data;

    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};

    sortObject[sortBy] = parseInt(sortOrder);

    if (search) {
      searchQuery = {
        $or: [
          { doc_name: { $regex: search, $options: "i" } },
          { claim_id: { $regex: search, $options: "i" } },
          { hospital: { $regex: search, $options: "i" } }
        ]
      };
    }

    if (startDate && endDate) {
      searchQuery.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    if (claimInternalStatus && claimInternalStatus !== "ALL") {
      searchQuery.internal_status = Number(claimInternalStatus);
    }

    const pagination = { offset, sortObject, pageSize };

    const [records, totalCount] = await Promise.all([
      ClaimDAL.GetClaims(searchQuery, "", pagination),
      ClaimDAL.GetClaimCount(searchQuery)
    ]);
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      records,
      pagination: {
        totalRecords: totalCount,
        pageSize: Number(pageSize),
        totalPages,
        currentPage: Number(page),
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null
      }
    };
  },

  GetClaim: async (id) => {
    const data = await ClaimDAL.GetClaim({ _id: id });
    if (!data) {
      throw new ApiError(CONSTANTS_MESSAGES.CLAIM_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const familyDetails = await FamilyDAL.GetMember({ _id: data.member_id });
    const { name, _id: member_id, phone, country_code } = familyDetails;

    const tempData = { ...data };
    tempData.member_details = { name, member_id, phone, country_code };
    const receiptTypes = ['fee_receipt', 'prescription', 'pharmacy_receipt', 'test_receipt'];
    await Promise.all(receiptTypes.map(async (type) => {
      if (Array.isArray(tempData[type])) {
        tempData[type] = await Promise.all(tempData[type].map(async (receipt) => {
          return await Utils.getFileURL(receipt);
        }));
      }
    }));

    return tempData;
  },

  CreateCorporateHr: async (data) => {
    const findUniqCorpo = await CorporateHrDAL.Find({ corporate: data.corporate });
    if (findUniqCorpo) throw new ApiError(CONSTANTS_MESSAGES.HR_FOR_COMPANT_EXISTS, StatusCodes.BAD_REQUEST);
    const findUniqPhone = await CorporateHrDAL.Find({ phone: data.phone });
    if (findUniqPhone) throw new ApiError(CONSTANTS_MESSAGES.MOBILE_EXISTS, StatusCodes.BAD_REQUEST);
    const findUniqEmail = await CorporateHrDAL.Find({ email: data.email });
    if (findUniqEmail) throw new ApiError(CONSTANTS_MESSAGES.EMAIL_EXISTS, StatusCodes.BAD_REQUEST);
    return await CorporateHrDAL.CreateCorporateHr(data);
  },

  GetAllCorporateHr: async (data) => {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "name",
      sortOrder = -1,
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ]
      };
    } else {
      searchQuery = {};
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await CorporateHrDAL.GetAllCorporateHr(searchQuery, "-token -createdAt -updatedAt -__v -password", pagination);
    const totalCount = await CorporateHrDAL.GetRecordCount(searchQuery);
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

  EditCorporateHr: async (data, _id) => {
    const findHr = await CorporateHrDAL.Find({ _id });
    if (!findHr) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    const findUniqPhone = await CorporateHrDAL.Find({ phone: data.phone, _id: { $ne: _id } });
    if (findUniqPhone) throw new ApiError(CONSTANTS_MESSAGES.MOBILE_EXISTS, StatusCodes.BAD_REQUEST);
    const findUniqEmail = await CorporateHrDAL.Find({ email: data.email, _id: { $ne: _id } });
    if (findUniqEmail) throw new ApiError(CONSTANTS_MESSAGES.EMAIL_EXISTS, StatusCodes.BAD_REQUEST);
    return await CorporateHrDAL.EditCorporateHr({ _id }, data);
  },

  EditCorporateHrPassword: async (data, _id) => {
    const findHr = await CorporateHrDAL.Find({ _id });
    if (!findHr) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    const hashedPassword = await Utils.GenerateHashedPassword(data.password);
    return await CorporateHrDAL.EditCorporateHr({ _id }, { password: hashedPassword });
  },

  DeleteCorporateHr: async (_id) => {
    const findHr = await CorporateHrDAL.Find({ _id });
    if (!findHr) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    return await CorporateHrDAL.DeleteCorporateHr({ _id })
  },

  GetAllCouponsUsages: async (data) => {
    const {
      search,
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = -1
    } = data;
  
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};
  
    // Optional: Add search logic if needed
    if (search) {
      const regex = new RegExp(search, "i");
      searchQuery = {
        $or: [
          { "user.name": regex },
          { "user.email": regex },
          { "coupon.coupon_code": regex },
        ]
      };
    }
  
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize };
  
    const resp = await CouponUsagesDal.GetAllCouponsUsages(searchQuery, "", pagination);
    const totalCount = await CouponUsagesDal.GetRecordCount(searchQuery);
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
  

  GetDiscountAggregation: async () => {

    const pipeline = [
      {
        $group: {
          _id: null,
          total_sum: { $sum: "$amount" },
          total_discount: { $sum: "$discount" }
        }
      },
      {
        $project: {
          _id: 0,
          total_sum: 1,
          total_discount: 1
        }
      }
    ];
    return await CouponUsagesDal.Aggregate(pipeline);
  },

  AddCouponUsage: async (data) => {
    await CouponUsagesDal.CreateCouponUsage(data);
    return {};
  },

  GetAllRegisteredUsers: async (data) => {
    const { search, page, pageSize, sortBy = "createdAt", sortOrder = -1,
      startDate = dayjs().subtract(30, "day").startOf("day").toISOString(),
      endDate = dayjs().endOf("day").toISOString(),
      subscriberTypeStatus = "ALL",
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};
    if (search) {
      searchQuery = {
        name: { $regex: search, $options: "i" },     
              
      };
    } else {
      searchQuery = {};
    }
    if (startDate && endDate) {
      searchQuery.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }
    if (subscriberTypeStatus && subscriberTypeStatus !== "ALL") {
      searchQuery.subscriber_type = Number(subscriberTypeStatus);
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await UserAuthDal.GetAllUsers(searchQuery, "-token", pagination);
    const totalCount = await UserAuthDal.GetCount(searchQuery);
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

  DeleteRegisteredUser: async (_id) => {
    await UserAuthDal.DeleteUser({ _id });
    await FamilyDAL.DeleteManyMembers({ user_id: _id });

  },


  GetUsers: async () => {
    // Fetch all records without filtering, sorting, or pagination
    const records = await UserAuthDal.GetUsers({}, "-token");

    return {
        records,
        totalRecords: records.length, // Return total count
        message: "All registered users fetched successfully"
    };
},

  GetPurchasedHealthCheckupPlans: async (data) => {
    const { search, page, pageSize, sortBy = "createdAt", sortOrder = -1,
      startDate = dayjs().subtract(30, "day").startOf("day").toISOString(),
      endDate = dayjs().endOf("day").toISOString(),
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};
    if (search) {
      searchQuery = {
        patient_name: { $regex: search, $options: "i" },     
              
      };
    } else {
      searchQuery = {};
    }
    if (startDate && endDate) {
      searchQuery.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await PurchasedHealthCheckupDal.GetPurchasedHealthChecksAdmin(searchQuery, "", pagination);
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

  EditPurchasedHealthCheckupPlans: async ( _id,data) => {
    const plan = await PurchasedHealthCheckupDal.GetPurchasedHealthCheck({ _id });
    if (!plan) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    return await PurchasedHealthCheckupDal.EditPurchasedHealthCheck({ _id }, { completed: data.completed });
  },

  GetAllReferedRetail: async (data) => {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = -1,
      startDate = dayjs().subtract(30, "day").startOf("day").toISOString(),
      endDate = dayjs().endOf("day").toISOString(),
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};

    if (startDate && endDate) {
      searchQuery.createdAt = {
        $gt: startDate,
        $lt: endDate
      }
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery };
    const resp = await ContactUsRetailDAL.GetReferUsers(searchQuery, "-__v", pagination);
    const totalCount = await ContactUsRetailDAL.GetRecordsCount(searchQuery);
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

  GetAllReferedRetailList: async () => {
    const records = await ContactUsRetailDAL.GetAllReferedRetailList( "-__v");
    return {
      records,
      totalRecords: records.length, // Return total count
      message: "All retails users fetched successfully"
  };
  },

  GetAllReferedCorporates: async (data) => {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = -1,
      startDate = dayjs().subtract(30, "day").startOf("day").toISOString(),
      endDate = dayjs().endOf("day").toISOString(),
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};

    if (startDate && endDate) {
      searchQuery.createdAt = {
        $gt: startDate,
        $lt: endDate
      }
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery };
    const resp = await ContactUsCorporateDAL.GetReferUsers(searchQuery, "-__v", pagination);
    const totalCount = await ContactUsCorporateDAL.GetRecordsCount(searchQuery);
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
  
  GetAllReferedCorporatesList: async (data) => {
    const records = await ContactUsCorporateDAL.GetAllReferedCorporatesList( "-__v",);
    return {
      records,
      totalRecords: records.length, // Return total count
      message: "All retails users fetched successfully"
  };
  },

  GetAllReferedEmails: async (data) => {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = -1,
      startDate = dayjs().subtract(30, "day").startOf("day").toISOString(),
      endDate = dayjs().endOf("day").toISOString(),
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};

    if (startDate && endDate) {
      searchQuery.createdAt = {
        $gt: startDate,
        $lt: endDate
      }
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery };
    const resp = await ContactUsEmailDAL.GetReferUsers(searchQuery, "-__v", pagination);
    const totalCount = await ContactUsEmailDAL.GetRecordsCount(searchQuery);
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

  GetNotifications: async (data) => {
    const { page = 1, pageSize = 1000, sortBy = "createdAt", sortOrder = "-1" } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await AdminNotificationsDAL.GetAllNotifications(searchQuery, "", pagination);
    return {
      records: resp,
    };
  },

  DeleteNotification: async (_id) => {

    await AdminNotificationsDAL.DeleteNotifications({ _id });
    return {};
  },

  AddBlog: async (data) => {
    return await BlogsDal.CreateBlog(data);
  },

  EditBlog: async (data, _id) => {
    const blog = await BlogsDal.FindOneBlog({ _id }, 'files');

    if (!blog) {
      throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }
    if (blog.files.length + data?.files?.length > 5) {
      throw new ApiError(CONSTANTS_MESSAGES.MAXIMUM_IMAGE_COUNT_REACHED, StatusCodes.BAD_REQUEST);
    }
    return await BlogsDal.EditBlog({ _id }, {
      $set: { title: data.title, author: data.author, desciption: data.desciption },
      $push: { files: data.files }
    })
  },

  DeleteBlog: async (_id) => {

    return await BlogsDal.DeleteBlog({ _id })
  },

  DeleteBlogImage: async (_id, index) => {
    const blog = await BlogsDal.FindOneBlog({ _id }, 'files');

    if (!blog) {
      throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }
    if (blog.files.length === 1) {
      throw new ApiError(CONSTANTS_MESSAGES.CANNOT_DELETE_ALL_IMAGES, StatusCodes.BAD_REQUEST);
    }
    if (index < 0 || index >= blog.files.length) {
      throw new ApiError(CONSTANTS_MESSAGES.FAILED_DELETE_IMAGE, StatusCodes.BAD_REQUEST);
    }
    blog.files.splice(index, 1);
    const updatedBlog = await BlogsDal.EditBlog({ _id }, { files: blog.files });

    return updatedBlog;
  },


  AddFaq: async (data) => {
    return await FaqDal.CreateFaq(data);
  },

  EditFaq: async (data, _id) => {
    const { question, answer } = data;
    return await FaqDal.EditFaq({ _id }, data);
  },

  DeleteFaq: async (_id) => await FaqDal.DeleteFaq({ _id }),

  AddGoogleReview: async (data) => {
    return await GoogleReviewsDal.CreateReview(data);
  },

  EditGoogleReview: async (data, _id) => {
    const blog = await GoogleReviewsDal.FindOneReview({ _id });

    if (!blog) {
      throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }

    return await GoogleReviewsDal.EditReview({ _id }, data)
  },

  DeleteGoogleReview: async (_id) => {
    return await GoogleReviewsDal.DeleteReview({ _id })
  },

  AddMedia: async (data) => {
    return await MediaDal.CreateMedia(data);
  },

  EditMedia: async (data, _id) => {
    const blog = await MediaDal.FindOneMedia({ _id }, 'files');

    if (!blog) {
      throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }
    if (blog.files.length + data?.files?.length > 5) {
      throw new ApiError(CONSTANTS_MESSAGES.MAXIMUM_IMAGE_COUNT_REACHED, StatusCodes.BAD_REQUEST);
    }
    return await MediaDal.EditMedia({ _id }, {
      $set: { title: data.title, author: data.author, desciption: data.desciption, media_url: data.media_url, media_icon: data.media_icon },
      $push: { files: data.files }
    })
  },

  DeleteMedia: async (_id) => {
    return await MediaDal.DeleteMedia({ _id })
  },

  DeleteMediaImage: async (_id, index) => {
    const media = await MediaDal.FindOneMedia({ _id }, 'files');

    if (!media) {
      throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }
    if (media.files.length === 1) {
      throw new ApiError(CONSTANTS_MESSAGES.CANNOT_DELETE_ALL_IMAGES, StatusCodes.BAD_REQUEST);
    }
    if (index < 0 || index >= media.files.length) {
      throw new ApiError(CONSTANTS_MESSAGES.FAILED_DELETE_IMAGE, StatusCodes.BAD_REQUEST);
    }
    media.files.splice(index, 1);
    const updatedMedia = await MediaDal.EditMedia({ _id }, { files: media.files });

    return updatedMedia;
  },

  DeleteMediaIcon: async (_id) => {
    const updatedMedia = await MediaDal.EditMedia({ _id }, { media_icon: null });
    return updatedMedia;
  },

  AddEvent: async (data) => {
    return await EventsDal.CreateEvent(data);
  },

  EditEvent: async (data, _id) => {
    const events = await EventsDal.FindOneEvent({ _id }, 'files');

    if (!events) {
      throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }
    if (events.files.length + data?.files?.length > 5) {
      throw new ApiError(CONSTANTS_MESSAGES.MAXIMUM_IMAGE_COUNT_REACHED, StatusCodes.BAD_REQUEST);
    }
    return await EventsDal.EditEvent({ _id }, {
      $set: { title: data.title, description: data.description, date: data.date },
      $push: { files: data.files }
    })
  },

  DeleteEvent: async (_id) => {
    return await EventsDal.DeleteEvent({ _id })
  },

  DeleteEventImage: async (_id, index) => {
    const event = await EventsDal.FindOneEvent({ _id }, 'files');

    if (!event) {
      throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }
    if (event.files.length === 1) {
      throw new ApiError(CONSTANTS_MESSAGES.CANNOT_DELETE_ALL_IMAGES, StatusCodes.BAD_REQUEST);
    }
    if (index < 0 || index >= event.files.length) {
      throw new ApiError(CONSTANTS_MESSAGES.FAILED_DELETE_IMAGE, StatusCodes.BAD_REQUEST);
    }
    event.files.splice(index, 1);
    const updatedEvent = await EventsDal.EditEvent({ _id }, { files: event.files });

    return updatedEvent;
  },

  AddLinkedinPost: async (data) => {
    return await LinkedinDal.CreatePost(data);
  },

  EditLinkedinPost: async (data, _id) => {
    const posts = await LinkedinDal.FindOnePost({ _id });

    if (!posts) {
      throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }

    return await LinkedinDal.EditPost({ _id }, data)
  },

  DeleteLinkedinPost: async (_id) => {
    return await LinkedinDal.DeletePost({ _id })
  },

  AddJob: async (data) => {
    return await JobsDal.CreateJob(data);
  },

  EditJob: async (data, _id) => {
    const job = await JobsDal.FindOneJob({ _id });

    if (!job) {
      throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }

    return await JobsDal.EditJob({ _id }, data)
  },

  DeleteJob: async (_id) => {
    const application = await JobApplicationDal.FindOneApplication({ job: _id });
    if (application) throw new ApiError(CONSTANTS_MESSAGES.APPLICATION_UNDER_JOB, StatusCodes.BAD_REQUEST);
    return await JobsDal.DeleteJob({ _id });
  },

  GetAllJobApplications: async (data) => {
    const {
      search,
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = -1,
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};
    // if (search) {
    //   searchQuery = {
    //     title: { $regex: search, $options: "i" }
    //   };
    // } else {
    //   searchQuery = {};
    // }

    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await JobApplicationDal.GetAllApplications(searchQuery, "-__v ", pagination);
    const totalCount = await JobApplicationDal.GetRecordCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);

    const newFinalData = await Promise.all(resp.map(async (m) => {
      const jdUrl =  Utils.getFileURL1(m.job.jd);
      const resumeUrl =  Utils.getFileURL1(m.resume);
      return {
        ...m,
        jdUrl,
        resumeUrl

      };
    }));

    return {
      records: newFinalData,
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

  ResetAdminPassword: async (data) => {
    const { email } = data;
    const existingUser = await AdminAuthDal.GetAdmin(
      { email },
      "_id email name"
    );
    if (!existingUser) {
      throw new ApiError(
        CONSTANTS_MESSAGES.ADMIN_NOT_FOUND,
        StatusCodes.NOT_FOUND
      );
    } else {
      const randomKey = crypto.randomBytes(24).toString('hex').slice(0, 24);
      Utils.sendBrevoMail.ResetAdminPass({
        template: `To recover your account click the following link: <a href="{{params.link}}">Recover Account</a>. The link is valid for 10 minutes.`,
        subject: `Recover account`,
        user: { name: existingUser?.name, email: existingUser?.email },
        params: { name: existingUser?.name, link: `${process.env.FRONTEND_URL}/admin/recover?email=${existingUser.email}&key=${randomKey}` }
      });
      await ResetPassDal.saveRequest({ email: existingUser.email, key: randomKey })
    }
    return {};
  },

  ResetAdminPasswordDetails: async (data) => {
    const { email, password, key } = data;

    const existingUser = await AdminAuthDal.GetAdmin(
      { email },
      "_id email"
    );
    if (!existingUser) {
      throw new ApiError(
        CONSTANTS_MESSAGES.ADMIN_NOT_FOUND,
        StatusCodes.NOT_FOUND
      );
    } else {
      const validRequest = await ResetPassDal.getRequest({ email, key });
      if (!validRequest) {
        throw new ApiError(
          CONSTANTS_MESSAGES.INVALID_PASS_REQ,
          StatusCodes.BAD_REQUEST
        );
      }
      const hashedPass = await Utils.GenerateHashedPassword(password);
      await ResetPassDal.deleteRequest({ email })
      return await AdminAuthDal.UpdateAdmin({ email }, { password: hashedPass });
    }
  },

  GetFreeHealthTests: async (data) => {
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
        health_checkup_id: { $regex: search, $options: "i" },
       
      };
    } else {
      searchQuery = {};
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pipeline = [
      { $match: searchQuery },
      { $sort: { ["createdAt"]: -1 } },
      { $skip: Number(offset) },
      { $limit: Number(pageSize) },
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

  FreeHealthTestsAction: async (_id,data) =>{
    await HealthCheckDal.EditHealthCheck({_id},data);
    return {};
  }
};

module.exports = AdminService;
