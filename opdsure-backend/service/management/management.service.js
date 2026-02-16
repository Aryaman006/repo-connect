const bcrypt = require("bcrypt");
const { CONSTANTS_MESSAGES, NOTIFICATIONS } = require("../../Helper");
const { ManagementUserDal, ClaimDAL, FamilyDAL, HealthCheckDal, EmailDal, UserAuthDal, DisputedClaimsDAL, DesigDal, WalletTransactionDal, ManagementNotificationsDAL, ResetPassDal, ContactUsRetailDAL, ContactUsCorporateDAL, ContactUsEmailDAL } = require("../../DAL");
const { JwtSign, ApiError, Utils } = require("../../Utils");
const { StatusCodes } = require("http-status-codes");
const { CONSTANTS } = require("../../Constant");
const { managmentUsers } = require("../../models");
const managementUserModel = require("../../models/managementUser.model");
const dayjs = require("dayjs");
const crypto = require('crypto');

const ManagementService = {

    Login: async (data) => {
        const { email, password } = data;
        const existingUser = await ManagementUserDal.GetUser({ email }, "_id email password token designation status");
        if (!existingUser) {
            throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
        }
        if (existingUser.status === CONSTANTS.STATUS.INACTIVE) {
          throw new ApiError(CONSTANTS_MESSAGES.MANAGEMENT_USER_INACTIVE, StatusCodes.UNAUTHORIZED);
        }
    
        const matched = await bcrypt.compare(password, existingUser.password);
        if (!matched) {
            throw new ApiError(CONSTANTS_MESSAGES.WRONG_PASSWORD, StatusCodes.BAD_REQUEST);
        }
        const token = await JwtSign({
            email: existingUser.email,
            _id: existingUser._id,
        });
        existingUser.token.push(token)
        await ManagementUserDal.EditUser({ _id: existingUser._id }, existingUser)
        return { token: token, user_id: existingUser._id, designation: existingUser.designation.internal_id, role: CONSTANTS.USER_ROLES.MANAGEMENT_USER };
    },

    Logout: async (token, _id) => {
        const user = await ManagementUserDal.GetUser(_id);
        await ManagementUserDal.EditUser({ _id },{ $pull: { token: token } });
        return {}
    },

    // GetClaims: async (data,managmentUser) => {
    //     const {
    //       search = "",
    //       page = 1,
    //       pageSize = 10,
    //       sortBy = "internal_status",
    //       sortOrder = 1,
    //       startDate,
    //       endDate,
    //       claimType="ALL",
    //       claimInternalStatus="ALL",
    //       internalStatusFilter = "ALL",
    //     } = data;
    //     const { internal_id: designation_id } = managmentUser.designation;    
    //     const offset = (page - 1) * pageSize;
    //     const sortObject = {};
    //     let searchQuery={};       
    //     let claimsCondition ;
      
    //   if (designation_id === CONSTANTS.DESIGNATIONS[3].internal_id) {
    //     claimsCondition = {
    //       $or: [{ internal_status: CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION, assigned_to_verifier: managmentUser._id },
    //       { assigned_to_verifier: managmentUser._id }
    //       ]
    //     };
    //   }else if (designation_id === CONSTANTS.DESIGNATIONS[1].internal_id) {
    //     claimsCondition = {
    //       $or: [{ internal_status: CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_VERIFIER, assigned_to_manager: managmentUser._id },
    //       { assigned_to_manager: managmentUser._id }
    //       ]
    //     };
    //   }else if (designation_id === CONSTANTS.DESIGNATIONS[4].internal_id) {
    //     claimsCondition = {
    //       $or: [{ internal_status: CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_VERIFIER, assigned_to_financer: managmentUser._id },
    //       { assigned_to_financer: managmentUser._id }
    //       ]
    //     };
    //   }else if (designation_id === CONSTANTS.DESIGNATIONS[2].internal_id) {
    //     claimsCondition = {
    //       $or: [{ internal_status: CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION}, {verifier: managmentUser._id },
    //       ]
    //     };
    //   }
     
    //   if (search) {
    //     searchQuery = {
    //       $and: [
    //         {  $or: [
    //           // { city: { $regex: search, $options: "i" } },
    //           // { doc_name: { $regex: search, $options: "i" } }, 
    //           { claim_id: { $regex: search, $options: "i" } },             
    //           // { hospital: { $regex: search, $options: "i" } }           
    //       ], },
    //         { ...claimsCondition }
    //       ]
    //     };
    //    } else {
    //     searchQuery = {
    //       ...claimsCondition
    //     };
    //   }   

    //   if (startDate && endDate) {
    //     searchQuery.createdAt = {
    //       $gte: new Date(startDate),
    //       $lte: new Date(endDate),
    //     };
    //   } else {
    //     delete searchQuery.createdAt; // Ensures all claims are shown if no date filter is applied
    //   }
      
    //     if (claimInternalStatus && claimInternalStatus !== "ALL") {
    //       searchQuery.internal_status = Number(claimInternalStatus);
    //     }    

    //     if(internalStatusFilter &&  internalStatusFilter!=="ALL"){
    //       const statusArray = internalStatusFilter.split(",").map(Number)
    //       searchQuery.internal_status = { $in : statusArray }
    //     }
        
    //     if (claimType && claimType !== "ALL") {
    //       searchQuery.claim_type = Number(claimType);
    //     }    
    //     sortObject[sortBy] = parseInt(sortOrder);
    //     const pagination = { offset, sortObject, pageSize }
    //     const resp = await ClaimDAL.GetClaims(searchQuery, "", pagination);
    //     const totalCount = await ClaimDAL.GetClaimCount(searchQuery);
    //     const totalPages = Math.ceil(totalCount / pageSize);
    //     return {
    //       records: resp,
    //       pagination: {
    //         totalRecords: totalCount,
    //         pageSize: Number(pageSize),
    //         totalPages,
    //         currentPage: Number(page),
    //         nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
    //         prevPage: Number(page) > 1 ? Number(page) - 1 : null,
    //       },
    //     };
    //   },

    GetAllClaims: async (data) => {
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
          // claimType="ALL",
          claimInternalStatus="",
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
          $gte: new Date(startDate),
          $lte: new Date(endDate),
           };
          } else {
          delete searchQuery.createdAt; // Ensures all claims are shown if no date filter is applied
       }
    
        if (claimInternalStatus && claimInternalStatus !== "") {
          searchQuery.internal_status = Number(claimInternalStatus);
        }
        // if (claimType && claimType !== "ALL") {
        //   searchQuery.claim_type = Number(claimType);
        //   } 
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
    
      GetClaim: async (user_id, _id) => {
        let data = await ClaimDAL.GetClaim({ _id });
        const familyDetails = await FamilyDAL.GetMember({ _id: data.member_id });
        
        if (!data) return null;
       
        const { name, _id : member_id, phone, country_code } = familyDetails;
        const tempData = JSON.parse(JSON.stringify(data));
        tempData.member_details = { name, member_id, phone, country_code };
    
        const receiptTypes = ['fee_receipt', 'prescription', 'pharmacy_receipt', 'test_receipt','test_reports'];
        
        await Promise.all(receiptTypes.map(async (type) => {
          if (Array.isArray(tempData[type])) {
            tempData[type] = await Promise.all(tempData[type].map(async (receipt) => {
              return await Utils.getFileURL(receipt);
            }));
          }
        }));
    
        return tempData;
      },

      UpdateClaimBills : async ({
        claimId,
        approved_claimable_doctor_fee,
        approved_claimable_pharmacy_fee = 0,
        approved_claimable_lab_test_fee = 0,
        // approved_claimable_combined_pharmacy_test_fees
      }) => {
        const approved_claimable_amount = 
          Number(approved_claimable_doctor_fee || 0) +
          Number(approved_claimable_pharmacy_fee || 0) +
          Number(approved_claimable_lab_test_fee || 0) 
          // Number(approved_claimable_combined_pharmacy_test_fees || 0)
      
        const updatePayload = {
          approved_claimable_doctor_fee,
          approved_claimable_pharmacy_fee,
          approved_claimable_lab_test_fee,
          approved_claimable_amount
        };
      
        const updatedClaim = await ClaimDAL.UpdateClaimById(claimId, updatePayload);
        return updatedClaim;
      },

      UpdateClaim: async (data, _id, managementUser) => {
        const isValidClaim = await ClaimDAL.GetClaim({ _id });
        if (!isValidClaim) {
          throw new ApiError(CONSTANTS_MESSAGES.CLAIM_NOT_FOUND, StatusCodes.NOT_FOUND);
        }
        const user = await UserAuthDal.GetUser({ _id:isValidClaim.user_id }, "email name plan phone");
        const { remark, approval_status } = data;
        const { internal_id: designation_id } = managementUser.designation;
        const management_user_id = managementUser._id;
        
        let internal_status, financer, verifier, manager, status,subscriber_reaction,claim_closure_Date=null,temp;
        let assignQuery = {};
        if (isValidClaim.status === CONSTANTS.CLAIM.STATUS.APPROVED || isValidClaim.status === CONSTANTS.CLAIM.STATUS.REJECTED || isValidClaim.status === CONSTANTS.CLAIM.STATUS.INVALID) {
          throw new ApiError(CONSTANTS_MESSAGES.ACTION_ALREADY_TAKEN, StatusCodes.BAD_REQUEST);
        }
      
        if (approval_status===CONSTANTS.CLAIM.INTERNAL_STATUS.REJECTED) {
          switch (designation_id) {
            case CONSTANTS.DESIGNATIONS[3].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION ) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.REJECTED;
                status = CONSTANTS.CLAIM.STATUS.REJECTED;       
                verifier = management_user_id;
                claim_closure_Date= dayjs().toISOString();
              }
              Utils.CreateUserNotification( isValidClaim.user_id,NOTIFICATIONS.CLAIM_REJECTED + isValidClaim.claim_id + "." );
              break;
            case CONSTANTS.DESIGNATIONS[1].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_VERIFIER || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION ) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.REJECTED;
                status = CONSTANTS.CLAIM.STATUS.REJECTED;       
                manager = management_user_id;
                claim_closure_Date= dayjs().toISOString();
              }
              Utils.CreateUserNotification( isValidClaim.user_id,NOTIFICATIONS.CLAIM_REJECTED + isValidClaim.claim_id + ".");
              break;
            case CONSTANTS.DESIGNATIONS[4].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_MANAGER || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION ) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.REJECTED;
                status = CONSTANTS.CLAIM.STATUS.REJECTED;       
                financer = management_user_id;
                claim_closure_Date= dayjs().toISOString();
              }
              Utils.CreateUserNotification( isValidClaim.user_id,NOTIFICATIONS.CLAIM_REJECTED + isValidClaim.claim_id + "." );
              break;
            case CONSTANTS.DESIGNATIONS[2].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION ) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.REJECTED;
                status = CONSTANTS.CLAIM.STATUS.REJECTED;       
                verifier = management_user_id;
                manager = management_user_id;
                financer = management_user_id;
                claim_closure_Date= dayjs().toISOString();
              }
              Utils.CreateUserNotification( isValidClaim.user_id,NOTIFICATIONS.CLAIM_REJECTED + isValidClaim.claim_id + "." );
              break;
            default:
              throw new ApiError(CONSTANTS_MESSAGES.FAILED_TO_UPDATE_CLAIM_STATUS, StatusCodes.BAD_REQUEST);

          }
        } else if(approval_status===CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED) {
          switch (designation_id) {
            case CONSTANTS.DESIGNATIONS[3].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_VERIFIER;
                status = CONSTANTS.CLAIM.STATUS.IN_PROCESS;
                temp = await Utils.AssignClaim({ internal_id: CONSTANTS.DESIGNATIONS[1].internal_id });
                assignQuery.assigned_to_manager = temp;
                verifier = management_user_id;
              }
              Utils.CreateUserNotification( isValidClaim.user_id,NOTIFICATIONS.CLAIM_INPROCESS + isValidClaim.claim_id + "." );
              Utils.CreateManagementNotification( temp ,"Claim with claim ID: " + isValidClaim.claim_id + NOTIFICATIONS.DUE_FOR_PROCESSING);
              break;
            case CONSTANTS.DESIGNATIONS[1].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_VERIFIER || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION ) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_MANAGER;
                temp = await Utils.AssignClaim({ internal_id: CONSTANTS.DESIGNATIONS[4].internal_id });
                assignQuery.assigned_to_financer = temp;
                manager = management_user_id;
              }
              Utils.CreateManagementNotification( temp , "Claim with claim ID: " + isValidClaim.claim_id + NOTIFICATIONS.DUE_FOR_PROCESSING);
              break;
            case CONSTANTS.DESIGNATIONS[4].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_MANAGER || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION ) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED;
                status = CONSTANTS.CLAIM.STATUS.APPROVED;  
                financer = management_user_id;
              }
              Utils.CreateUserNotification( isValidClaim.user_id,NOTIFICATIONS.CLAIM_APPROVED + isValidClaim.claim_id + "." );
              Utils.CreateManagementNotification( management_user_id ,"Claim with claim ID: " + isValidClaim.claim_id + NOTIFICATIONS.DUE_FOR_PAYMENT);

              break;

              case CONSTANTS.DESIGNATIONS[2].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_VERIFIER) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED;
                status = CONSTANTS.CLAIM.STATUS.APPROVED;
                verifier = management_user_id;
                manager = management_user_id;
                financer = management_user_id;
              }
              Utils.CreateUserNotification( isValidClaim.user_id,NOTIFICATIONS.CLAIM_APPROVED + isValidClaim.claim_id + "." );
              Utils.CreateManagementNotification( management_user_id ,"Claim with claim ID: " + isValidClaim.claim_id + NOTIFICATIONS.DUE_FOR_PAYMENT);
              break;
            default:
              throw new ApiError(CONSTANTS_MESSAGES.FAILED_TO_UPDATE_CLAIM_STATUS, StatusCodes.BAD_REQUEST);
          }
        }else if(approval_status===CONSTANTS.CLAIM.INTERNAL_STATUS.INVALID) {
          switch (designation_id) {
            case CONSTANTS.DESIGNATIONS[3].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION ) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.INVALID;
                status = CONSTANTS.CLAIM.STATUS.INVALID;                  
                verifier = management_user_id;
                claim_closure_Date= dayjs().toISOString();
              }
              Utils.CreateUserNotification( isValidClaim.user_id,NOTIFICATIONS.CLAIM_INVALID + isValidClaim.claim_id + "." );
              break;
            case CONSTANTS.DESIGNATIONS[1].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_VERIFIER || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.INVALID;  
                status = CONSTANTS.CLAIM.STATUS; 
                manager = management_user_id;
                claim_closure_Date= dayjs().toISOString();
              }
              Utils.CreateUserNotification( isValidClaim.user_id,NOTIFICATIONS.CLAIM_INVALID + isValidClaim.claim_id + "." );              
              break;
            case CONSTANTS.DESIGNATIONS[4].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_MANAGER || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION ) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.INVALID;  
                status = CONSTANTS.CLAIM.STATUS.INVALID;                  
                financer = management_user_id;
                claim_closure_Date= dayjs().toISOString();
              }
              Utils.CreateUserNotification( isValidClaim.user_id,NOTIFICATIONS.CLAIM_INVALID + isValidClaim.claim_id + "." );
              break;
            case CONSTANTS.DESIGNATIONS[2].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION ) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.INVALID;  
                status = CONSTANTS.CLAIM.STATUS.INVALID;                  
                verifier = management_user_id;
                manager = management_user_id;
                financer = management_user_id;
                claim_closure_Date= dayjs().toISOString();
              }
              Utils.CreateUserNotification( isValidClaim.user_id,NOTIFICATIONS.CLAIM_INVALID + isValidClaim.claim_id + "." );
              break;
            default:
              throw new ApiError(CONSTANTS_MESSAGES.FAILED_TO_UPDATE_CLAIM_STATUS, StatusCodes.BAD_REQUEST);
          }
        }else if(approval_status===CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION) {
          switch (designation_id) {
            case CONSTANTS.DESIGNATIONS[3].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION; 
                status = CONSTANTS.CLAIM.STATUS.CLARIFICATION;     
                subscriber_reaction=false;
                verifier = management_user_id;
              }
              Utils.CreateUserNotification( isValidClaim.user_id,NOTIFICATIONS.CLAIM_CLARIFICATION + isValidClaim.claim_id + "." );
              break;
            case CONSTANTS.DESIGNATIONS[1].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_VERIFIER || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION)  {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION;
                status = CONSTANTS.CLAIM.STATUS.CLARIFICATION;         
                subscriber_reaction=false;
                manager = management_user_id;
              }
              Utils.CreateUserNotification( isValidClaim.user_id,NOTIFICATIONS.CLAIM_CLARIFICATION + isValidClaim.claim_id + "." );
              break;
            case CONSTANTS.DESIGNATIONS[4].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_MANAGER || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION)  {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION;
                status = CONSTANTS.CLAIM.STATUS.CLARIFICATION;         
                subscriber_reaction=false;
                financer = management_user_id;
              }
              Utils.CreateUserNotification( isValidClaim.user_id,NOTIFICATIONS.CLAIM_CLARIFICATION + isValidClaim.claim_id + "." );
              break;
            case CONSTANTS.DESIGNATIONS[2].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION || isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION)  {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION;
                status = CONSTANTS.CLAIM.STATUS.CLARIFICATION;         
                subscriber_reaction=false;
                verifier = management_user_id;
                manager = null;
                financer = null;
              }
              Utils.CreateUserNotification( isValidClaim.user_id,NOTIFICATIONS.CLAIM_CLARIFICATION + isValidClaim.claim_id + "." );
              break;
            default:
              throw new ApiError(CONSTANTS_MESSAGES.FAILED_TO_UPDATE_CLAIM_STATUS, StatusCodes.BAD_REQUEST);
          }
        }else{
          throw new ApiError(CONSTANTS_MESSAGES.FAILED_TO_UPDATE_CLAIM_STATUS, StatusCodes.BAD_REQUEST);
        }
      
        const modified_remark = {
          designation: designation_id,
          message: approval_status === CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED ? (remark ? remark : "Approved by " + CONSTANTS.DESIGNATIONS[designation_id].value) : remark,
          approver_id: management_user_id,
          message_claim_internal_status: internal_status
        }
        const modified_subscriber_remark = {
          designation: designation_id,
          approver_id: management_user_id,
          message_claim_internal_status: internal_status
        }
        let pushData={};
        pushData.remark = modified_remark;
        if (
          approval_status === CONSTANTS.CLAIM.INTERNAL_STATUS.REJECTED ||
          approval_status === CONSTANTS.CLAIM.INTERNAL_STATUS.INVALID ||
          approval_status === CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION
        ) {
          modified_subscriber_remark.message = remark;
          pushData.subscriber_remark = modified_subscriber_remark;
        }

        const finalData = {
          $push: pushData ,
          $set: { internal_status, status, verifier, manager, financer,subscriber_reaction,claim_closure_Date, ...assignQuery }
        };

      const updateClaim = await ClaimDAL.EditClaimStatus({ _id }, finalData);
      
      let emailTemplate, templateData, claimFunction;
      emailTemplate = await EmailDal.GetOneEmail({});
  switch (status) {
    case (CONSTANTS.CLAIM.STATUS.APPROVED  ):
      // emailTemplate = await EmailDal.GetOneEmail({});
      if (designation_id === CONSTANTS.DESIGNATIONS[2].internal_id ||
        designation_id === CONSTANTS.DESIGNATIONS[4].internal_id) {
          if(user?.email){
            templateData = {
            name: isValidClaim?.user_id?.name,
            email: isValidClaim?.user_id?.email,
            template: emailTemplate?.claim_approval_mail,
            claim_id: isValidClaim?.claim_id
          };
          Utils.sendBrevoMail.ClaimApproval({
            template:templateData.template,
            subject:`Claim Status Update - Claim (ID: ${isValidClaim?.claim_id})`,
            user:{name:templateData.name,email:templateData.email},
            params:{name:user?.name,claim_id:templateData.claim_id,status:"Approved"}
          });
        }
        if(user?.phone){
          Utils.SendSMS.ClaimApproval({
            name:user.name,phone:user.phone,claim_id:isValidClaim.claim_id,status:"Approved"
          });
        } 
      }
      
      break;
    case CONSTANTS.CLAIM.STATUS.REJECTED:
      // emailTemplate = await EmailDal.GetOneEmail({});
      if(user?.email){
        templateData = {
        name: isValidClaim?.user_id?.name,
        email: isValidClaim?.user_id?.email,
        template: emailTemplate?.claim_clarification_mail,
        claim_id: isValidClaim?.claim_id
      };
      Utils.sendBrevoMail.ClaimRejection({
        template:templateData.template,
        subject:`Claim Status Update - Claim (ID: ${isValidClaim?.claim_id})`,
        user:{name:templateData.name,email:templateData.email},
        params:{name:user?.name,claim_id:templateData.claim_id,}
      });
    }
    if(user?.phone){
      Utils.SendSMS.ClaimApproval({
        name:user.name,phone:user.phone,claim_id:isValidClaim.claim_id,status:"Rejected"
      });
    } 
      break;
    case CONSTANTS.CLAIM.STATUS.CLARIFICATION:
      // emailTemplate = await EmailDal.GetOneEmail({});
      if(user?.email){
        templateData = {
        name: isValidClaim?.user_id?.name,
        email: isValidClaim?.user_id?.email,
        template: emailTemplate?.claim_clarification_mail,
        claim_id: isValidClaim?.claim_id
      };
      Utils.sendBrevoMail.ClaimClarification({
        template:templateData.template,
        subject:`Claim Status Update - Claim (ID: ${isValidClaim?.claim_id})`,
        user:{name:templateData.name,email:templateData.email},
        params:{name:user?.name,claim_id:templateData.claim_id}
      });
    }
    if(user?.phone){
      Utils.SendSMS.ClaimClarification({
        name:user.name,phone:user.phone,claim_id:isValidClaim.claim_id
      });
    } 
      // claimFunction = Utils.sendMail.ClaimClarification;
      break;
      case CONSTANTS.CLAIM.STATUS.INVALID:
        // emailTemplate = await EmailDal.GetOneEmail({});
        if(user?.email){
          templateData = {
          name: isValidClaim?.user_id?.name,
          email: isValidClaim?.user_id?.email,
          template: emailTemplate?.claim_invalid_mail,
          claim_id: isValidClaim?.claim_id
        };
        Utils.sendBrevoMail.ClaimInvalid({
          template:templateData.template,
          subject:`Claim Status Update - Claim (ID: ${isValidClaim?.claim_id})`,
          user:{name:templateData.name,email:templateData.email},
          params:{name:user?.name,claim_id:templateData.claim_id,status:"Rejected"}
       });
      }
      if(user?.phone){
        Utils.SendSMS.ClaimInvalid({
          name:user.name,phone:user.phone,claim_id:isValidClaim.claim_id,status:"Rejected"
        });
      } 
        // claimFunction = Utils.sendMail.ClaimInvalid;
        break;
    default:
       return updateClaim;
  }

          return updateClaim; 
      },

    GetDisputedClaims: async (data, managmentUser) => {
        let {
          search = "",
          page = 1,
          pageSize = 10,
          sortBy = "internal_status",
          sortOrder = 1,
          startDate = dayjs().subtract(30, "day").startOf("day").toISOString(),
          endDate = dayjs().endOf("day").toISOString(),
          claimType = "ALL",
          claimInternalStatus = "ALL",
          claimDisputeStatus = "ALL",
        } = data;
        pageSize = Number(pageSize)
        const { internal_id: designation_id } = managmentUser.designation;
        const offset = (page - 1) * pageSize;
        const sortObject = { [sortBy]: parseInt(sortOrder) };
        let claimsCondition = {};
      
        if (designation_id === CONSTANTS.DESIGNATIONS[3].internal_id) {
          claimsCondition = {
            $or: [
              { internal_status: CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION, assigned_to_verifier: managmentUser._id },
              { assigned_to_verifier: managmentUser._id } 
            ]
          };
        } else if (designation_id === CONSTANTS.DESIGNATIONS[1].internal_id) {
          claimsCondition = {
            $or: [
              { internal_status: CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_VERIFIER, assigned_to_manager: managmentUser._id },
              { assigned_to_manager: managmentUser._id }
            ]
          };
        } else if (designation_id === CONSTANTS.DESIGNATIONS[4].internal_id) {
          claimsCondition = {
            $or: [
              { internal_status: CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_VERIFIER, assigned_to_financer: managmentUser._id },
              { assigned_to_financer: managmentUser._id }
            ]
          };
        } else if (designation_id === CONSTANTS.DESIGNATIONS[2].internal_id) {
          claimsCondition = {
            $or: [
              { internal_status: CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION },
              { verifier: managmentUser._id }
            ]
          };
        }    
       
        if (search) {
          claimsCondition.claim_id = { $regex: search, $options: "i" };
        }
      
        if (startDate && endDate) {
          claimsCondition.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          };
        }
      
        if (claimDisputeStatus && claimDisputeStatus !== "ALL") {
          claimsCondition.dispute_status = Number(claimDisputeStatus);
        }
      
        if (claimType && claimType !== "ALL") {
          claimsCondition.claim_type = Number(claimType);
        }
      
        const matchStage = { $match: claimsCondition };
      
        const aggregationPipeline = [
          matchStage,
          {
            $lookup: {
              from: "claims",
              localField: "original_claim_id",
              foreignField: "_id",
              as: "original_claim_id"
            }
          },
          { $unwind: "$original_claim_id" },
          {
            $lookup: {
              from: "users",
              localField: "original_claim_id.user_id",
              foreignField: "_id",
              as: "original_claim_id.member_id"
            }
          },
          { $unwind: "$original_claim_id.member_id" },
          { $sort: sortObject },
          { $skip: offset },
          { $limit: pageSize },
          {
            $project: {
              _id: 1,
              internal_status: 1,
              dispute_status: 1,
              assigned_to_verifier: 1,
              verifier: 1,
              manager: 1,
              financer: 1,
              remark: 1,
              dispute: 1,
              subscriber_remark: 1,
              createdAt: 1,
              "original_claim_id._id": 1,
              "original_claim_id.claim_id": 1,
              "original_claim_id.doc_name": 1,
              "original_claim_id.hospital": 1,
              "original_claim_id.bill_amount": 1,
              "original_claim_id.claimable_amount": 1,
              "original_claim_id.internal_status": 1,
              "original_claim_id.member_id.name": 1,
              "original_claim_id.member_id.phone": 1,
              "original_claim_id.member_id.country_code": 1,
              "original_claim_id.opd_date": 1
            }
          }
        ];
      
        try {
          const resp = await DisputedClaimsDAL.Aggregate(aggregationPipeline);
          const totalCount = await DisputedClaimsDAL.GetClaimCount(matchStage.$match);
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
        } catch (error) {
          console.error("Error in GetDisputedClaims:", error);
          throw new ApiError("Failed to fetch disputed claims", StatusCodes.INTERNAL_SERVER_ERROR);
        }
      },
        
    
      GetDisputedClaim: async (user_id, _id) => {
        let data = await DisputedClaimsDAL.GetDisputeClaimManagement({ _id });
        const familyDetails = await FamilyDAL.GetMember({ _id: data.original_claim_id.member_id });
        
        if (!data) return null;
       
        const { name, _id : member_id, phone, country_code } = familyDetails;
        const tempData = JSON.parse(JSON.stringify(data));
        tempData.member_details = { name, member_id, phone, country_code };    
        tempData.files = await Promise.all(data.files.map(async (file) => await Utils.getFileURL(file)))    
        const receiptTypes = ['fee_receipt', 'prescription', 'pharmacy_receipt', 'test_receipt','test_reports'];
        console.log("tempData",tempData)
        await Promise.all(receiptTypes.map(async (type) => {
          if (Array.isArray(tempData.original_claim_id[type])) {
            tempData[type] = await Promise.all(tempData.original_claim_id[type].map(async (receipt) => {
              console.log("receipt",receipt)
              return await Utils.getFileURL(receipt);
            }));
          }
        }));
        console.log("tempData",tempData);
        return tempData;
      },

      ClaimDisputeAction: async (data, _id, managementUser) => {
        const isValidClaim = await DisputedClaimsDAL.GetDisputeClaim({ _id });
        if (!isValidClaim) {
          throw new ApiError(CONSTANTS_MESSAGES.CLAIM_NOT_FOUND, StatusCodes.NOT_FOUND);
        }
        const claimUser = await UserAuthDal.GetUser({_id:isValidClaim.original_claim_id.user_id},"name email phone");
       
        const { remark, approval_status } = data;
        const { internal_id: designation_id } = managementUser.designation;
        const management_user_id = managementUser._id;
        
        let internal_status, financer, verifier, manager, dispute_status,claim_closure_Date=null,temp;
        let assignQuery = {};
        if (isValidClaim.status === CONSTANTS.CLAIM.STATUS.APPROVED || isValidClaim.status === CONSTANTS.CLAIM.STATUS.REJECTED ) {
          throw new ApiError(CONSTANTS_MESSAGES.ACTION_ALREADY_TAKEN, StatusCodes.BAD_REQUEST);
        }
      
        if (approval_status===CONSTANTS.CLAIM.INTERNAL_STATUS.REJECTED) {
          switch (designation_id) {
            case CONSTANTS.DESIGNATIONS[3].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION ) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.REJECTED;
                dispute_status = CONSTANTS.CLAIM.DISPUTE_STATUS.REJECTED;
                verifier = management_user_id;
                claim_closure_Date= dayjs().toISOString();
              }
              Utils.CreateUserNotification( claimUser._id,NOTIFICATIONS.DISPUTE_REJECTED + isValidClaim.claim_id + "." );
              break;
            case CONSTANTS.DESIGNATIONS[1].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_VERIFIER ) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.REJECTED;
                dispute_status = CONSTANTS.CLAIM.DISPUTE_STATUS.REJECTED;
                manager = management_user_id;
                claim_closure_Date= dayjs().toISOString();
              }
              Utils.CreateUserNotification( claimUser._id,NOTIFICATIONS.DISPUTE_REJECTED + isValidClaim.claim_id + "." );
              break;
            case CONSTANTS.DESIGNATIONS[4].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_MANAGER ) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.REJECTED;
                dispute_status = CONSTANTS.CLAIM.DISPUTE_STATUS.REJECTED;
                financer = management_user_id;
                claim_closure_Date= dayjs().toISOString();
              }
              Utils.CreateUserNotification( claimUser._id,NOTIFICATIONS.DISPUTE_REJECTED + isValidClaim.claim_id + "." );
              break;
            case CONSTANTS.DESIGNATIONS[2].internal_id:
              if ( isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION ) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.REJECTED;
                dispute_status = CONSTANTS.CLAIM.DISPUTE_STATUS.REJECTED;
                verifier = management_user_id;
                manager = management_user_id;
                financer = management_user_id;
                claim_closure_Date= dayjs().toISOString();
              }
              Utils.CreateUserNotification( claimUser._id,NOTIFICATIONS.DISPUTE_REJECTED + isValidClaim.claim_id + "." );
              break;
            default:
              throw new ApiError(CONSTANTS_MESSAGES.FAILED_TO_UPDATE_CLAIM_STATUS, StatusCodes.BAD_REQUEST);
          }
        } else if( approval_status===CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED ) {
          switch (designation_id) {
            case CONSTANTS.DESIGNATIONS[3].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION ) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_VERIFIER;
                dispute_status = CONSTANTS.CLAIM.DISPUTE_STATUS.IN_PROCESS;
                temp = await Utils.AssignClaim({ internal_id: CONSTANTS.DESIGNATIONS[1].internal_id });
                assignQuery.assigned_to_manager = temp;
                verifier = management_user_id;
              }
              Utils.CreateUserNotification( claimUser._id,NOTIFICATIONS.CLAIM_INPROCESS + isValidClaim.claim_id + "." );
              Utils.CreateManagementNotification( temp ,"Disputed claim with claim ID: " + isValidClaim.claim_id + NOTIFICATIONS.DISPUTE_DUE_FOR_PROCESSING);
              break;
            case CONSTANTS.DESIGNATIONS[1].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_VERIFIER ) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_MANAGER;
                temp = await Utils.AssignClaim({ internal_id: CONSTANTS.DESIGNATIONS[4].internal_id });
                assignQuery.assigned_to_financer = temp;
                manager = management_user_id;
              }
              Utils.CreateManagementNotification( temp ,"Disputed claim with claim ID: " + isValidClaim.claim_id + NOTIFICATIONS.DISPUTE_DUE_FOR_PROCESSING);

              break;
            case CONSTANTS.DESIGNATIONS[4].internal_id:
              if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED_BY_MANAGER ) {
                internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED;
                dispute_status = CONSTANTS.CLAIM.DISPUTE_STATUS.APPROVED;
                financer = management_user_id;
                claim_closure_Date= dayjs().toISOString();
              }
              Utils.CreateUserNotification( claimUser._id,NOTIFICATIONS.DISPUTE_APPROVED + isValidClaim.claim_id + "." );
              break;
              case CONSTANTS.DESIGNATIONS[2].internal_id:
                if (isValidClaim.internal_status === CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION ) {
                  internal_status = CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED;
                  dispute_status = CONSTANTS.CLAIM.DISPUTE_STATUS.APPROVED;
                  verifier = management_user_id;
                  manager = management_user_id;
                  financer = management_user_id;
                }
                Utils.CreateUserNotification( claimUser._id,NOTIFICATIONS.DISPUTE_APPROVED + isValidClaim.claim_id + "." );
                break;
            default:
              throw new ApiError(CONSTANTS_MESSAGES.FAILED_TO_UPDATE_CLAIM_STATUS, StatusCodes.BAD_REQUEST);
          }
        }else{
          throw new ApiError(CONSTANTS_MESSAGES.FAILED_TO_UPDATE_CLAIM_STATUS, StatusCodes.BAD_REQUEST);
        }
      
        const modified_remark = {
          designation: designation_id,
          message: approval_status === CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED ? (remark ? remark : "Approved by " + CONSTANTS.DESIGNATIONS[designation_id].value) : remark,
          approver_id: management_user_id,
          message_claim_internal_status: internal_status
        }
        const modified_subscriber_remark = {
          designation: designation_id,
          approver_id: management_user_id,
          message_claim_internal_status: internal_status
        }
        let pushData={};
        pushData.remark = modified_remark;
        if (
          approval_status === CONSTANTS.CLAIM.INTERNAL_STATUS.REJECTED         
        ) {
          modified_subscriber_remark.message = remark;
          pushData.subscriber_remark = modified_subscriber_remark;
        }
        const finalData = {
          $push: pushData ,
          $set: { internal_status, internal_status,dispute_status, verifier, manager, financer,claim_closure_Date, ...assignQuery }
        };        
        const updateClaim = await DisputedClaimsDAL.EditClaimStatus({ _id }, finalData);

        let emailTemplate, templateData;
      emailTemplate = await EmailDal.GetOneEmail({});
  switch (approval_status) {
    case CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED :
      if (designation_id === CONSTANTS.DESIGNATIONS[2].internal_id ||
        designation_id === CONSTANTS.DESIGNATIONS[4].internal_id) {
          if(claimUser?.email){
            templateData = {
            name: claimUser.name,
            email: claimUser.email,
            template: emailTemplate?.dispute_approval_mail,
            claim_id: isValidClaim?.claim_id
          };
          Utils.sendBrevoMail.DisputeApproval({
            template:templateData.template,
            subject:`Dispute Status Update Dispute (ID: ${isValidClaim?.claim_id})`,
            user:{name:templateData.name,email:templateData.email},
            params:{name:templateData.name,claim_id:templateData.claim_id,status:"Approved"}
          });
        }
          if(claimUser?.phone){
            Utils.SendSMS.DisputeApproval({
              name:claimUser.name,phone:claimUser.phone,claim_id:isValidClaim.claim_id,status:"Approved"
            });
          }
      }
      
      break;
    case CONSTANTS.CLAIM.INTERNAL_STATUS.REJECTED:
      if(claimUser?.email)
        {templateData = {
        name: claimUser.name,
        email: claimUser.email,
        template: emailTemplate?.dispute_rejection_mail,
        claim_id: isValidClaim?.claim_id
      };
      Utils.sendBrevoMail.DisputeRejection({
        template:templateData.template,
        subject:`Dispute Status Update Dispute (ID: ${isValidClaim?.claim_id})`,
        user:{name:templateData.name,email:templateData.email},
        params:{name:templateData.name,claim_id:templateData.claim_id,status:"Rejected"}
      });
    }
      if(claimUser?.phone){
        Utils.SendSMS.DisputeRejection({
          name:claimUser.name,phone:claimUser.phone,claim_id:isValidClaim.claim_id,status:"Rejected"
        });
      }
      break;
    
    default:
       return updateClaim;
  }
    return updateClaim;
      },
     
      GetProfile: async (_id) => {
        const existingUser = await ManagementUserDal.GetUser({ _id }, "_id name email mobile designation country_code");
        if (!existingUser) {
            throw new ApiError(CONSTANTS_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
        }
        return existingUser;
    },

    GetHealthTests: async (data) => {
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
          name: { $regex: search, $options: "i" },
        };
      } else {
        searchQuery = {};
      }
      sortObject[sortBy] = parseInt(sortOrder);
      const pipeline = [
        { $match: searchQuery },
        { $sort: { ["createdAt"]: -1 } },
        { $skip: offset },
        { $limit: pageSize },
        {
          $lookup: {
            from: 'families',
            localField: 'member_id',
            foreignField: '_id',
            as: 'member_details'
          }
        },
        {
          $addFields: {
            member_details: { $arrayElemAt: ['$member_details', 0] }
          }
        }
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

 PayClaimAmount: async (management_user, data) => {

  const isUnauthorized = [CONSTANTS.DESIGNATIONS[1].internal_id, CONSTANTS.DESIGNATIONS[3].internal_id]
    .includes(management_user.designation.internal_id);

  if (isUnauthorized) {
    throw new ApiError(CONSTANTS_MESSAGES.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
  }

  const claim = await ClaimDAL.GetClaim({ _id: data.id });
  // console.log(claim)
  if (!claim) {
    throw new ApiError(CONSTANTS_MESSAGES.CLAIM_NOT_FOUND, StatusCodes.BAD_REQUEST);
  }

  if (claim.internal_status !== CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED) {
    throw new ApiError(CONSTANTS_MESSAGES.CLAIM_NOT_APPROVED, StatusCodes.BAD_REQUEST);
  }

  const user = await UserAuthDal.GetUser({ _id: claim.user_id }, 'name phone email wallet_balance');
  // console.log(user)
  if(claim.approved_claimable_amount){
  if(user.wallet_balance < claim.approved_claimable_amount ){
    throw new ApiError(CONSTANTS_MESSAGES.INSUFFICIENT_BALANCE, StatusCodes.BAD_REQUEST)
  }
  }else{
    if(user.wallet_balance < claim.claimable_amount ){
    throw new ApiError(CONSTANTS_MESSAGES.INSUFFICIENT_BALANCE, StatusCodes.BAD_REQUEST)
  }
  } 
  
  if(claim.approved_claimable_amount){
  await Promise.all([
    ClaimDAL.EditClaimStatus({
      _id: data.id
    }, {
      internal_status: CONSTANTS.CLAIM.INTERNAL_STATUS.SETTLED,
      status: CONSTANTS.CLAIM.STATUS.SETTLED,
      claim_closure_Date: dayjs().toISOString()
    }),
    WalletTransactionDal.AddWalletTransaction({
      user_id: claim.user_id,
      amount: claim.approved_claimable_amount,
      type: CONSTANTS.TRANSACTION.TYPE.DEBIT,
      claim_id: claim._id
    }),
    UserAuthDal.UpdateUser({
      _id: user._id
    }, {
      wallet_balance: user.wallet_balance - claim.approved_claimable_amount
    })
    
  ]);
 }else{
  await Promise.all([
    ClaimDAL.EditClaimStatus({
      _id: data.id
    }, {
      internal_status: CONSTANTS.CLAIM.INTERNAL_STATUS.SETTLED,
      status: CONSTANTS.CLAIM.STATUS.SETTLED,
      claim_closure_Date: dayjs().toISOString()
    }),
    WalletTransactionDal.AddWalletTransaction({
      user_id: claim.user_id,
      amount: claim.claimable_amount,
      type: CONSTANTS.TRANSACTION.TYPE.DEBIT,
      claim_id: claim._id
    }),
    UserAuthDal.UpdateUser({
      _id: user._id
    }, {
      wallet_balance: user.wallet_balance - claim.claimable_amount
    })
    
  ]);
 }

  // await Utils.PayAmount(claim.approved_claimable_amount, user);
  Utils.CreateUserNotification( user._id, NOTIFICATIONS.CLAIM_SETTLED + claim.claim_id + "." );
   emailTemplate = await EmailDal.GetOneEmail({});
   templateData = {
    name: user.name,
    email: user.email,
    template: emailTemplate?.claim_settled_mail,
    claim_id: claim.claim_id
  };
  if(user.email){
    Utils.sendBrevoMail.ClaimApproval({
      template:templateData.template,
      subject:`Payment Released for Your Claim (ID: ${claim.claim_id})`,
      user:{name:templateData.name,email:templateData.email},
      params:{name:templateData.name,claim_id:templateData.claim_id}
    });
  }
  if(user.phone){
    Utils.SendSMS.ClaimSettled({
      name:user.name,phone:user.phone,claim_id:claim.claim_id
    });
  } 
  return { pay: 'Done' };
  },

  PayDisputedClaimAmount: async (management_user, data) => {

    const isUnauthorized = [CONSTANTS.DESIGNATIONS[1].internal_id, CONSTANTS.DESIGNATIONS[3].internal_id]
      .includes(management_user.designation.internal_id);

    if (isUnauthorized) {
      throw new ApiError(CONSTANTS_MESSAGES.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
    }

    const claim = await DisputedClaimsDAL.GetDisputeClaim({ _id: data.id });

    if (!claim) {
      throw new ApiError(CONSTANTS_MESSAGES.CLAIM_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }

    if (claim.internal_status !== CONSTANTS.CLAIM.INTERNAL_STATUS.APPROVED) {
      throw new ApiError(CONSTANTS_MESSAGES.DISPUTE_NOT_APPROVED, StatusCodes.BAD_REQUEST);
    }

    const user = await UserAuthDal.GetUser({ _id: claim.user_id }, 'name phone email wallet_balance');
    if(user.wallet_balance < claim.claimable_amount ){
     throw new ApiError(CONSTANTS_MESSAGES.INSUFFICIENT_BALANCE, StatusCodes.BAD_REQUEST)
    }
    await Promise.all([
      DisputedClaimsDAL.EditClaimStatus({
        _id: data.id
      }, {
        internal_status: CONSTANTS.CLAIM.INTERNAL_STATUS.SETTLED,
        status: CONSTANTS.CLAIM.DISPUTE_STATUS.SETTLED,
        claim_closure_Date: dayjs().toISOString()
      }),
      WalletTransactionDal.AddWalletTransaction({
        user_id: claim.user_id,
        amount: claim.claimable_amount,
        type: CONSTANTS.TRANSACTION.TYPE.DEBIT,
        claim_id: claim._id
      }),
      UserAuthDal.UpdateUser({
        _id: user._id
      },{
        wallet_balance: user.wallet_balance - claim.claimable_amount
      })
    ]);

    await Utils.PayAmount(claim.claimable_amount, user);
    Utils.CreateUserNotification( user._id, `${NOTIFICATIONS.DISPUTE_SETTLED} ${claim.claim_id}. ₹ ${claim.claimable_amount} released.` );
    Utils.CreateUserNotification( user._id, NOTIFICATIONS.CLAIM_SETTLED + claim.claim_id + "." );
   emailTemplate = await EmailDal.GetOneEmail({});
   templateData = {
    name:user.name,
    email: user.email,
    template: emailTemplate?.claim_settled_mail,
    claim_id: claim.claim_id
  };
  Utils.sendBrevoMail.ClaimApproval({
    template:templateData.template,
    subject:`Your claim with ${claim?.claim_id} is settled`,
    user:{name:templateData.name,email:templateData.email},
    params:{name:templateData.name,claim_id:templateData.claim_id}
  });
    return { pay: 'Done' };
  },
    
    GetVerifiers: async () =>{
      const verifierDesignation = await DesigDal.CheckUniqueDesignation({ internal_id: CONSTANTS.DESIGNATIONS[3].internal_id });
      if (!verifierDesignation) {
        throw new ApiError(CONSTANTS_MESSAGES.VERIFIER_NOT_FOUND, StatusCodes.BAD_REQUEST);
      }
      return await ManagementUserDal.GetVerifierUsers( {designation: verifierDesignation._id}, "-token -createdAt -updatedAt -__v");  
    },
   
    UpdateClaimVerifier : async (claims) => {
     const updateMultiple = claims.map(async ({ claim_id, verifier_id }) => {

      const isValidClaim = await ClaimDAL.GetClaim({ _id: claim_id });
      if (!isValidClaim) {
         throw new ApiError(CONSTANTS_MESSAGES.CLAIM_NOT_FOUND, StatusCodes.NOT_FOUND);
      }
      if (isValidClaim.internal_status !== CONSTANTS.CLAIM.INTERNAL_STATUS.NO_ACTION &&
        isValidClaim.internal_status !== CONSTANTS.CLAIM.INTERNAL_STATUS.CLARIFICATION) {
        throw new ApiError(CONSTANTS_MESSAGES.VERIFIER_NOT_TRANSFERABLE, StatusCodes.NOT_FOUND);
    }
      const finalData = { assigned_to_verifier: verifier_id };
      return await ClaimDAL.EditClaimStatus({ _id: claim_id }, finalData);
     });

     return Promise.all(updateMultiple);
    },

    GetNotifications: async (user_id,data) => {
      const { page=1, pageSize=1000, sortBy="createdAt", sortOrder="-1"} = data;
      const offset = (page - 1) * pageSize;
      const sortObject = {};
      let searchQuery = {};
      searchQuery.user = user_id;
      sortObject[sortBy] = parseInt(sortOrder);
      const pagination = { offset, sortObject, pageSize, searchQuery }
      const resp = await ManagementNotificationsDAL.GetAllNotifications(searchQuery, "", pagination);    
      return {
        records: resp,
      };
    },
  
    DeleteNotification: async (_id) => {
      
      await ManagementNotificationsDAL.DeleteNotifications({ _id });    
      return {};
    },

    ResetManagPassword : async (data) =>{
      const {email} = data;
      const existingUser = await ManagementUserDal.GetUser(
        { email },
        "_id email name"
      );
      if (!existingUser) {
        throw new ApiError(
          CONSTANTS_MESSAGES.USER_NOT_FOUND,
          StatusCodes.NOT_FOUND
        );
      }else{
        const randomKey = crypto.randomBytes(24).toString('hex').slice(0, 24);
        Utils.sendBrevoMail.ResetManagPass({
          template: `To recover your account click the following link: <a href="{{params.link}}">Recover Account</a>. The link is valid for 10 minutes.`,
          subject: `Recover account`,
          user: {name:existingUser?.name, email:existingUser?.email},
          params:{name:existingUser?.name, link:`${process.env.FRONTEND_URL}/management/recover?email=${existingUser.email}&key=${randomKey}`}
        });
        await ResetPassDal.saveRequest({email:existingUser.email,key:randomKey})
      }
      return {};
    },
  
    ResetManagPasswordDetails : async (data) =>{
      const {email,password,key} = data;
      const existingUser = await ManagementUserDal.GetUser(
        { email },
        "_id email"
      );
      if (!existingUser) {
        throw new ApiError(
          CONSTANTS_MESSAGES.ADMIN_NOT_FOUND,
          StatusCodes.NOT_FOUND
        );
      }else{
        const validRequest = await ResetPassDal.getRequest({email,key});
        if(!validRequest){
          throw new ApiError(
            CONSTANTS_MESSAGES.INVALID_PASS_REQ,
            StatusCodes.BAD_REQUEST
          );
        }
        const hashedPass = await Utils.GenerateHashedPassword(password);
        await ResetPassDal.deleteRequest({email})
        return await ManagementUserDal.EditUser({email},{password:hashedPass});
      }
    },

    GetAllRegisteredUsers: async (data) => {
      const {
        search,
        page = 1,
        pageSize = 10,
        sortBy = "createdAt",
        sortOrder = -1,
        subscriberTypeStatus = "ALL",
      } = data;
    
      const offset = (page - 1) * pageSize;
      const sortObject = {};
      let searchQuery = {
        "plan.purchased": false  // 🟢 Only not purchased plans
      };
    
      if (search) {
        searchQuery.name = { $regex: search, $options: "i" };
      }
    
      if (subscriberTypeStatus && subscriberTypeStatus !== "ALL") {
        searchQuery.subscriber_type = Number(subscriberTypeStatus);
      }
    
      sortObject[sortBy] = parseInt(sortOrder);
      const pagination = { offset, sortObject, pageSize, searchQuery };
    
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
    
    
    GetUsers: async () => {
      // Fetch only users with plan not purchased
      const query = { "plan.purchased": false };
      const records = await UserAuthDal.GetUsersMan(query, "-token");
  
      return {
          records,
          totalRecords: records.length, // Return total count
          message: "All non-plan-purchased users fetched successfully"
      };
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
  
};

module.exports = ManagementService;