// import React, { useState, useEffect } from "react";
// import { Col, Row, Form, Input, Button, Select, notification,DatePicker } from "antd";
// import {LeftCircleOutlined} from "@ant-design/icons";
// import {Link} from "react-router-dom";
// import config, { CONFIG_OBJ } from "../../config/config";
// import {faArrowRightLong} from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import codes from "country-calling-code";
// import { Axios } from "../../axios/axiosFunctions";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// const { RangePicker } = DatePicker;
// const { TextArea } = Input;
// import {Utils} from "../../utils";
// import confetti from "../../assets/confetti.png";
// import confetti1 from "../../assets/confetti1.png";
// import dayjs from 'dayjs';

// const FreeHealthCheckUpForm = () => {
//   const [healthCheckUpForm] = Form.useForm();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const location = useLocation();
//   const isManagementRoute = location.pathname.includes("/management/");
//   // all states
//   const [testList, setTestList] = useState([]);
//   const [nameList, setNameList] = useState([]);
//   const [testData, setTestData] = useState([]);
//   const [istestDetails, setIsTestDetails] = useState(false);
//   const [profileData, setProfileData] = useState({});
//   const [planExpired,setPlanExpired] = useState(false);

//   // all functions
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
//   const fetchHealthData = async (apiEndpoint) => {

//     const response = await Axios.fetchAxiosData(apiEndpoint);
//     const filteredData = response.data.records.find(record => record._id === id);
//     console.log("filteredData",filteredData)
//     if (filteredData) {
//       const formattedData = {
//         ...filteredData,
//         createdAt: Utils.DateFormat(filteredData.createdAt),
//         member_id: filteredData.member_details.name,
//         appointnment: dayjs(filteredData.appointment)
//       };
//       setTestData(formattedData);
//       setIsTestDetails(true);
//       healthCheckUpForm.setFieldsValue(formattedData);
//     } else {
//       console.log('Record not found');
//     }

//   };

//   const formatFieldLabel = (label) => {
//     return label
//       .split("_")
//       ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//      const fetchTestData = async () => {
//       const result = await Axios.fetchAxiosData(config.GetFreeHealtTests);
//       console.log("result",result)
//       // const array = Object.entries(result.data.records)?.map(([name, _id]) => ({
//       //   name : formatFieldLabel(name),
//       //   _id,
//       // }));

//       setTestList(result.data.records);
//     };

//   const fetchMemberData = async () => {
//     const memberData = await Axios.fetchAxiosData(
//       config.GetMembers,
//     );
//     setNameList(memberData.data);
//   };

//   useEffect(() => {
//     fetchProfileData();
//     fetchMemberData();
//     fetchTestData();
//   }, []);

//   useEffect(() => {
//     if (id) {
//       const apiEndpoint = isManagementRoute
//         ? config.GetAllHealthCheckUp
//         : config.GetHealthCheckUp;
//       fetchHealthData(apiEndpoint);
//     }
//   }, [id, isManagementRoute]);
//   const disableDates = (current) => {
//     // Disable dates before 72 hours from now
//     return current && current < dayjs().add(72, 'hour').startOf('minute');
//   };
//   const FormSubmit = async(values) => {
//     const response = await Axios.postAxiosData(config.AddHealthCheckUp, values);
//      if(response.success === true){
//         notification.success({
//           message: "Request for Free Health Checkup submitted successfully",
//         })
//         healthCheckUpForm.resetFields();
//         navigate("/user/health-checkups");
//      }
//      else{
//       notification.error({
//         message: response.message,
//       })
//      }
//   };

//   return (
//     <>
//       <div className="container">
//         <div className="row">
//         <div className="d-flex align-items-center gap-3 my-0 py-0 mb-3">
//             <Link to={isManagementRoute ? "/management/health-checkups" : "/user/health-checkups"}>
//               <LeftCircleOutlined className="text-primary fs-3" />
//             </Link>
//         </div>
//         </div>
//         <div className="row ">
//           <h3 className="text-center mt-4 textblue">
//             Book Free Health Checkup
//           </h3>
//           <h6 className="text-center mb-5 textblue">
//              <Link to="/user/health-plans">
//              <img src={confetti1} alt="confetti" width={20} height={20} className="me-1 mb-4"/>
//              Upgrade to our top health plan for better care and wellness.
//              <img src={confetti} alt="confetti" width={20} height={20} className=" mb-4"/>
//              <FontAwesomeIcon icon={faArrowRightLong} />
//              </Link>
//           </h6>
//           <Form
//             form={healthCheckUpForm}
//             onFinish={FormSubmit}
//             layout="vertical"
//           >
//              {istestDetails && (
//            <Row gutter={16} className="d-flex justify-content-center">
//             <Col span={8}>
//             <Form.Item
//                   name="createdAt"
//                   label="Booking Date"
//                 >
//                  <Input value={testData?.createdAt} disabled/>
//                 </Form.Item>
//             </Col>
//             <Col span={8}>
//             <Form.Item
//                   name="health_checkup_id"
//                   label="Health Checkup Id"
//                 >
//                  <Input value={testData?._id} disabled/>
//                 </Form.Item>
//             </Col>
//            </Row>
//          )}
//             <Row gutter={16} className="d-flex justify-content-center">
//               <Col span={8}>
//               <Form.Item
//                   name="member_id"
//                   label="Patient Name"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please select patient",
//                     },
//                   ]}
//                 >
//                   <Select placeholder="Select patient" disabled={istestDetails} >
//                     {nameList?.map((name) => (
//                       <Option key={name._id} value={name._id}>
//                         {name.name}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//               <Form.Item
//                   name="checkup_for"
//                   label="Test"
//                   rules={[{ required: true, message: "Test is required" }]}
//                 >
//                   <Select
//                     mode="multiple"
//                     allowClear
//                     style={{
//                       width: "100%",
//                     }}
//                     placeholder="Please select"
//                     options={testList?.map((test) => ({
//                       label: test.name,
//                       value: test._id,
//                     }))}
//                     disabled={istestDetails}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row gutter={16} className="d-flex justify-content-center">
//               <Col span={16}>
//                 <Form.Item
//                   name="appointment"
//                   label="Appointment"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please choose date and time",
//                     },
//                   ]}
//                 >

//                    <DatePicker
//                     format="DD/MM/YYYY hh:mm A"
//                    renderExtraFooter={() => 'Only time slot after 72 hours can be picked.'} showTime  placeholder="Select time slot"  showToday={false} disabledDate={disableDates}/>
//                 </Form.Item>

//                 {/* <p className="textblue mt-2">
//                   *Only time slot after 72 hours can be picked.
//                 </p> */}
//               </Col>
//             </Row>
//             <Row gutter={16} className="d-flex justify-content-center">
//               <Col span={16}>
//                 <Form.Item
//                   name="message"
//                   label="Message"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Message is required",
//                     },
//                   ]}
//                 >
//                   <TextArea
//                     placeholder="Add your message here"
//                     autoSize={{ minRows: 2 }}
//                     disabled={istestDetails}
//                     value={istestDetails ? testData?.message : null}
//                   />
//                 </Form.Item>

//                 <p className="textblue mt-2">
//                   *Kindly note that post submitting this form, our team will
//                   connect with you shortly.
//                 </p>
//               </Col>
//             </Row>
//             <Row gutter={16} className="d-flex justify-content-center mt-4">
//               <Col span={4}>
//                 <Button type="primary" htmlType="submit" block className="" disabled={istestDetails}>
//                   Submit
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default FreeHealthCheckUpForm;

import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Form,
  Input,
  Button,
  Select,
  notification,
  DatePicker,
} from "antd";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { Axios } from "../../axios/axiosFunctions";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import confetti from "../../assets/confetti.png";
import confetti1 from "../../assets/confetti1.png";
import dayjs from "dayjs";
import config  from "../../config/config"

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const FreeHealthCheckUpForm = () => {
  const [healthCheckUpForm] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isManagementRoute = location.pathname.includes("/management/");
  const [testList, setTestList] = useState([]);
  const [nameList, setNameList] = useState([]);
  const [testData, setTestData] = useState([]);
  const [istestDetails, setIsTestDetails] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [planExpired, setPlanExpired] = useState(false);

  // Fetch Data Functions
  // const fetchProfileData = async () => {
  //   try {
  //     const time = await Axios.fetchAxiosData("/api/current-time");
  //     const response = await Axios.fetchAxiosData("/api/profile");
  //     setProfileData(response?.data);
  //     if (dayjs(response?.data.plan?.end_date).isBefore(time.data))
  //       setPlanExpired(true);
  //   } catch {
  //     setPlanExpired(false);
  //   }
  // };

  const fetchHealthData = async (apiEndpoint) => {
    const response = await Axios.fetchAxiosData(apiEndpoint);
    const filteredData = response.data.records.find(
      (record) => record._id === id
    );
    if (filteredData) {
      const formattedData = {
        ...filteredData,
        createdAt: dayjs(filteredData.createdAt).format("DD/MM/YYYY"),
        member_id: filteredData.member_details.name,
        appointment: dayjs(filteredData.appointment),
      };
      setTestData(formattedData);
      setIsTestDetails(true);
      healthCheckUpForm.setFieldsValue(formattedData);
    }
  };

  const fetchTestData = async () => {
    const result = await Axios.fetchAxiosData(config.GetFreeHealtTests);
    setTestList(result.data.records);
  };

  const fetchMemberData = async () => {
    const memberData = await Axios.fetchAxiosData(config.GetMembers);
    setNameList(memberData.data);
  };

  const FormSubmit = async (values) => {
    const response = await Axios.postAxiosData(config.AddHealthCheckUp, values);
    if (response.success) {
      notification.success({
        message: "Request for Free Health Checkup submitted successfully",
      });
      healthCheckUpForm.resetFields();
      navigate("/user/health-checkups");
    } else {
      notification.error({
        message: response.message,
      });
    }
  };

  const disableDates = (current) =>
    current && current < dayjs().add(72, "hour").startOf("minute");

  useEffect(() => {
    // fetchProfileData();
    fetchMemberData();
    fetchTestData();
    if (id) {
      const apiEndpoint = isManagementRoute
        ? "/api/all-health-checkups"
        : "/api/health-checkup";
      fetchHealthData(apiEndpoint);
    }
  }, [id, isManagementRoute]);

  return (
    <div className="free-health-checkup-form container">
      <div className="back-link">
        <Link
          to={
            isManagementRoute
              ? "/management/health-checkups"
              : "/user/health-checkups"
          }
        >
          <LeftCircleOutlined className="text-primary fs-3" />
        </Link>
      </div>
      <div className="form-header">
        <h3>Book Free Health Checkup</h3>
        <h6>
          <Link to="/user/health-plans">
            <img src={confetti1} alt="confetti" width={20} height={20} />
            Upgrade to our top health plan for better care and wellness.
            <img src={confetti} alt="confetti" width={20} height={20} />
            <FontAwesomeIcon icon={faArrowRightLong} />
          </Link>
        </h6>
      </div>
      <Form form={healthCheckUpForm} onFinish={FormSubmit} layout="vertical">
        {istestDetails && (
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} lg={8}>
              <Form.Item name="createdAt" label="Booking Date">
                <Input value={testData?.createdAt} disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item name="health_checkup_id" label="Health Checkup ID">
                <Input value={testData?._id} disabled />
              </Form.Item>
            </Col>
          </Row>
        )}
        {/* <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name="member_id"
              label="Patient Name"
              rules={[{ required: true, message: "Please select patient" }]}
            >
              <Select placeholder="Select patient" disabled={istestDetails}>
                {nameList.map((name) => (
                  <Option key={name._id} value={name._id}>
                    {name.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item name="checkup_for" label="Test" rules={[{ required: true, message: "Test is required" }]}>
              <Select
                mode="multiple"
                allowClear
                placeholder="Please select"
                options={testList.map((test) => ({ label: test.name, value: test._id }))}
                disabled={istestDetails}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} lg={16}>
            <Form.Item
              name="appointment"
              label="Appointment"
              rules={[{ required: true, message: "Please choose date and time" }]}
            >
              <DatePicker
                format="DD/MM/YYYY hh:mm A"
                showTime
                placeholder="Select time slot"
                showToday={false}
                disabledDate={disableDates}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} lg={16}>
            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true, message: "Message is required" }]}
            >
              <TextArea
                placeholder="Add your message here"
                autoSize={{ minRows: 2 }}
                disabled={istestDetails}
              />
            </Form.Item>
            <p className="textblue">*Our team will connect with you shortly after form submission.</p>
          </Col>
        </Row>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={8} lg={4}>
            <Button type="primary" htmlType="submit" block disabled={istestDetails}>
              Submit
            </Button>
          </Col>
        </Row> */}

        <Row
          gutter={[16, 16]} // Add spacing between rows and columns
          className="d-flex justify-content-center"
        >
          <Col xs={24} sm={24} md={12} lg={8}>
            <Form.Item
              name="member_id"
              label="Patient Name"
              rules={[
                {
                  required: true,
                  message: "Please select patient",
                },
              ]}
            >
              <Select placeholder="Select patient" disabled={istestDetails}>
                {nameList?.map((name) => (
                  <Option key={name._id} value={name._id}>
                    {name.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8}>
            <Form.Item
              name="checkup_for"
              label="Test"
              rules={[{ required: true, message: "Test is required" }]}
            >
             <Select placeholder="Select test">
                {testList?.map((name) => (
                  <Option key={name._id} value={name._id}>
                    {name.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={[16, 16]} // Add spacing between rows and columns
          className="d-flex justify-content-center"
        >
          <Col xs={24} sm={24} md={16}>
            <Form.Item
              name="appointment"
              label="Appointment"
              rules={[
                {
                  required: true,
                  message: "Please choose date and time",
                },
              ]}
            >
              <DatePicker
                format="DD/MM/YYYY hh:mm A"
                renderExtraFooter={() =>
                  "Only time slot after 72 hours can be picked."
                }
                showTime
                placeholder="Select time slot"
                showToday={false}
                disabledDate={disableDates}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={[16, 16]} // Add spacing between rows and columns
          className="d-flex justify-content-center"
        >
          <Col xs={24} sm={24} md={16}>
            <Form.Item
              name="message"
              label="Message"
              rules={[
                {
                  required: true,
                  message: "Message is required",
                },
              ]}
            >
              <TextArea
                placeholder="Add your message here"
                autoSize={{ minRows: 2 }}
                disabled={istestDetails}
                value={istestDetails ? testData?.message : null}
              />
            </Form.Item>
            <p className="textblue mt-2">
              *Kindly note that post submitting this form, our team will connect
              with you shortly.
            </p>
          </Col>
        </Row>
        <Row gutter={[16, 16]} className="d-flex justify-content-center mt-4">
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={istestDetails}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default FreeHealthCheckUpForm;
