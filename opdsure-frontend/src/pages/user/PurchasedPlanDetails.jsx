// import React, { useEffect, useState } from "react";
// import config from "../../config/config";
// import { Axios } from "../../axios/axiosFunctions";
// import useAxiosFetch from "../../hooks/useAxiosFetch";
// import { Link } from "react-router-dom";
// import {Button} from "antd";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
// import { CheckCircleOutlined,TeamOutlined,PlusOutlined, } from "@ant-design/icons";
// import profileicon from "../../assets/profileicon1.png";
// import confettibig from "../../assets/Confettibig.png";
// import { Utils } from "../../utils";
// import dayjs from "dayjs";
// import CONSTANTS from "../../constant/Constants";
// import { useAuth } from "../../context/authProvider";
// const PurchasedPlanDetails = () => {
//   const { data: planDetails } = useAxiosFetch(config.GetSubscribedPlan);

//   const [profileData, setProfileData] = useState({});
//   const [planExpired,setPlanExpired] = useState(false);
//   const { setSubscriberType, setCorporate, subscriberType } = useAuth();
//   const fetchProfileData = async () => {  
//     try {
//       const time = await Axios.fetchAxiosData(config.CurrentTime);
     
//       const response = await Axios.fetchAxiosData(config.GetProfile);
//       setProfileData(response?.data);      
//       if(dayjs(response?.data.plan?.end_date).isBefore(time.data)) setPlanExpired(true)
//     } catch (error) {
//       setPlanExpired(false)
//     }
   
// };
  
//   useEffect(() => {
//     fetchProfileData();
//   }, []);

//  const GstInclCharges = (planDetails?.membership_options?.charges) +((planDetails?.membership_options?.charges) * CONSTANTS.PAYMENT.GST)/100

//  return (
//     <>
    
//       {/* new design */}
//       <div className="container">
//         {/* <div className="row">
//           <h3>Purchased Plan</h3>
//         </div> */}
//          {profileData.subscriber_type === CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL  && <div className="row d-flex justify-content-end">
         
//          {planExpired ? 
         
//           (
//           <div className="col-1  mt-3" style={{marginRight:"6.5rem"}} >
//           <Link to={`/user/plans`}>
//             <Button type="primary" >
//               <PlusOutlined />
//               Repurchase Plan
//             </Button>
//           </Link>
//         </div>)
//          : 
//          (
//           <div className="row d-flex justify-content-end">
//             <div className="col-1 me-5 mt-3 me-2" >
//            <Link to={`/user/plan-renew`}>
//              <Button type="primary" disabled={planExpired} >
//                <PlusOutlined />
//                Renew Plan
//              </Button>
//            </Link>
//             </div>
//             <div className="col-1 mt-3" style={{marginRight:"5rem"}}>
//            <Link to={`/user/plan-upgrade`}>
//              <Button type="primary" disabled={planExpired} >
//                <PlusOutlined />
//                Upgrade Plan
//              </Button>
//            </Link>
//             </div>
//           </div>
//          )}
//        </div>}
//         <div className="row mt-2">
//           <div className="col-2 my-auto">
//             <div className="d-flex align-items-center justify-content-evenly rounded-top-2 p-2" style={{backgroundColor:"#486ab3"}}>
//             {planDetails?.membership_options?.member_count === 1
//               ? <img src={profileicon} alt="profile icon" width={20} height={20} />
//               : <TeamOutlined className="text-white fs-5"/>}
              
//               <p className="text-white my-auto">{planDetails?.membership_options?.member_count === 1
//               ? "Individual"
//               : "Family"}</p>
//             </div>
//           </div>
//         </div>

//         <div className="row">

//           <div className="col-4">
//             <div className="card">
//               <div className="card-body">
//                 {profileData.subscriber_type == CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL && <h5 className="textblue fw-bold">{planDetails?.name}</h5>}
//                 {profileData.subscriber_type == CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL && <><h4 className="card-title fw-bold mb-4"> 
//                   ₹&nbsp;{GstInclCharges?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}/ {planDetails?.frequency === 1
//                       ? "Yearly"
//                       : planDetails?.frequency === 2
//                       ? "Half Yearly"
//                       : planDetails?.frequency === 3
//                       ? "Quarterly"
//                       : planDetails?.frequency === 4
//                       ? "Yearly"
//                       : ""}<span className="textblue fs-6 ms-3">(Incl. GST)</span></h4>
                
//                 <p className="card-subtitle mb-2">
//                 Billed&nbsp;
//                     {planDetails?.frequency === 1
//                       ? "Yearly"
//                       : planDetails?.frequency === 2
//                       ? "Half Yearly"
//                       : planDetails?.frequency === 3
//                       ? "Quarterly"
//                       : planDetails?.frequency === 4
//                       ? "Yearly"
//                       : ""}
//                 </p></>}
//                 <h6 className="card-text text-center">
//                  Maximum Reward of
//                 </h6>
//                 <div className="d-flex justify-content-center align-items-end mb-5">
//                   <img src={confettibig} alt="confetti" width={60} height={60}/>
//                   <h5 className="text-center textblue fw-bold">₹&nbsp;{planDetails?.membership_options?.wallet_balance.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h5>

//                   <img src={confettibig} alt="confetti" width={60} height={60}/>
//                 </div>

//                 <div className="d-flex justify-content-between align-items-center text-small">
//                   <div style={{lineHeight:0.2}}>
//                   <p className="fw-bold textblue">Purchased On: </p>
//                   <p>{Utils.DateFormat(profileData?.plan?.start_date)}</p>
//                   </div>
//                   <div style={{lineHeight:0.2}}>
//                   <p className="fw-bold textblue">Valid till: </p>                 
//                    <p>{Utils.DateFormat(profileData?.plan?.end_date)}</p>
//                    </div>

//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="col-8">
//           <div className="card" style={{ height: "100%" }}>
//               <div className="card-body">
//                 <h5 className=" mb-2 textblue fw-bold">Plan Benefits</h5>
               
//                 <div className="card-text" style={{
//                 height: "60vh",
//                 overflow: "auto",
//                 scrollbarWidth: "thin",
//                 scrollbarColor: "#486ab3 #ffffff",
//               }}>
//                 <ul className="list-with-icons">
//                 {planDetails?.plan_benefits?.map((benefit, index) => (
//                   <li className="list-item" key={index}>
//                     <CheckCircleOutlined className="list-icon text-purple" />
//                     <p>
//                       <span className="fw-bold">{benefit?.plan_label}</span>
//                       &nbsp;-&nbsp;{benefit?.plan_feature}
//                     </p>
//                   </li>
//                 ))}
//               </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PurchasedPlanDetails;



import React, { useEffect, useState } from "react";
import config from "../../config/config";
import { Axios } from "../../axios/axiosFunctions";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { CheckCircleOutlined, TeamOutlined, PlusOutlined } from "@ant-design/icons";
import profileicon from "../../assets/profileicon1.png";
import confettibig from "../../assets/Confettibig.png";
import { Utils } from "../../utils";
import dayjs from "dayjs";
import CONSTANTS from "../../constant/Constants";
import { useAuth } from "../../context/authProvider";

const PurchasedPlanDetails = () => {
  const { data: planDetails } = useAxiosFetch(config.GetSubscribedPlan);
  const [profileData, setProfileData] = useState({});
  const [planExpired, setPlanExpired] = useState(false);
  const { setSubscriberType, setCorporate, subscriberType } = useAuth();

  const fetchProfileData = async () => {
    try {
      const time = await Axios.fetchAxiosData(config.CurrentTime);
      const response = await Axios.fetchAxiosData(config.GetProfile);
      setProfileData(response?.data);
      if (dayjs(response?.data.plan?.end_date).isBefore(time.data)) setPlanExpired(true);
    } catch (error) {
      setPlanExpired(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const GstInclCharges =
    Math.round(planDetails?.membership_options?.charges +
    (planDetails?.membership_options?.charges * CONSTANTS.PAYMENT.GST) / 100);

  return (
    <>
      <div className="container">
        {profileData.subscriber_type === CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL && (
          <div className="row d-flex justify-content-end mt-3">
            {planExpired ? (
              <div className="col-auto">
                <Link to={`/user/plans`}>
                  <Button type="primary">
                    <PlusOutlined />
                    Repurchase Plan
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="col-auto my-2">
                  <Link to={`/user/plan-renew`}>
                    <Button type="primary">
                      <PlusOutlined />
                      Renew Plan
                    </Button>
                  </Link>
                </div>
                <div className="col-auto my-2">
                  <Link to={`/user/plan-upgrade`}>
                    <Button type="primary">
                      <PlusOutlined />
                      Upgrade Plan
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
        <div className="row mt-2">
          <div className="col-lg-2 col-md-3 col-sm-4 mb-3">
            <div
              className="d-flex align-items-center justify-content-evenly rounded-top-2 p-2"
              style={{ backgroundColor: "#486ab3" }}
            >
              {planDetails?.membership_options?.member_count === 1 ? (
                <img src={profileicon} alt="profile icon" width={20} height={20} />
              ) : (
                <TeamOutlined className="text-white fs-5" />
              )}
              <p className="text-white my-auto">
                {planDetails?.membership_options?.member_count === 1
                  ? "Individual"
                  : "Family"}
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                {profileData.subscriber_type === CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL && (
                  <>
                    <h5 className="textblue fw-bold">{planDetails?.name}</h5>
                    <h4 className="card-title fw-bold mb-4">
                      ₹&nbsp;
                      {GstInclCharges?.toLocaleString("en-IN",
                       {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                      )}
                      /{" "}
                      {planDetails?.frequency === 1
                        ? "Yearly"
                        : planDetails?.frequency === 2
                        ? "Half Yearly"
                        : planDetails?.frequency === 3
                        ? "Quarterly"
                        : ""}
                      <span className="textblue fs-6 ms-3">(Incl. GST)</span>
                    </h4>
                    <p className="card-subtitle mb-2">
                      Billed{" "}
                      {planDetails?.frequency === 1
                        ? "Yearly"
                        : planDetails?.frequency === 2
                        ? "Half Yearly"
                        : planDetails?.frequency === 3
                        ? "Quarterly"
                        : ""}
                    </p>
                  </>
                )}
                <h6 className="card-text text-center">Maximum Reward of</h6>
                <div className="d-flex justify-content-center align-items-end mb-5">
                  <img src={confettibig} alt="confetti" width={60} height={60} />
                  <h5 className="textcenter textblue fw-bold">
                    ₹&nbsp;
                    {planDetails?.membership_options?.wallet_balance.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h5>
                  <img src={confettibig} alt="confetti" width={60} height={60} />
                </div>
                <div className="d-flex justify-content-between align-items-center text-small">
                  <div>
                    <p className="fw-bold textblue">Purchased On: </p>
                    <p>{Utils.DateFormat(profileData?.plan?.start_date)}</p>
                  </div>
                  <div>
                    <p className="fw-bold textblue">Valid till: </p>
                    <p>{Utils.DateFormat(profileData?.plan?.end_date)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8 col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="mb-2 textblue fw-bold">Plan Benefits</h5>
                <div
                  className="card-text"
                  style={{
                    height: "60vh",
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#486ab3 #ffffff",
                  }}
                >
                  <ul className="list-with-icons">
                    {planDetails?.plan_benefits?.map((benefit, index) => (
                      <li className="list-item" key={index}>
                        <CheckCircleOutlined className="list-icon text-purple" />
                        <p>
                          <span className="fw-bold">{benefit?.plan_label}</span>
                          &nbsp;-&nbsp;{benefit?.plan_feature}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchasedPlanDetails;

