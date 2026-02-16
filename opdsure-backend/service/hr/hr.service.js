const bcrypt = require("bcrypt");
const { CONSTANTS_MESSAGES } = require("../../Helper");
const {
  CorporateHrDAL,
  HrAuthDal,
  CorpoEmpDal,
  UserAuthDal,
  FamilyDAL,
  PlanDal,
  WalletTransactionDal,
  CorpoDal
} = require("../../DAL");
const dayjs = require("dayjs");
const { JwtSign, ApiError, Utils,GetExtendedDays } = require("../../Utils");
const { StatusCodes } = require("http-status-codes");
const { CONSTANTS } = require("../../Constant");


const HRService = {
  Login: async (data) => {
    const { email, phone, password } = data;
    let projection = {}
    if (email && phone) {
      projection = { $or: [{ email }, { phone }] }
    } else if (email) {
      projection = { email }
    } else if (phone) {
      projection = { phone }
    }
    const existingUser = await HrAuthDal.GetUser(projection, "_id email password token status");

    if (!existingUser) {
      throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    if (existingUser.status === CONSTANTS.STATUS.INACTIVE) {
      throw new ApiError(CONSTANTS_MESSAGES.USER_INACTIVE, StatusCodes.UNAUTHORIZED);
    }
    const matched = await bcrypt.compare(password, existingUser.password);
    if (!matched) {
      throw new ApiError(CONSTANTS_MESSAGES.WRONG_PASSWORD, StatusCodes.BAD_REQUEST);
    }

    const token = await JwtSign({
      email: existingUser.email,
      _id: existingUser._id,
    }, {
      expiresIn: "1d"
    });

    await HrAuthDal.UpdateUser({ _id: existingUser._id }, { $push: { token } });

    return { token: token, user_id: existingUser._id, role: CONSTANTS.USER_ROLES.HR_USER };
  },

  Logout: async (token, _id) => {
    await HrAuthDal.UpdateUser({ _id }, { $pull: { token: token } });
    return {};
  },

  GetProfile: async (_id) => {
    return await HrAuthDal.GetUser(_id, "_id name profile_image dob gender country_code phone address email state city pin_code verified plan country_code wallet_balance");
  },

  ResetCorporateHrPass: async (_id, data) => {
    const findUser = await CorporateHrDAL.Find({ _id });
    if (!findUser) throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    const hashedPassword = await Utils.GenerateHashedPassword(data.password);
    if (hashedPassword == null) throw new ApiError(CONSTANTS_MESSAGES.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
    return await CorporateHrDAL.EditCorporateHr({ _id }, { password: hashedPassword });
  },

  AddCorpoEmp: async (user,data) => {
    const plan = await PlanDal.GetPlan({ _id: data.plan }, 'frequency membership_options name');  
    const subscribedOption = plan.membership_options.find(p=> p.membership_id === data.membership); 
    const planValidity = GetExtendedDays(plan.frequency);
    const walletBalance = subscribedOption.wallet_balance;
    const userPlan = {
      purchased: true,
      id: plan._id,
      membership_id: subscribedOption.membership_id,
      start_date: dayjs().toISOString(),
      end_date: dayjs().add(planValidity, 'day').toISOString(),
      paid_price: 0,
    }
    const checkUniqueEmail = await  UserAuthDal.GetUser({ email: data.email });
    if (checkUniqueEmail) throw new ApiError(CONSTANTS_MESSAGES.EMAIL_EXISTS, StatusCodes.BAD_REQUEST);
    const checkUniqueMobile = await  UserAuthDal.GetUser({ phone: data.phone });
    if (checkUniqueMobile) throw new ApiError(CONSTANTS_MESSAGES.MOBILE_EXISTS, StatusCodes.BAD_REQUEST);
    data.corporate = user.corporate;
    const userCount = JSON.stringify(100 + await UserAuthDal.GetCount());
    let padded = userCount.padStart(9,"0");
    data.unique_id = `R${padded}`;
    data.subscriber_type = CONSTANTS.SUBSCRIBER_TYPE.CORPORATE;
      const verified = {
      email:true, phone:true
    }
    data.verified = verified;
    data.plan = userPlan;
    data.wallet_balance = walletBalance;
    data.first_plan_purchase = 1;
    const resp = await UserAuthDal.CreateUser(data);
    await FamilyDAL.AddMember({
      name:resp.name,phone:resp.phone,country_code:resp.country_code,
      gender: resp.gender, dob: resp.dob, user_id: resp._id,address: resp.address, relation: CONSTANTS.FAMILY_RELATION.SELF
    });
    await WalletTransactionDal.AddWalletTransaction({
        user_id: resp._id,
        amount: walletBalance,
        type: CONSTANTS.TRANSACTION.TYPE.CREDIT,
        plan_id: plan._id
    })
    return {};
  },

  AddBulkCorpoEmp: async (corporate,data) => {
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
    // const hashedPassword = await Utils.GenerateHashedPassword(CONSTANTS.DEFAULT_PASSWORD);
    let successful_inserts = 0;
    try {
      const createPromises = data.employee_details.map(async (employee) => {
        try {
          const checkUniqueEmail = await UserAuthDal.GetUser({ email: employee.email });
          if (checkUniqueEmail != null) {
           
              failedInsertions.push({
                ...employee,
                reason: CONSTANTS_MESSAGES.EMAIL_EXISTS
              });
              const resp = await CorpoEmpDal.CreateTempFailedCorpoEmp({ corporate, ...employee, reason: CONSTANTS_MESSAGES.EMAIL_EXISTS })
              return null;
           
          }
          const checkUniqueMobile = await UserAuthDal.GetUser({ phone: employee.phone });
          if (checkUniqueMobile != null) {
           
              failedInsertions.push({
                ...employee,
                reason: CONSTANTS_MESSAGES.MOBILE_EXISTS
              });
              const resp = await CorpoEmpDal.CreateTempFailedCorpoEmp({ corporate, ...employee, reason: CONSTANTS_MESSAGES.MOBILE_EXISTS });
              return null;
           
          }
          const userCount = JSON.stringify(100 + await UserAuthDal.GetCount());
          let padded = userCount.padStart(9,"0");
          let unique_id = `R${padded}`;
          const result = await UserAuthDal.CreateUser({
            corporate,
            // reset_default_password:true,
            // password: hashedPassword,
             wallet_balance:walletBalance,
            first_plan_purchase:1,
            subscriber_type: CONSTANTS.SUBSCRIBER_TYPE.CORPORATE,
            plan: userPlan,
            unique_id,
            ...employee,
          });
          await FamilyDAL.AddMember({
            name:result.name,phone:result.phone,country_code:result.country_code,plan_status:CONSTANTS.PLAN_STATUS.PAID,
            gender: result.gender, dob: result.dob, user_id: result._id,address: result.address, relation: CONSTANTS.FAMILY_RELATION.SELF
          });
          await WalletTransactionDal.AddWalletTransaction({
              user_id: result._id,
              amount: walletBalance,
              type: CONSTANTS.TRANSACTION.TYPE.CREDIT,
              plan_id: plan._id
          })
          UserNotificationsDAL.AddNotification({user: result._id, message: `Plan ${plan.name} activated successfully.` })
          successful_inserts++;
          return result;
        } catch (error) {
          failedInsertions.push(employee);
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

  GetAllCorpoEmp: async (corporate,data) => {
    const { search, page, pageSize, sortBy, sortOrder } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    if (search) {
      searchQuery = {
        $or: [{ name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
       ],
        corporate
      };
    } else {
      searchQuery = { corporate };
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await UserAuthDal.GetAllUsers(searchQuery, "-token -password -createdAt -updatedAt -__v", pagination);
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

  EditCorpoEmp: async (corporate ,data,_id ) => {
    const findOneEmp = await UserAuthDal.GetUser({ _id });
    if (!findOneEmp) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    const checkUniqueEmail = await UserAuthDal.GetUser({ email: data.email, _id: { $ne: _id } });
    if (checkUniqueEmail) throw new ApiError(CONSTANTS_MESSAGES.EMAIL_EXISTS, StatusCodes.BAD_REQUEST);
    const checkUniqueMobile = await UserAuthDal.GetUser({ phone: data.phone, _id: { $ne: _id } });
    if (checkUniqueMobile) throw new ApiError(CONSTANTS_MESSAGES.MOBILE_EXISTS, StatusCodes.BAD_REQUEST);
    return await UserAuthDal.UpdateUser({ _id, corporate }, data);
  },

  DeleteCorpoEmp: async (_id) => {
    const findCorpHr = await UserAuthDal.GetUser({ _id });
    if (!findCorpHr) throw new ApiError(CONSTANTS_MESSAGES.ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
    return await UserAuthDal.DeleteUser({ _id })
  },

  ResetCorporateEmpPass: async (corporate, _id, data) => {
    const findUser = await UserAuthDal.GetUser({ _id, corporate });
    if (!findUser) throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    const hashedPassword = await Utils.GenerateHashedPassword(data.password);
    if (hashedPassword == null) throw new ApiError(CONSTANTS_MESSAGES.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
    return await UserAuthDal.UpdateUser({ _id }, { password: hashedPassword, 
      // reset_default_password:true
     });
  },

  DeleteAllFailedInsertsCorpoEmp: async (corporate) => {
    return await CorpoEmpDal.DeleteFailedInsertsCorpoEmp({ corporate })
  },
  GetAllFailedInsertsCorpoEmp: async (corporate) => {
    return await CorpoEmpDal.GetAllFailedInsertsCorpoEmp({ corporate })
  },

  GetCorporatePlanByUserId: async (userId) => {
    // First get the HR user to find which corporate they belong to
    const hrUser = await CorporateHrDAL.GetById(userId);
    if (!hrUser) {
        throw new Error("HR user not found");
    }
    
    // Then get the corporate details
    const corporate = await CorpoDal.GetCorporateById(hrUser.corporate);
    if (!corporate) {
        throw new Error("Corporate not found");
    }
    
    // Then get the plan for this corporate
    const plan = await PlanDal.GetPlan({ corporate: hrUser.corporate });
    if (!plan) {
        throw new Error("No plan found for this corporate");
    }

    // Process files to get URLs
    if (plan.files && plan.files.length > 0) {
        plan.files = await Promise.all(plan.files.map(async (file) => {
            return await Utils.getFileURL(file);
        }));
    }

    // Calculate charges including GST
    if (plan.membership_options && plan.membership_options.length > 0) {
        plan.membership_options = plan.membership_options.map(option => {
            return {
                ...option,
                charges_incl_GST: option.charges + (option.charges * CONSTANTS.PAYMENT.GST / 100)
            };
        });
    }
    
    return {
        corporate: {
            _id: corporate._id,
            name: corporate.name,
            email: corporate.email,
            // contact_person: corporate.contact_person
        },
        plan
    };
  },
};


module.exports = HRService;