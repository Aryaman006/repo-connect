// import React, { useEffect, useState } from "react";
// import config from "../../config/config";
// import { Axios } from "../../axios/axiosFunctions";
// import useAxiosFetch from "../../hooks/useAxiosFetch";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
// import { CheckCircleOutlined } from "@ant-design/icons";
// import profileicon from "../../assets/profileicon1.png";
// import confettibig from "../../assets/Confettibig.png";
// import { useNavigate } from "react-router-dom";
// import { Utils } from "../../utils";
// import { Pagination, Row, Col, Collapse, theme, DatePicker } from "antd";
// import dayjs from "dayjs";
// const { Panel } = Collapse;
// const { RangePicker } = DatePicker;

// const PurchasedPlanDetails = () => {
//   const navigate = useNavigate();
//   const { token } = theme.useToken();
//   const [profileData, setProfileData] = useState({});
//   const [planDetails, setPlanDetails] = useState([]);
//   const [startDate, setStartDate] = useState(
//     dayjs().subtract(30, "day").startOf("day").toISOString()
//   );
//   const [endDate, setEndDate] = useState(dayjs().endOf("day").toISOString());
//   const [pagination, setPagination] = useState({
//     totalRecords: 0,
//     pageSize: 10,
//     totalPages: 0,
//     currentPage: 1,
//     nextPage: null,
//     prevPage: null,
//   });

//   const fetchPurchasedPlanData = async () => {
//     const response = await Axios.fetchAxiosData(config.GetPurchasedHealthCheckups,
//       {
//         params: {
//           page: pagination.currentPage,
//           pageSize: pagination.pageSize,
//           sortBy: "createdAt",
//           startDate: startDate,
//           endDate: endDate,
//         }

//       },
//     );
//     setPlanDetails(response?.data?.records || []);
//     const {
//       totalRecords,
//       totalPages,
//       currentPage,
//       nextPage,
//       prevPage,
//       pageSize,
//     } = response.data.pagination;

//     setPagination((prevState) => ({
//       ...prevState,
//       totalRecords: totalRecords,
//       totalPages: totalPages,
//       pageSize: pageSize,
//       currentPage: currentPage,
//       nextPage: nextPage,
//       prevPage: prevPage,
//     }));
//   };

//   useEffect(() => {
//     fetchPurchasedPlanData();
//   }, [pagination.currentPage, pagination.pageSize,startDate,endDate]);

//   const disabledDate = (current) => {
//     return current && current >= dayjs().endOf("day");
//   };

//   const handlePageChange = (page) => {
//     setPagination((prevState) => ({
//       ...prevState,
//       currentPage: page,
//     }));
//   };

//   const pageSizeChange = (current, pageSize) => {
//     setPagination((prevState) => ({
//       ...prevState,
//       pageSize: pageSize,
//     }));
//   };

//   const handleNavigate = (id) => {
//     console.log("id",id)
//     navigate(`/fill-test-details`, { state: { id } });
//   };

//   const handleDateRangeChange = (dates, dateStrings) => {
//     const formattedDates = dateStrings.map((date, index) => {
//       const dayjsDate = dayjs(date, "DD/MM/YYYY");
//       if (index === 0) {
//         return dayjsDate.startOf("day").toISOString();
//       } else {
//         return dayjsDate.endOf("day").toISOString();
//       }
//     });
//     if (dates) {
//       setStartDate(formattedDates[0]);
//       setEndDate(formattedDates[1]);
//     }
//   };
//   if(planDetails.length === 0){
//     return (
//       <>
//       <br/>
//       <br/>
//       <Row justify={"center"}>
//         <Col>
//       <h6>No health checkup plans purchased</h6>

//         </Col>
//       </Row>
//       </>
//     )
//   }
//   return (
//     <>
//     <Row justify={"end"}>
//     <Col span={6}>
//             <RangePicker
//               format="DD/MM/YYYY"
//               disabledDate={disabledDate}
//               onChange={handleDateRangeChange}
//               style={{ marginRight: "0.5rem", marginTop:"2rem" }}
//               defaultValue={[dayjs().subtract(30, "day"), dayjs()]}
//             />

//           </Col>
//     </Row>
//      <div className="container-fluid">
//      <div className="row mt-5">
//   {planDetails?.map((plan, index) => (
//     <div key={plan?._id} className="col-12 mt-3">
//       <div className="card bg-gradient-light card-shadow border-0">
//         <div className="card-body">
//           <div className="d-flex justify-content-between">
//             <h3 className="card-title text-153780">
//               {plan?.health_plan?.name}
//             </h3>
//             <h6 className="rounded-pill p-2 bg-5dadec text-white">
//               {plan?.completed ? "Completed" : "Pending"}
//             </h6>
//           </div>

//           <p className="card-subtitle mb-2 text-body-secondary">
//             Price Paid - ₹{plan?.paid_price} (incl. GST) | Purchased on -{" "}
//             {Utils.DateFormat(plan?.createdAt)}
//           </p>
//           <hr />

//           {plan?.details_submitted ? (
//             <div>
//               <p><strong>Patient Name:</strong> {plan?.patient_name}</p>
//               <p><strong>Age:</strong> {plan?.age}</p>
//               <p><strong>Address:</strong> {plan?.address}</p>
//               <p><strong>Pincode:</strong> {plan?.pincode}</p>
//               <p><strong>Appointment:</strong> {Utils.DateFormat(plan?.appointment)}</p>
//             </div>
//           ) : (
//             <div className="text-center mt-3">
//               <button className="btn btn-primary"   onClick={() => handleNavigate(plan?._id)}>
//                 Submit Patient Details
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   ))}
// </div>
//         {/* <div className="row mt-5">
//           {planDetails?.map((plan, index) => (
//             <div key={plan?._id} className="col-12 mt-3">
//               <div className="card bg-gradient-light card-shadow border-0">
//                 <div className="card-body">
//                     <div className="d-flex justify-content-between">
//                     <h3 className="card-title text-153780">
//                     {plan?.health_plan?.name}
//                   </h3>
//                   <h6 className="rounded-pill p-2 bg-5dadec text-white">{plan?.completed ? "Completed":"Pending"}</h6>
//                     </div>

//                   <p className="card-subtitle mb-2 text-body-secondary">
//                     Price Paid - ₹{plan?.paid_price} (incl. GST) | Purchased on -{" "}
//                     {Utils.DateFormat(plan?.createdAt)}
//                   </p>
//                   <hr />

//                 </div>
//               </div>
//             </div>
//           ))}
//         </div> */}
//       </div>
//     <Row justify={"end"}>
//       <Col>

//       <Pagination
//             current={pagination.currentPage}
//             total={pagination.totalRecords}
//             pageSize={pagination.pageSize}
//             onChange={handlePageChange}
//             showLessItems={true}
//             onShowSizeChange={pageSizeChange}
//             showQuickJumper={false}
//             showPrevNextJumpers={true}
//             showSizeChanger={true}
//             onPrev={() => handlePageChange(pagination.prevPage)}
//             onNext={() => handlePageChange(pagination.nextPage)}
//             style={{
//               marginTop: "2rem",
//             }}
//           />
//       </Col>
//     </Row>

//     </>
//   );
// };

// export default PurchasedPlanDetails;

import React, { useEffect, useState } from "react";
import config from "../../config/config";
import { Axios } from "../../axios/axiosFunctions";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { CheckCircleOutlined } from "@ant-design/icons";
import profileicon from "../../assets/profileicon1.png";
import confettibig from "../../assets/Confettibig.png";
import { useNavigate } from "react-router-dom";
import { Utils } from "../../utils";
import { Pagination, Row, Col, Collapse, theme, DatePicker } from "antd";
import dayjs from "dayjs";
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

const PurchasedPlanDetails = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [profileData, setProfileData] = useState({});
  const [planDetails, setPlanDetails] = useState([]);
  const [startDate, setStartDate] = useState(
    dayjs().subtract(30, "day").startOf("day").toISOString()
  );
  const [endDate, setEndDate] = useState(dayjs().endOf("day").toISOString());
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });

  const fetchPurchasedPlanData = async () => {
    const response = await Axios.fetchAxiosData(
      config.GetPurchasedHealthCheckups,
      {
        params: {
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          sortBy: "createdAt",
          startDate: startDate,
          endDate: endDate,
        },
      }
    );
    setPlanDetails(response?.data?.records || []);
    const {
      totalRecords,
      totalPages,
      currentPage,
      nextPage,
      prevPage,
      pageSize,
    } = response.data.pagination;

    setPagination((prevState) => ({
      ...prevState,
      totalRecords: totalRecords,
      totalPages: totalPages,
      pageSize: pageSize,
      currentPage: currentPage,
      nextPage: nextPage,
      prevPage: prevPage,
    }));
  };

  useEffect(() => {
    fetchPurchasedPlanData();
  }, [pagination.currentPage, pagination.pageSize, startDate, endDate]);

  const disabledDate = (current) => {
    return current && current >= dayjs().endOf("day");
  };

  const handlePageChange = (page) => {
    setPagination((prevState) => ({
      ...prevState,
      currentPage: page,
    }));
  };

  const pageSizeChange = (current, pageSize) => {
    setPagination((prevState) => ({
      ...prevState,
      pageSize: pageSize,
    }));
  };

  const handleNavigate = (id) => {
    console.log("id", id);
    navigate(`/fill-test-details`, { state: { id } });
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    const formattedDates = dateStrings.map((date, index) => {
      const dayjsDate = dayjs(date, "DD/MM/YYYY");
      if (index === 0) {
        return dayjsDate.startOf("day").toISOString();
      } else {
        return dayjsDate.endOf("day").toISOString();
      }
    });
    if (dates) {
      setStartDate(formattedDates[0]);
      setEndDate(formattedDates[1]);
    }
  };

  if (planDetails.length === 0) {
    return (
      <>
        <br />
        <br />
        <Row justify={"center"}>
          <Col>
            <h6>No health checkup plans purchased</h6>
          </Col>
        </Row>
      </>
    );
  }

  return (
    <>
      <Row justify={"end"}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <RangePicker
            format="DD/MM/YYYY"
            disabledDate={disabledDate}
            onChange={handleDateRangeChange}
            style={{ marginRight: "0.5rem", marginTop: "2rem" }}
            defaultValue={[dayjs().subtract(30, "day"), dayjs()]}
          />
        </Col>
      </Row>
      <div className="container-fluid">
        <div className="row mt-5">
          {planDetails?.map((plan, index) => (
            <div
              key={plan?._id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 mt-3"
            >
              <div className="card bg-gradient-light card-shadow border-0 mt-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h4 className="card-title text-153780">
                      {plan?.health_plan?.name}
                    </h4>
                    <h6 >
                      {plan?.completed ? "Completed" : "Pending"}
                    </h6>
                  </div>

                  <p className="card-subtitle mb-2 text-body-secondary">
                    Price Paid - ₹{plan?.paid_price} (incl. GST) | Purchased on
                    - {Utils.DateFormat(plan?.createdAt)}
                  </p>
                  <hr />

                  {plan?.details_submitted ? (
                    <div>
                      <p>
                        <strong>Patient Name:</strong> {plan?.patient_name}
                      </p>
                      <p>
                        <strong>Age:</strong> {plan?.age}
                      </p>
                      <p>
                        <strong>Address:</strong> {plan?.address}
                      </p>
                      <p>
                        <strong>Pincode:</strong> {plan?.pincode}
                      </p>
                      <p>
                        <strong>Appointment:</strong>{" "}
                        {Utils.DateFormat(plan?.appointment)}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center mt-3">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleNavigate(plan?._id)}
                      >
                        Submit Patient Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Row justify={"end"}>
          <Col>
            <Pagination
              current={pagination.currentPage}
              total={pagination.totalRecords}
              pageSize={pagination.pageSize}
              onChange={handlePageChange}
              showLessItems={true}
              onShowSizeChange={pageSizeChange}
              showQuickJumper={false}
              showPrevNextJumpers={true}
              showSizeChanger={true}
              onPrev={() => handlePageChange(pagination.prevPage)}
              onNext={() => handlePageChange(pagination.nextPage)}
              style={{
                marginTop: "2rem",
              }}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default PurchasedPlanDetails;
