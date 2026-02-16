const { user, planRenewList, plans, family, walletTransaction, userNotifications } = require("../models");
const { FamilyDAL, WalletTransactionDal, PlanRenewDal,PlanDal, UserAuthDal, EmailDal  } = require("../DAL");
const cron = require('node-cron');
const { CONSTANTS } = require("../Constant/");
const dayjs = require("dayjs");
const { Utils } = require("../Utils");
const { CONSTANTS_MESSAGES, NOTIFICATIONS } = require("../Helper");
const GetExtendedDays = require("../Utils/GetExtendedDays");
const PAGE_SIZE = 2;

async function processPage(pageNumber,emailTemplate) {

  const usersList = await user.find({},"wallet_balance plan email country_code phone name")
    .sort({ _id: 1 }) 
    .skip(PAGE_SIZE * (pageNumber - 1))
    .limit(PAGE_SIZE)
    .lean();
  const daysToCheck = [60, 30, 15, 7, 1];
  if (usersList.length === 0) {
    console.log(`No more users to process for page ${pageNumber}.`);
    return false;
  }
  
  for (const user of usersList) {

    if(!user.plan.purchased){
      // console.log("diffInDays for old or invalid dates",diffInDays)
      console.log(`plan is not purchased cound send email randomly to ${user.email}`);
      // if(user.email == "lml@gmail.com") {
      //     console.log(`lml found has not purchased plan \n\n\n\n\n\n`);
      //     // console.log("diff in days for lml",diffInDays)
      // }
      Utils.CreateUserNotification(user._id, NOTIFICATIONS.PLAN_EXPIRED+"first");
      // continue;
    }else{
      
      console.log("Checking user if has plan and plan will expire or not")
      let diffInDays = -1;
      if(user.plan.end_date) diffInDays = dayjs().diff(user.plan.end_date,"d");
      // console.log("user",user)
      // console.log("diffInDays",diffInDays)
      if(diffInDays>=0){
        
        await WalletTransactionDal.AddWalletTransaction({
          user_id: user._id,
          amount: user.wallet_balance,
          type: CONSTANTS.TRANSACTION.TYPE.DEBIT,
          plan_id: user.plan.id
        })  

        if (user && user?.email) {
          Utils.sendBrevoMail.PlanExpired({
            template: emailTemplate?.plan_expiry_mail,
            subject: `Your current plan expired.`,
            user: {name:user.name, email:user.email},
            params:{name:user.name}
          });
        }
      if(user?.phone){
        Utils.SendSMS.PlanExpired({
          name:user.name,phone:user.phone
        });
      }
      
        const queuedPlan = await planRenewList.findOne({ user_id: user._id, activated: false })
        .sort({ createdAt: 1 })
        .limit(1)
        .lean();
    
        if (queuedPlan) {
        //   if(user.email == "lml@gmail.com") {
        //   console.log(`lml found in queued plan list will be activating plan from list \n\n\n\n\n\n`);
        //   console.log("diff in days for lml",diffInDays)
        // }
          // console.log("user",user.email)
          // console.log("queuedPlan",queuedPlan)
          const selectedPlan = await PlanDal.GetPlan({_id:queuedPlan.plan_id},"frequency membership_options name");
          // console.log("selectedPlan",selectedPlan)
          const subscribedOption = selectedPlan.membership_options.find(p=> p.membership_id === queuedPlan.membership_id);
          const walletBalance = subscribedOption.wallet_balance;
          // console.log("subscribedOption",subscribedOption)
          // console.log("walletBalance",walletBalance)
          let allowedPaidMembers = subscribedOption.member_count-1;
          await family.updateMany({ user_id: user._id, relation:{$ne:CONSTANTS.FAMILY_RELATION.SELF} }, {  $set: {plan_status: CONSTANTS.PLAN_STATUS.UNPAID} });
          let familyList = await FamilyDAL.GetMembers({user_id:user._id,relation:{$ne:CONSTANTS.FAMILY_RELATION.SELF}});      
          let updatePromises = [];
          for (const f of familyList) {
            if (allowedPaidMembers === 0) break; 
            if (f.plan_status === CONSTANTS.PLAN_STATUS.UNPAID) {
              updatePromises.push(FamilyDAL.UpdateMember(
              { _id: f._id }, 
              { plan_status: CONSTANTS.PLAN_STATUS.PAID }
            ));
            allowedPaidMembers--;
         }
        }
        await Promise.all(updatePromises);
        const extendedValidDays = GetExtendedDays(selectedPlan.frequency);     
     
        await UserAuthDal.UpdateUser(
          { _id: user._id },
          {
            $set: {
              'plan.purchased': true,
              'plan.id': queuedPlan.plan_id,
              'plan.membership_id': queuedPlan.membership_id,
              'plan.start_date': dayjs().toISOString(),
              'plan.end_date': dayjs().add(extendedValidDays,"d").toISOString(),
              'wallet_balance': walletBalance,
              'plan.paid_price': (queuedPlan.paid_price).toFixed(2)
            },
          });
          await WalletTransactionDal.AddWalletTransaction({
            user_id: user._id,
            amount: walletBalance,
            type: CONSTANTS.TRANSACTION.TYPE.CREDIT,
            plan_id: queuedPlan.plan_id
          })  
         
          PlanRenewDal.UpdateQueuedPlan({_id:queuedPlan._id},{activated:true});

          console.log(`Updated user ${user._id} with new plan details.`);
          console.log("email & sms sending after activating plan");
          Utils.CreateUserNotification(user._id,`Plan ${selectedPlan.name} has been activated. Your wallet balance and benefits have been updated.`);
          if (user && user.email) {
            Utils.sendBrevoMail.PlanRenew({
              template: emailTemplate?.plan_renew_mail,
              subject: `Your plan has been renewed.`,
              user: {name:user.name, email:user.email},
              params:{name:user.name,plan_name:selectedPlan.name}
            });
        }
        if(user?.phone){
          Utils.SendSMS.PlanRenew({
            name:user.name,phone:user.phone,plan_name:selectedPlan.name
          });
        }
        }else{   
          if(user.email == "lml@gmail.com") {
            console.log(`lml not found in queued plans list\n\n\n\n\n\n`);
          }
          console.log(`${user._id} with ${user.email} user does not have any plan scheduled for activation sending email and sms to user and expiring his plan`);
          await UserAuthDal.UpdateUser(
            { _id: user._id },
            {
              $set: {
                'plan.purchased': false,
                'wallet_balance': 0
              },
            });
          // const familyList = await family.find({user_id:user._id});
          // console.log("family",familyList);
          await family.updateMany({ user_id: user._id }, {  $set: {plan_status: CONSTANTS.PLAN_STATUS.UNPAID} });
          Utils.CreateUserNotification(user._id, NOTIFICATIONS.PLAN_EXPIRED);

        }
      }
      else{
        // console.log("diffInDays for old or invalid dates",diffInDays)
        console.log(`plan has not expired`);
        if(daysToCheck.includes(abs(diffInDays))){
          console.log("Sending reminder email")
        }
        // if(user.email == "lml@gmail.com") {
        //   console.log(`lml found \n\n\n\n\n\n`);
        //   console.log("diff in days for lml",diffInDays)
        // }
      }
    }
   
   
  }

  return true;
}

async function processExpiredPlans(emailTemplate) {
  let pageNumber = 1;
  console.clear();
  while (true) {
    console.log(`Processing page ${pageNumber}...`);
    const hasMorePages = await processPage(pageNumber,emailTemplate);

    if (!hasMorePages) {
      break;
    }

    pageNumber++;
  }
}

cron.schedule('0 3 * * *', async () => {
  
  try {
    // console.log('Task running at', new Date().toISOString());
    const emailTemplate = await EmailDal.GetOneEmail({});
    // await processExpiredPlans(emailTemplate);
  } catch (err) {
    console.error('Error processing expired plans:', err);
  }
  
});

