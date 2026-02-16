// import React, { useState, useEffect } from "react";
// import { Axios } from "../../axios/axiosFunctions";
// import config from "../../config/config";
// import { Utils } from "../../utils";
// import { Col, Row } from "antd";

// const QueuedPlanDetails = () => {
//   const fetchQueuePlanData = async () => {
//     const response = await Axios.fetchAxiosData(config.GetQueuedPlan);
//     setQueuedPlanData(response?.data?.records);
//     const options =
//       response?.data?.records?.flatMap(
//         (plan) => plan.plan_id.membership_options
//       ) || [];
//     setMembershipOptions(options);
//   };

//   useEffect(() => {
//     fetchQueuePlanData();
//   }, []);

//   const [queuedPlanData, setQueuedPlanData] = useState([]);
//   const [membershipOptions, setMembershipOptions] = useState([]);

//   function getMembershipDetails(membershipId) {
//     return membershipOptions.find(
//       (option) => option.membership_id === membershipId
//     );
//   }
//   if(queuedPlanData.length === 0){
//     return (
//       <>
//       <br/>
//       <br/>
//       <Row justify={"center"}>
//         <Col>
//       <h6>No plans purchased</h6>

//         </Col>
//       </Row>
//       </>
//     )
//   }
//   return (
//     <>
//       <div className="container-fluid">
//         <div className="row mt-5">
//           {queuedPlanData?.map((plan, index) => (
//             <div key={plan?._id} className="col-12 mt-3">
//               <div className="card bg-gradient-light card-shadow border-0">
//                 <div className="card-body">
//                     <div className="d-flex justify-content-between">
//                     <h3 className="card-title text-153780">
//                     {plan?.plan_id?.name}
//                   </h3>
//                   <h6 className="rounded-pill p-2 bg-5dadec text-white">{plan?.activated=== false ? "Queued":"Activated"}</h6>
//                     </div>

//                   <p className="card-subtitle mb-2 text-body-secondary">
//                     Price Paid - ₹{plan?.paid_price} (incl. GST) | Purchased on -{" "}
//                     {Utils.DateFormat(plan?.createdAt)}
//                   </p>
//                   <hr />
//                   <p className="card-text">
//                     {(() => {
//                       const membershipDetail = getMembershipDetails(
//                         plan?.membership_id
//                       );
//                       return membershipDetail ? (
//                         <>
//                           <strong className="text-153780">
//                             Membership Label:
//                           </strong>{" "}
//                           {membershipDetail.membership_label}
//                           <br />
//                           <strong className="text-153780">
//                             Member Count:
//                           </strong>{" "}
//                           {membershipDetail.member_count}
//                           <br />

//                         </>
//                       ) : (
//                         "Membership details not found."
//                       );
//                     })()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default QueuedPlanDetails;

import React, { useState, useEffect } from "react";
import { Axios } from "../../axios/axiosFunctions";
import config from "../../config/config";
import { Utils } from "../../utils";
import { Col, Row } from "antd";

const QueuedPlanDetails = () => {
  const fetchQueuePlanData = async () => {
    const response = await Axios.fetchAxiosData(config.GetQueuedPlan);
    setQueuedPlanData(response?.data?.records);
    const options =
      response?.data?.records?.flatMap(
        (plan) => plan.plan_id.membership_options
      ) || [];
    setMembershipOptions(options);
  };

  useEffect(() => {
    fetchQueuePlanData();
  }, []);

  const [queuedPlanData, setQueuedPlanData] = useState([]);
  const [membershipOptions, setMembershipOptions] = useState([]);

  function getMembershipDetails(membershipId) {
    return membershipOptions.find(
      (option) => option.membership_id === membershipId
    );
  }

  if (queuedPlanData.length === 0) {
    return (
      <>
        <br />
        <br />
        <Row justify={"center"}>
          <Col>
            <h6>No plans purchased</h6>
          </Col>
        </Row>
      </>
    );
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row mt-5">
          {queuedPlanData?.map((plan, index) => (
            <div
              key={plan?._id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 mt-3"
            >
              <div className="card bg-gradient-light card-shadow border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h3 className="card-title text-153780">
                      {plan?.plan_id?.name}
                    </h3>
                    <h6 className="rounded-pill p-2 bg-5dadec text-white">
                      {plan?.activated === false ? "Queued" : "Activated"}
                    </h6>
                  </div>

                  <p className="card-subtitle mb-2 text-body-secondary">
                    Price Paid - ₹{plan?.paid_price} (incl. GST) | Purchased on
                    - {Utils.DateFormat(plan?.createdAt)}
                  </p>
                  <hr />
                  <p className="card-text">
                    {(() => {
                      const membershipDetail = getMembershipDetails(
                        plan?.membership_id
                      );
                      return membershipDetail ? (
                        <>
                          <strong className="text-153780">
                            Membership Label:
                          </strong>{" "}
                          {membershipDetail.membership_label}
                          <br />
                          <strong className="text-153780">
                            Member Count:
                          </strong>{" "}
                          {membershipDetail.member_count}
                          <br />
                        </>
                      ) : (
                        "Membership details not found."
                      );
                    })()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default QueuedPlanDetails;
