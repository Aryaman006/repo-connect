// import React, { useState, useEffect } from "react";
// import {
//   Row,
//   Col,
//   Form,
//   Input,
//   Button,
//   Select,
//   DatePicker,
//   Radio,
//   notification,
//   InputNumber,
//   Tooltip,
//   Modal
// } from "antd";
// const { Option } = Select;
// const { confirm } = Modal;
// import codes from "country-calling-code";
// import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
// import { LeftCircleOutlined,ExclamationCircleFilled } from "@ant-design/icons";
// import dayjs from "dayjs";
// import config, { CONFIG_OBJ_DOC, CONFIG_OBJ } from "../../config/config";
// import { Axios } from "../../axios/axiosFunctions";
// import CONSTANTS from "../../constant/Constants";
// import useAxiosFetch from "../../hooks/useAxiosFetch";
// import DocumentUploader from "../../components/DocumentUploader";
// import disputeimg from "../../assets/dispute.jfif";
// import doctor from "../../assets/doctor.jfif";
// const { TextArea } = Input;

// const UserClaimsForm = () => {
//   const [defaultForm, setDefaultForm] = useState(
//     null || JSON.parse(sessionStorage.getItem("opdClaimForm"))
//   );
//   const { data : subscribedPlan } = useAxiosFetch( config.GetSubscribedPlan );
//   const { data: specializations } = useAxiosFetch(
//     config.GetAllSpecialization + "?pageSize=1000");
//     const docCountryCode = defaultForm && defaultForm.doc_country_code ? defaultForm.doc_country_code : "+91";
//     const navigate = useNavigate();
//     const { id } = useParams();

//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const action = Number(queryParams.get("action"));
//   const [opdClaimForm] = Form.useForm();
//   const [claim, setClaim] = useState(1);
//   const [stateList, setStateList] = useState([]);
//   const [nameList, setNameList] = useState([]);
//   const [isClaimsDetails, setIsClaimsDetails] = useState(false);
//   const [claimStatus, setClaimStatus] = useState(null);
//   const [userReaction, setUserReaction] = useState(undefined);
//   const [userData, setUserData] = useState({});
//   const [chargesSum, setChargesSum] = useState(0);
//   const [messages , setMessages] = useState(null);
//   const [disputeForm] = Form.useForm();
//   const [dispute, setUserDispute] = useState(undefined);
//   const [disputeFiles, setDisputeFiles] = useState([]);
//   const [disputeFilesUrl, setDisputeFilesUrl] = useState([]);
//   const fetchUserClaimsData = async () => {
//     const response = await Axios.fetchAxiosData(
//       config.GetClaims + id,
//       // CONFIG_OBJ
//     );
//     const formattedData = {
//       ...response.data,
//       opd_date: dayjs(response.data.opd_date),
//     };

//     setUserData(response.data);
//     setIsClaimsDetails(true);
//     setClaimStatus(response.data.status);
//     setUserReaction(response.data.subscriber_reaction);
//     setMessages(response.data.subscriber_remark);
//     opdClaimForm.setFieldsValue(formattedData);
//     setUserDispute(response.data.dispute);
//   };

//   const { fee_receipt, prescription, pharmacy_receipt, test_receipt,test_reports } =
//     userData || {};

//   const disableDobHandler = (current) => {
//     return current && (current > dayjs() || current <dayjs().subtract(7, "day"));
//   };

//   const onClaimChange = (e) => {
//     setClaim(e.target.value);
//   };

//   const fetchStateData = async () => {
//     const stateListData = await Axios.fetchAxiosData(config.GetStateList);
//     setStateList(stateListData.data);
//   };

//   const fetchMemberData = async () => {
//     const memberData = await Axios.fetchAxiosData(
//       config.GetMembers,
//     );
//     const paidMembersData = memberData.data.filter( m => m.plan_status === CONSTANTS.PLAN_STATUS.PAID
//     )
//     setNameList(paidMembersData);
//   };

//   useEffect(() => {
//     fetchMemberData();
//     fetchStateData();
//   }, []);

//   useEffect(() => {
//     if (id) {
//       fetchUserClaimsData();
//     }
//   }, [id]);

//   const handleNext = async () => {
//     const values = await opdClaimForm.validateFields();
//     sessionStorage.setItem("opdClaimForm", JSON.stringify({ ...values,claim_combination:subscribedPlan?.claim_combination }));
//     navigate(`/user/upload-claim-documents/?action=${action}`, { state: { values,claim_combination:subscribedPlan?.claim_combination } });
//   };

//   const onFinishDispute = async (values) => {
//     confirm({
//       title: <h4>Confirmation !</h4>,
//       content: <div>
//        <p> Are you sure you want to raise dispute for the selected claim?</p>
//         </div>,
//       icon: <ExclamationCircleFilled />,
//       centered: true,
//       async onOk(){
//         const files = await handleDocumentSubmit() || [];
//         try {
//           const data = await Axios.patchAxiosData(config.RaiseClaimDispute+id,{user_remark: values.user_remark, files:files.data});
//           if(data.success===true){
//             notification.success({
//               message: "Dispute raised successfully",
//             });
//             navigate(`/user/claims/`, { replace: true });
//           }else{
//             notification.error({
//               message: "Failed to rasie dispute.",
//             });
//           }
//         } catch (error) {
//         notification.error({
//         message: error.response.message,
//       });
//     }
//     disputeForm.resetFields();

//       },
//       onCancel() {},
//     })

//   }

//   const handleChargesChange = (value, chargeType) => {
//     if (chargeType === "pharmacy") {
//       opdClaimForm.setFieldsValue({ pharmacy_charges: value });
//     } else if (chargeType === "lab") {
//       opdClaimForm.setFieldsValue({ lab_test_charges: value });
//     } else if (chargeType === "consultation") {
//       opdClaimForm.setFieldsValue({ consultation_charges: value });
//     }else if( chargeType === "combined_pharmacy_test"){
//       opdClaimForm.setFieldsValue({ combined_pharmacy_test_fees: value });
//     }

//     const pharmacyCharges = opdClaimForm.getFieldValue("pharmacy_charges") || 0;
//     const labTestCharges = opdClaimForm.getFieldValue("lab_test_charges") || 0;
//     const consultationCharges =
//       opdClaimForm.getFieldValue("consultation_charges") || 0;
//     const combinedPharmacyTestCHanrger =
//       opdClaimForm.getFieldValue("combined_pharmacy_test_fees") || 0;

//     const sum = pharmacyCharges + labTestCharges + consultationCharges + combinedPharmacyTestCHanrger;
//     setChargesSum(sum);
//     opdClaimForm.setFieldsValue({ bill_amount: sum });
//   };
//   const handleBlur = async (value, parameter) => {
//     if(value<0) return;

//     if(parameter===0){
//       try{
//         if(value === 0 || value === "" ){
//           opdClaimForm.setFieldsValue({ claimable_doctor_fee: 0.00 });
//           opdClaimForm.setFieldsValue({ doctor_fee: 0.00 });
//           return;
//         }
//         const response  = await Axios.fetchAxiosData(config.GetClaimableAmount + `?amount=${value}&parameter=${parameter}`)
//         const finalPrice = response.data.finalPrice;
//         opdClaimForm.setFieldsValue({ claimable_doctor_fee: finalPrice });
//         }catch(error){
//           notification.error({
//             message:"Failed to get OPD claimable amount"
//           })
//       }
//     }else if (parameter===1){
//       try{
//         if(value === 0 || value === "" ){
//           opdClaimForm.setFieldsValue({ claimable_pharmacy_fee: 0.00 });
//           opdClaimForm.setFieldsValue({ pharmacy_fee: 0.00 });
//           return;
//         }
//         const response  = await Axios.fetchAxiosData(config.GetClaimableAmount + `?amount=${value}&parameter=${parameter}`)
//         const finalPrice = response.data.finalPrice;
//         opdClaimForm.setFieldsValue({ claimable_pharmacy_fee: finalPrice });
//       }catch(error){
//         notification.error({
//           message:"Failed to get Pharmacy claimable amount"
//         })
//       }
//     }else if(parameter===2){
//       try{
//         if(value === 0 || value === "" ){
//           opdClaimForm.setFieldsValue({ claimable_lab_test_fee: 0.00 });
//           opdClaimForm.setFieldsValue({ lab_test_fee: 0.00 });
//           return;
//         }
//         const response  = await Axios.fetchAxiosData(config.GetClaimableAmount + `?amount=${value}&parameter=${parameter}`)
//         const finalPrice = response.data.finalPrice;
//         opdClaimForm.setFieldsValue({ claimable_lab_test_fee: finalPrice });
//         }catch(error){
//           notification.error({
//             message:"Failed to get Lab Tests claimable amount"
//           })
//       }
//     }else if(parameter===3){
//       try{
//         if(value === 0 || value === "" ){
//           opdClaimForm.setFieldsValue({ claimable_combined_pharmacy_test_fees: 0.00 });
//           opdClaimForm.setFieldsValue({ combined_pharmacy_test_fees: 0.00 });
//           return;
//         }
//         const response  = await Axios.fetchAxiosData(config.GetClaimableAmount + `?amount=${value}&parameter=${parameter}`)
//         const finalPrice = response.data.finalPrice;
//         opdClaimForm.setFieldsValue({ claimable_combined_pharmacy_test_fees: finalPrice });
//         }catch(error){
//           notification.error({
//             message:"Failed to get Pharmacy & Diagnostics claimable amount"
//           })
//       }
//     }
//     const claimableLabFees = opdClaimForm.getFieldValue("claimable_lab_test_fee") || 0;
//     const claimableDocFees = opdClaimForm.getFieldValue("claimable_doctor_fee")  || 0;
//     const claimablePharmacyFees = opdClaimForm.getFieldValue("claimable_pharmacy_fee")  || 0;
//     const combinedPharmacyLabFees = opdClaimForm.getFieldValue("claimable_combined_pharmacy_test_fees")  || 0;
//     const finalClaimableAmount = claimableLabFees + claimableDocFees + claimablePharmacyFees + combinedPharmacyLabFees;
//     opdClaimForm.setFieldsValue({ claimable_amount: finalClaimableAmount });

//   };

//   const handleDocumentSubmit = async () => {

//     try {

//       if(disputeFiles.length > 0){

//         const formData = new FormData();
//         disputeFiles.forEach((file) => {
//             formData.append("files", file.file);
//           });

//           const response = await Axios.postAxiosData(
//             config.UploadClaim,
//             formData,
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               }
//             }
//           );

//           if (response.success) {
//             return { data: response.data };
//           } else {
//             throw new Error(`Failed to upload documents`);
//           }
//       }
//       const uploadPromises = disputeFiles?.map(async ({ files, documentType }) => {

//         if (files.length > 0) {
//           const formData = new FormData();
//           files.forEach((file) => {
//             formData.append("files", file.file);
//           });

//           const response = await Axios.postAxiosData(
//             config.UploadClaim,
//             formData,
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//              }
//             }
//           );

//           if (response.success) {
//             return { documentType, data: response.data.data };
//           } else {
//             throw new Error(`Failed to upload ${documentType} documents`);
//           }
//         }
//         return null;
//       });

//       const results = await Promise.all(uploadPromises);
//       const documents = results.reduce((acc, result) => {
//         if (result) {
//           acc[result.documentType] = result.data;
//         }
//         return acc;
//       }, {});

//       setDisputeFilesUrl(documents);
//     } catch (error) {
//       notification.error({
//         message: "Failed to upload documents",
//       });
//     }
//   };

//   return (
//     <>
//       <div className="container bg-white">
//         <div className="row">
//         <Link to="/user/claims" onClick={()=>{sessionStorage.removeItem("opdClaimForm")}}>
//               <LeftCircleOutlined className="text-purple fs-3" />
//             </Link>

//           <div className="d-flex align-items-center gap-3 my-0 py-0 mb-3 mt-2">

//             {isClaimsDetails ? (

//                 <h4 className="my-1 text-purple">Claims Details</h4>

//             ) : (

//                 <h4 className="my-1">Claims Form</h4>

//             )}
//           </div>

//           <Form
//             form={opdClaimForm}
//             layout="vertical"
//             disabled={(isClaimsDetails && claimStatus !== CONSTANTS.CLAIM_STATUS.STATUS.CLARIFICATION ) ||
//               (claimStatus === CONSTANTS.CLAIM_STATUS.STATUS.CLARIFICATION && userReaction )
//             }
//             initialValues={{
//               _id: defaultForm?._id,
//               claim_type: defaultForm?.claim_type,
//               doc_name: defaultForm?.doc_name,
//               city: defaultForm?.city,
//               claimable_amount: defaultForm?.claimable_amount || 0,
//               doc_registration: defaultForm?.doc_registration,
//               diagonosis_detail: defaultForm?.diagonosis_detail,
//               specialization: defaultForm?.specialization,
//               hospital: defaultForm?.hospital,
//               pincode: defaultForm?.pincode,
//               doc_address: defaultForm?.doc_address,
//               bill_amount: defaultForm?.bill_amount || 0,
//               member_id: defaultForm?.member_id,
//               opd_date: defaultForm?.opd_date &&dayjs(defaultForm?.opd_date),
//               doctor_fee: defaultForm?.doctor_fee || 0,
//               lab_test_fee: defaultForm?.lab_test_fee || 0,
//               pharmacy_fee: defaultForm?.pharmacy_fee || 0,
//               combined_pharmacy_test_fees: defaultForm?.combined_pharmacy_test_fees || 0,
//               claimable_doctor_fee: defaultForm?.claimable_doctor_fee || 0 ,
//               claimable_lab_test_fee: defaultForm?.claimable_lab_test_fee || 0,
//               claimable_pharmacy_fee: defaultForm?.claimable_pharmacy_fee || 0,
//               claimable_combined_pharmacy_test_fees: defaultForm?.claimable_combined_pharmacy_test_fees || 0,
//               doc_email: defaultForm?.doc_email,
//               doc_phone: defaultForm?.doc_phone,
//               doc_country_code : docCountryCode,
//             }}
//           >
//             <Row>
//               <Col>
//               <Form.Item label="ClaimId" name="_id" hidden >
//                 <Input />
//               </Form.Item>
//               </Col>
//             </Row>
//             <Row gutter={16}>
//               {/* <Col span={8}>
//                 <Form.Item
//                   name="claim_type"
//                   label="Claim Type"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please choose claim type",
//                     },
//                   ]}
//                 >
//                   <Radio.Group
//                     onChange={onClaimChange}
//                     value={claim}
//                     // disabled={isClaimsDetails}
//                   >
//                     <Radio value={0}>Doctor Consultation</Radio>
//                     <Radio value={1}>Pharmacy</Radio>
//                     <Radio value={2}>Lab Tests</Radio>
//                   </Radio.Group>
//                 </Form.Item>
//               </Col> */}

//               <Col span={8}>
//                 <Form.Item
//                   name="member_id"
//                   label="Patient Name"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please select patient",
//                     },
//                   ]}
//                 >
//                   <Select placeholder="Select patient"
//                   // disabled={isClaimsDetails}
//                   >
//                     {nameList?.map((name) => (
//                       <Option key={name._id} value={name._id}>
//                         {name.name}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item
//                   name="opd_date"
//                   label="OPD Visit Date"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter your OPD Visit Date",
//                     },
//                   ]}
//                 >
//                   <DatePicker
//                     placeholder="Select Date"
//                     format="DD/MM/YYYY"
//                     style={{ width: "50%" }}
//                     disabledDate={disableDobHandler}
//                     // disabled={isClaimsDetails}

//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//             <h5 className="my-4 text-purple">Doctor's Details</h5>
//             <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item
//                   name="doc_name"
//                   label="Doctor's Name"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter your doctor's name",
//                     },
//                     {
//                       regex: CONSTANTS.REGEX.DOCTOR_NAME,
//                       message:"Invalid doctor name"
//                     }
//                   ]}
//                 >
//                   <Input placeholder="Doctor's name"
//                   // disabled={isClaimsDetails}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//               <Tooltip placement="topLeft" title="Medical Council Of India">
//               <Form.Item
//                   name="doc_registration"
//                   label="Registration No."
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter doctor Regn. No.",
//                     },
//                     {
//                       pattern: CONSTANTS.REGEX.DOC_REGESTRATION,
//                       message: "Alpha numeric and - / . allowed ",
//                     },
//                   ]}
//                 >
//                   <Input
//                     placeholder="Registration no"
//                     // disabled={isClaimsDetails}
//                   />
//                 </Form.Item>
//               </Tooltip>

//               </Col>

//               <Col span={8}>
//                 <Form.Item
//                   name="specialization"
//                   label="Specialization"

//                 >
//                  <Select placeholder="Select Specialization">
//                   {specializations?.records?.map(s=>(
//                     <Option key={s._id} value={s.name} label={s.name} >{s.name}</Option>
//                   ))}
//                  </Select>
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item
//                   name="hospital"
//                   label="Hospital / Clinic Name"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter Hospital / Clinic name",
//                     },
//                   ]}
//                 >
//                   <Input
//                     placeholder="Hospital / Clinic name"
//                     // disabled={isClaimsDetails}
//                   />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item
//                   name="city"
//                   label="City"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter city name",
//                     },
//                     {
//                       regex: CONSTANTS.REGEX.DOCTOR_NAME,
//                       message:"Invalid city name"
//                     }
//                   ]}
//                   style={{ marginBottom: "10px" }}
//                 >
//                   <Input
//                     placeholder="Enter city name"
//                     type="text"
//                     // disabled={isClaimsDetails}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item
//                   name="pincode"
//                   label="Pincode"
//                   style={{ marginBottom: "10px" }}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter pincode",
//                     },
//                     {
//                       pattern: CONSTANTS.REGEX.PINCODE,
//                       message: "Enter valid pincode",
//                     },
//                   ]}

//                 >
//                   {/* <Select placeholder="Select state"
//                   // disabled={isClaimsDetails}
//                   >
//                     {stateList?.map((state) => (
//                       <Option key={state.id} value={state.id}>
//                         {state.name}
//                       </Option>
//                     ))}
//                   </Select> */}
//                   <Input
//                     placeholder="pincode"
//                     type="text"
//                     // disabled={isClaimsDetails}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//            <Row gutter={16}>
//            <Col span={8}>
//                 <Form.Item
//                   name="doc_address"
//                   label="Address"

//                   style={{ marginBottom: "10px" }}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter address",
//                     },
//                   ]}
//                 >
//                   <TextArea
//                     placeholder="Enter Address"
//                     autoSize
//                     // ={{ minRows: 2 }}
//                     style={{ overflowY: "hidden" }}
//                     // disabled={isClaimsDetails}
//                   />
//                 </Form.Item>
//               </Col>
//              <Col span={8}>
//                <Form.Item
//                  name="doc_email"
//                  label="Email"
//                  style={{ marginBottom: "10px" }}
//                  rules={[
//                    {
//                      type: "email",
//                      message: "Enter valid E-mail!",
//                    },
//                  ]}
//                >
//                  <Input
//                    placeholder="doctor@email.com"
//                    type="email"
//                   //  disabled={isClaimsDetails}
//                  />
//                </Form.Item>
//              </Col>
//              <div className=" d-flex gap-0 col-4">
//                 <Col span={7}>
//                   <Form.Item
//                     name="doc_country_code"
//                     label="Mobile"
//                     rules={[
//                       { required: true, message: "Country code is required" },
//                     ]}
//                   >
//                     <Select
//                       showSearch
//                       optionFilterProp="children"
//                       filterOption={(input, option) =>
//                         option.children
//                           .toLowerCase()
//                           .indexOf(input.toLowerCase()) >= 0
//                       }
//                       defaultValue="+91"
//                       placeholder="code"
//                       style={{ width: "100%" }}
//                       disabled
//                     >
//                       {codes?.map((country) => (
//                         <Option
//                           key={country.isoCode2}
//                           value={country.countryCodes[0]}
//                         >
//                           {`+${country.countryCodes[0]}`}
//                         </Option>
//                       ))}
//                     </Select>
//                   </Form.Item>
//                 </Col>
//                 <Col span={17}>
//                   <Form.Item
//                     name="doc_phone"
//                     label={
//                       <span className="text-black d-none">Mobile No.</span>
//                     }
//                     rules={[
//                       { required: true, message: "Mobile is required" },
//                     ]}
//                     labelCol={{ span: 0 }}
//                     style={{ marginTop: "1.9rem" }}
//                   >
//                     <Input
//                       type="tel"
//                       style={{
//                         width: "100%",
//                       }}
//                       placeholder="mobile no."
//                       maxLength={13}
//                     />
//                   </Form.Item>
//                 </Col>
//               </div>
//            </Row>

//             <Row className="mt-3" gutter={16}>
//               <Col span={12}>
//                 <Form.Item
//                   name="diagonosis_detail"
//                   label="Reason for Doctor Consultation"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Diagnosis Details is required",
//                     },
//                   ]}
//                   style={{ marginBottom: "10px" }}
//                 >
//                   <TextArea
//                     placeholder="Enter Diagnosis Details"
//                     autoSize
//                     // ={{ minRows: 2 }}
//                     style={{ overflowY: "hidden" }}
//                     // disabled={isClaimsDetails}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//               <Form.Item
//                   name="user_remark"
//                   label="Additional Information (if any)"
//                   style={{ marginBottom: "10px" }}

//                 >
//                   <Input
//                     placeholder="Add Remarks (if any)"
//                     autoSize
//                     // ={{ minRows: 2 }}
//                     style={{ overflowY: "hidden" }}
//                     // disabled={isClaimsDetails}
//                   />
//               </Form.Item>
//               </Col>

//             </Row>   
//             <div className="row mt-3">
//               <div className="col-4">
//                 <h6 className="fw-bold">Actual Bill Amounts</h6>
//               </div>
//               <div className="col-4">
//                 <h6 className="fw-bold">Claimable Amounts</h6>
//               </div>
//             </div>
//             {subscribedPlan?.claim_combination === CONSTANTS.CLAIM_COMBINATION.SEPERATE && (<>
//             <div className="row mt-3">

//               <div className="col-4">
//               <Col span={24}>
//               <Form.Item
//                   name="doctor_fee"
//                   label={<span className="text-start ms-0">Doctor's Fees</span>}
//                   layout="horizontal"
//                   labelAlign="left"
//                   labelCol={{
//                     span: 14,
//                   }}
//                   rules={[{
//                     type:"number",
//                     min: 1,
//                     message:"Min Amount ₹1"
//                   },
//                   {
//                     type:"number",
//                     max: 100000,
//                     message:`Max amount ₹100000`
//                   },
//                   ]}

//                 >
//                   <InputNumber
//                     type="number"
//                     placeholder="Doctor's fees"
//                     precision={2}
//                     // disabled={isClaimsDetails}
//                     style={{width:"100%"}}
//                     onChange={(value) => handleChargesChange(value, "consultation")}
//                     onBlur={(e) => handleBlur(e.target.value, 0)}

//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={24} >
//               <Form.Item
//                   name="pharmacy_fee"
//                   label= {<span className="text-start">Bill Amt. For Pharmacy</span>}
//                   layout="horizontal"
//                   labelAlign="left"
//                   labelCol={{
//                     span: 14,
//                   }}
//                   rules={[{
//                     type:"number",
//                     min: 0,
//                     message:"Min Amount ₹0"
//                   },
//                   {
//                     type:"number",
//                     max: 100000,
//                     message:`Max amount ₹100000`
//                   },
//                   ]}

//                 >
//                   <InputNumber
//                     type="number"
//                     placeholder="Pharmacy Charges"
//                     precision={2}
//                     min={0}
//                     // disabled={isClaimsDetails}
//                     style={{width:"100%"}}
//                     onChange={(value) => handleChargesChange(value, "pharmacy")}
//                     onBlur={(e) => handleBlur(e.target.value, 1)}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={24}>
//               <Form.Item
//                   name="lab_test_fee"
//                   label={<span>Bill Amt. For Diagnostics</span>}
//                   layout="horizontal"
//                   labelCol={{
//                     span: 14,
//                   }}
//                   labelAlign="left"
//                   rules={[{
//                     type:"number",
//                     min: 0,
//                     message:"Min Amount ₹0"
//                   },
//                   {
//                     type:"number",
//                     max: 100000,
//                     message:`Max amount ₹100000`
//                   },
//                   ]}
//                 >
//                   <InputNumber
//                     type="number"
//                     placeholder="Lab Test Charges"
//                     precision={2}
//                     // disabled={isClaimsDetails}
//                     style={{width:"100%"}}
//                     onChange={(value) => handleChargesChange(value, "lab")}
//                     onBlur={(e) => handleBlur(e.target.value, 2)}

//                   />
//                 </Form.Item>
//               </Col>

//               <Col span={24}>
//                 <Form.Item
//                   name="bill_amount"
//                   label="Grand Total"
//                   layout="horizontal"
//                   labelCol={{
//                     span: 14,
//                   }}
//                   labelAlign="left"
//                 >
//                   <InputNumber
//                     type="number"
//                     placeholder="Total Amount"
//                     precision={2}
//                     disabled
//                     style={{width:"100%"}}
//                     className="inputTextBlack"
//                     value={chargesSum}
//                   />
//                 </Form.Item>
//               </Col>
//               </div>
//               <div className="col-4">
//               <Col span={24}>
//               <Form.Item
//                   name="claimable_doctor_fee"
//                   // label="Claimable Amounts"
//                 >
//                   <InputNumber
//                     type="number"
//                     placeholder=""
//                     precision={2}
//                     disabled
//                     className="inputTextBlack"
//                     style={{width:"47%"}}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={24}>
//               <Form.Item
//                   name="claimable_pharmacy_fee"
//                 >
//                   <InputNumber
//                     type="number"
//                     placeholder=""
//                     precision={2}
//                     disabled
//                     className="inputTextBlack"
//                     style={{width:"47%"}}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={24}>
//               <Form.Item
//                   name="claimable_lab_test_fee"
//                 >

//                   <InputNumber
//                     type="number"
//                     placeholder=""
//                     precision={2}
//                     disabled
//                     className="inputTextBlack"
//                     style={{width:"47%"}}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={24}>
//               <Form.Item
//                   name="claimable_amount"
//                 >
//                   <InputNumber
//                     type="number"
//                     placeholder=""
//                     precision={2}
//                     disabled
//                     rules={[{
//                       type:"number",
//                       min: 1,
//                       message:"Min Amount ₹0"
//                     }]}
//                     className="inputTextBlack"
//                     style={{width:"47%"}}
//                   />
//                 </Form.Item>
//               </Col>
//               </div>
//             </div></>)}
//             {subscribedPlan?.claim_combination === CONSTANTS.CLAIM_COMBINATION.PHARMACY_LAB_COMBINED && (<>
//               <div className="row mt-3">

//               <div className="col-4">
//               <Col span={24}>
//               <Form.Item
//                   name="doctor_fee"
//                   label={<span className="text-start ms-0">Doctor's Fees</span>}
//                   layout="horizontal"
//                   labelAlign="left"
//                   labelCol={{
//                     span: 14,
//                   }}
//                   rules={[{
//                     type:"number",
//                     min: 1,
//                     message:"Min Amount ₹1"
//                   },
//                   {
//                     type:"number",
//                     max: 100000,
//                     message:`Max amount ₹100000`
//                   },
//                   ]}

//                 >
//                   <InputNumber
//                     type="number"
//                     placeholder="Doctor's fees"
//                     precision={2}
//                     // disabled={isClaimsDetails}
//                     style={{width:"100%"}}
//                     onChange={(value) => handleChargesChange(value, "consultation")}
//                     onBlur={(e) => handleBlur(e.target.value, 0)}

//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={24} >
//               <Form.Item
//                   name="combined_pharmacy_test_fees"
//                   label= {<span className="text-start">Pharmacy + Diagnostics</span>}
//                   layout="horizontal"
//                   labelAlign="left"
//                   labelCol={{
//                     span: 14,
//                   }}
//                   rules={[{
//                     type:"number",
//                     min: 0,
//                     message:"Min Amount ₹0"
//                   },
//                   {
//                     type:"number",
//                     max: 100000,
//                     message:`Max amount ₹100000`
//                   },
//                   ]}

//                 >
//                   <InputNumber
//                     type="number"
//                     placeholder="Pharmacy Charges"
//                     precision={2}
//                     min={0}
//                     // disabled={isClaimsDetails}
//                     style={{width:"100%"}}
//                     onChange={(value) => handleChargesChange(value, "combined_pharmacy_test")}
//                     onBlur={(e) => handleBlur(e.target.value, 3)}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={24}>
//                 <Form.Item
//                   name="bill_amount"
//                   label="Grand Total"
//                   layout="horizontal"
//                   labelCol={{
//                     span: 14,
//                   }}
//                   labelAlign="left"
//                 >
//                   <InputNumber
//                     type="number"
//                     placeholder="Total Amount"
//                     precision={2}
//                     disabled
//                     style={{width:"100%"}}
//                     className="inputTextBlack"
//                     value={chargesSum}
//                   />
//                 </Form.Item>
//               </Col>
//               </div>
//               <div className="col-4">
//               <Col span={24}>
//               <Form.Item
//                   name="claimable_doctor_fee"
//                   // label="Claimable Amounts"
//                 >
//                   <InputNumber
//                     type="number"
//                     placeholder=""
//                     precision={2}
//                     disabled
//                     className="inputTextBlack"
//                     style={{width:"47%"}}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={24}>
//               <Form.Item
//                   name="claimable_combined_pharmacy_test_fees"
//                 >
//                   <InputNumber
//                     type="number"
//                     placeholder=""
//                     precision={2}
//                     disabled
//                     className="inputTextBlack"
//                     style={{width:"47%"}}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={24}>
//               </Col>
//               <Col span={24}>
//               <Form.Item
//                   name="claimable_amount"
//                 >
//                   <InputNumber
//                     type="number"
//                     placeholder=""
//                     precision={2}
//                     disabled
//                     className="inputTextBlack"
//                     style={{width:"47%"}}
//                   />
//                 </Form.Item>
//               </Col>
//               </div>
//             </div>
//             </>)}
//             <Row gutter={16}>

//             </Row>

//             <Row className="d-flex justify-content-between">
//               <Col span={10}>
//   {
//     !isClaimsDetails && (
//       <div className="container mt-3 mb-4">
//       <p className="font-weight-bold d-inline" style={{ display: 'inline', fontWeight: 'bold' }}>Note-</p>
//       <ul style={{ display: 'inline', listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
//         <li style={{ display: 'inline' }}> • <span className="text-danger">All * marked fields are mandatory.</span></li>
//       </ul>
//       <ul style={{ listStyleType: 'none', paddingLeft: "2.3rem", margin: 0 }}>
//        <li className="me-1"> • <span className="text-danger">OPD claims should be submitted within 7 days of OPD visit.</span></li>
//       </ul>
//     </div>
//     )
//   }

//               </Col>
//               <Col span={1}>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   className="my-4 px-3"
//                   onClick={handleNext}
//                   hidden={isClaimsDetails}
//                 >
//                   Next
//                 </Button>
//               </Col>
//             </Row>
//             {isClaimsDetails && (
//               <>
//                 <h5 className="my-4 text-purple">Uploaded Documents</h5>
//                 <Row className="d-flex justify-content-end">
//                   <Col span={24}>
//                     <table className="table table-responsive p-3 ">
//                       <thead >
//                         <tr>
//                           <th className="custom-thead">Document Type</th>
//                           <th className="custom-thead">Documents</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                       <tr>
//                           <td className="text-purple">Doctor's Prescription</td>
//                           <td>
//                             {prescription?.map((url, index) => (
//                               <span key={index}>
//                                 <a href={url} target="_blank">{`Prescription_${index + 1},`}</a>
//                                 &nbsp;&nbsp;&nbsp;
//                               </span>
//                             ))}
//                           </td>
//                         </tr>
//                         <tr>
//                           <td>Doctor's Fee Bill</td>
//                           <td>
//                             {fee_receipt?.map((url, index) => (
//                               <span key={index}>
//                                 <a href={url} target="_blank">{`Doctor_Fee_${index + 1},`}</a>
//                                 &nbsp;&nbsp;&nbsp;
//                               </span>
//                             ))}
//                           </td>
//                         </tr>

//                         <tr>
//                           <td>Diagnostics Bills </td>
//                           <td>
//                             {test_receipt?.map((url, index) => (
//                               <span key={index}>
//                                 <a href={url} target="_blank">{`Diagostics_Bill_${index + 1},`}</a>
//                                 &nbsp;&nbsp;&nbsp;
//                               </span>
//                             ))}
//                           </td>
//                         </tr>
//                         <tr>
//                           <td>Diagnostics Reports</td>
//                           <td>
//                             {test_reports?.map((url, index) => (
//                               <span key={index}>
//                                 <a href={url} target="_blank">{`Report_${index + 1},`}</a>
//                                 &nbsp;&nbsp;&nbsp;
//                               </span>
//                             ))}
//                           </td>
//                         </tr>
//                         <tr>
//                           <td>Pharmacy Bill</td>
//                           <td>
//                             {pharmacy_receipt?.map((url, index) => (
//                               <span key={index}>
//                                 <a href={url} target="_blank">{`Pharmacy_Bill_${
//                                   index + 1
//                                 },`}</a>
//                                 &nbsp;&nbsp;&nbsp;
//                               </span>
//                             ))}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </Col>
//                 </Row>
//                 {/* <Button
//                   type="primary"
//                   htmlType="submit"
//                   className="my-4 px-3"
//                   onClick={handleNext}
//                   // hidden={isClaimsDetails}
//                   hidden={(isClaimsDetails && claimStatus !== CONSTANTS.CLAIM_STATUS.STATUS.CLARIFICATION ) || userReaction}

//                 >
//                   Upload Documents
//                 </Button> */}
//               </>
//             )}
//             {(claimStatus !== null  ) &&  (
//               <>
//                 <h5 className="my-4 text-purple">Messages</h5>
//                 <Row className="d-flex justify-content-end">
//                   <Col span={24}>
//                   <table className="table table-bordered my-4 table-hover">
//         <thead className="thead-dark">
//           <tr >
//             <th className="custom-thead form-label lightgreen fs-6 text-center table-heading-color col-1">
//               S.No.
//             </th>
//             <th className="custom-thead form-label lightgreen fs-6 text-center table-heading-color col-2">
//               Date Time
//             </th>
//             <th className="custom-thead form-label lightgreen fs-6 text-center table-heading-color col-2">
//               By
//             </th>
//             <th className="custom-thead form-label lightgreen fs-6 text-left table-heading-color">
//               Remarks
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {  messages?.map((data, index) => (
//             <>{(data.message !=null )&&<tr key={index}>
//               <td className="col-1">{index + 1}</td>
//               <td className="col-2">
//                 {data.createdAt
//                   ? dayjs(data.createdAt).format("DD/MM/YYYY - hh:mm:ss A")
//                   : "-"}
//               </td>
//               <td className="col-3">
//                 {data.approver_id === null ? <p>Subsciber</p> : <p>Support</p>}
//               </td>
//               <td>{data.message}</td>
//             </tr>}</>
//           ))}
//         </tbody>
//       </table>
//                   </Col>
//                 </Row>
//                 <div className="text-end">
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   className="my-4 px-3"
//                   onClick={handleNext}
//                   hidden={(isClaimsDetails && claimStatus !== CONSTANTS.CLAIM_STATUS.STATUS.CLARIFICATION ) || userReaction}

//                 >
//                   Re-upload Documents
//                 </Button>
//                 </div>
//               </>
//             )}
//           </Form>
//           {( action === CONSTANTS.CLAIM_STATUS.STATUS.DISPUTE && !dispute ) &&     (<div>
//         <>  <h5 className="my-4 text-purple">Dispute</h5><Form
//     form = {disputeForm}
//     layout="vertical"
//     onFinish={onFinishDispute}
//   >
//      <Form.Item
//       label="Date"
//       name="dispute_date"
//     >

//        <DatePicker
//       showTime
//      format={"DD/MM/YYYY hh:mm:ss A"}
//      defaultValue={dayjs()}
//      disabled
//     />
//     </Form.Item>

//     <Row>
//       <Col span={6}>
//       <DocumentUploader
//                     action={action}
//                     onFilesChange={(files) => setDisputeFiles(files)}
//                     imageprop = {disputeimg}
//                     alttext="icon"
//                     />
//       </Col>
//     </Row>

//     <Form.Item
//       label="Raise Concern"
//       name="user_remark"

//       rules={[
//         {
//           required: true,
//           message:"Remark is required"
//         },
//       ]}
//     >
//       <TextArea  showCount maxLength={1000} autoSize={{
//           minRows: 4,
//           maxRows: 8,
//         }}/>
//     </Form.Item>

//     <Form.Item label=" ">
//       <Row justify={"end"}>
//         <Col>
//         <Button
//                   type="primary"
//                   htmlType="submit"
//                   className=""
//                   hidden ={ action !== CONSTANTS.CLAIM_STATUS.STATUS.DISPUTE }
//                   disabled={(!isClaimsDetails && (claimStatus !== CONSTANTS.CLAIM_STATUS.STATUS.DISPUTE || dispute)) }
//                 >
//                   Raise Dispute
//                 </Button>
//         </Col>
//       </Row>

//     </Form.Item>
//            </Form>
//            </>
//                 </div>)  }
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserClaimsForm;






import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Radio,
  notification,
  InputNumber,
  Tooltip,
  Modal,
} from "antd";
const { Option } = Select;
const { confirm } = Modal;
import codes from "country-calling-code";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { LeftCircleOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import config, { CONFIG_OBJ_DOC, CONFIG_OBJ } from "../../config/config";
import { Axios } from "../../axios/axiosFunctions";
import CONSTANTS from "../../constant/Constants";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import DocumentUploader from "../../components/DocumentUploader";
import disputeimg from "../../assets/dispute.jfif";
import doctor from "../../assets/doctor.jfif";
const { TextArea } = Input;

const UserClaimsForm = () => {
  const [defaultForm, setDefaultForm] = useState(
    null || JSON.parse(sessionStorage.getItem("opdClaimForm"))
  );
  const { data: subscribedPlan } = useAxiosFetch(config.GetSubscribedPlan);
  const { data: specializations } = useAxiosFetch(
    config.GetAllSpecialization + "?pageSize=1000"
  );
  const docCountryCode =
    defaultForm && defaultForm.doc_country_code
      ? defaultForm.doc_country_code
      : "+91";
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id)

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const action = Number(queryParams.get("action"));
  const [opdClaimForm] = Form.useForm();
  const [claim, setClaim] = useState(1);
  const [stateList, setStateList] = useState([]);
  const [nameList, setNameList] = useState([]);
  const [isClaimsDetails, setIsClaimsDetails] = useState(false);
  const [claimStatus, setClaimStatus] = useState(null);
  const [userReaction, setUserReaction] = useState(undefined);
  const [userData, setUserData] = useState({});
  const [chargesSum, setChargesSum] = useState(0);
  const [messages, setMessages] = useState(null);
  const [disputeForm] = Form.useForm();
  const [dispute, setUserDispute] = useState(undefined);
  const [disputeFiles, setDisputeFiles] = useState([]);
  const [disputeFilesUrl, setDisputeFilesUrl] = useState([]);
  const fetchUserClaimsData = async () => {
    const response = await Axios.fetchAxiosData(
      config.GetClaims + id
      // CONFIG_OBJ
    );
    const formattedData = {
      ...response.data,
      opd_date: dayjs(response.data.opd_date),
    };

    setUserData(response.data);
    setIsClaimsDetails(true);
    setClaimStatus(response.data.status);
    setUserReaction(response.data.subscriber_reaction);
    setMessages(response.data.subscriber_remark);
    opdClaimForm.setFieldsValue(formattedData);
    setUserDispute(response.data.dispute);
  };

  const {
    fee_receipt,
    prescription,
    pharmacy_receipt,
    test_receipt,
    test_reports,
  } = userData || {};

  const disableDobHandler = (current) => {
    return (
      current && (current > dayjs() || current < dayjs().subtract(7, "day"))
    );
  };

  const onClaimChange = (e) => {
    setClaim(e.target.value);
  };

  const fetchStateData = async () => {
    const stateListData = await Axios.fetchAxiosData(config.GetStateList);
    setStateList(stateListData.data);
  };

  const fetchMemberData = async () => {
    const memberData = await Axios.fetchAxiosData(config.GetMembers);
    const paidMembersData = memberData.data.filter(
      (m) => m.plan_status === CONSTANTS.PLAN_STATUS.PAID
    );
    setNameList(paidMembersData);
  };

  useEffect(() => {
    fetchMemberData();
    fetchStateData();
  }, []);

  useEffect(() => {
    if (id) {
      fetchUserClaimsData();
    }
  }, [id]);

  // console.log(defaultForm)

  // const handleNext = async () => {
  //   const values = await opdClaimForm.validateFields();
  //   sessionStorage.setItem(
  //     "opdClaimForm",
  //     JSON.stringify({
  //       ...values,
  //       claim_combination: subscribedPlan?.claim_combination,
  //     })
  //   );
  //   console.log("yhyh66",values)
  //   navigate(`/user/upload-claim-documents/?action=${action}`, {
  //     state: { values, claim_combination: subscribedPlan?.claim_combination },
  //   });
  // };

  const handleNext = async () => {
    try {
       const claimableLabFees =
      opdClaimForm.getFieldValue("claimable_lab_test_fee") || 0;
    const claimableDocFees =
      opdClaimForm.getFieldValue("claimable_doctor_fee") || 0;
    const claimablePharmacyFees =
      opdClaimForm.getFieldValue("claimable_pharmacy_fee") || 0;
    const combinedPharmacyLabFees =
      opdClaimForm.getFieldValue("claimable_combined_pharmacy_test_fees") || 0;

      const totalclaimableAmount = claimableDocFees + claimableLabFees + claimablePharmacyFees + combinedPharmacyLabFees
      // Get values from user-editable fields
      const validatedValues = await opdClaimForm.validateFields();
  
      // Create the complete object to save/pass
      const valuesToSubmit = {
        ...validatedValues, // Values from user input
  
        // Manually add the approved values from the original source
        _id: id, // Ensure _id is included if not already handled by a hidden field
        approved_claimable_amount: totalclaimableAmount || 0,
        approved_claimable_doctor_fee : claimableDocFees || 0,
        approved_claimable_lab_test_fee: claimableLabFees || 0,
        approved_claimable_pharmacy_fee: claimablePharmacyFees || 0,
        approved_claimable_combined_pharmacy_test_fees:  combinedPharmacyLabFees || 0,
      };
  
      sessionStorage.setItem(
        "opdClaimForm",
        JSON.stringify({
          ...valuesToSubmit, // Use the merged object
          claim_combination: subscribedPlan?.claim_combination,
        })
      );
  
      console.log("Values being submitted:", valuesToSubmit); // Log the final object
  
      navigate(`/user/upload-claim-documents/?action=${action}`, {
        state: { values: valuesToSubmit, claim_combination: subscribedPlan?.claim_combination }, // Pass the merged object
      });
  
    } catch (errorInfo) {
      console.log('Validation Failed:', errorInfo);
      // Handle validation errors (e.g., scroll to first error)
    }
  };

  const onFinishDispute = async (values) => {
    confirm({
      title: <h4>Confirmation !</h4>,
      content: (
        <div>
          <p> Are you sure you want to raise dispute for the selected claim?</p>
        </div>
      ),
      icon: <ExclamationCircleFilled />,
      centered: true,
      async onOk() {
        const files = (await handleDocumentSubmit()) || [];
        try {
          const data = await Axios.patchAxiosData(
            config.RaiseClaimDispute + id,
            { user_remark: values.user_remark, files: files.data }
          );
          if (data.success === true) {
            notification.success({
              message: "Dispute raised successfully",
            });
            navigate(`/user/claims/`, { replace: true });
          } else {
            notification.error({
              message: "Failed to rasie dispute.",
            });
          }
        } catch (error) {
          notification.error({
            message: error.response.message,
          });
        }
        disputeForm.resetFields();
      },
      onCancel() {},
    });
  };

  const handleChargesChange = (value, chargeType) => {
    if (chargeType === "pharmacy") {
      opdClaimForm.setFieldsValue({ pharmacy_charges: value });
    } else if (chargeType === "lab") {
      opdClaimForm.setFieldsValue({ lab_test_charges: value });
    } else if (chargeType === "consultation") {
      opdClaimForm.setFieldsValue({ consultation_charges: value });
    } else if (chargeType === "combined_pharmacy_test") {
      opdClaimForm.setFieldsValue({ combined_pharmacy_test_fees: value });
    }

    const pharmacyCharges = opdClaimForm.getFieldValue("pharmacy_charges") || 0;
    const labTestCharges = opdClaimForm.getFieldValue("lab_test_charges") || 0;
    const consultationCharges =
      opdClaimForm.getFieldValue("consultation_charges") || 0;
    const combinedPharmacyTestCHanrger =
      opdClaimForm.getFieldValue("combined_pharmacy_test_fees") || 0;

    const sum =
      pharmacyCharges +
      labTestCharges +
      consultationCharges +
      combinedPharmacyTestCHanrger;
    setChargesSum(sum);
    opdClaimForm.setFieldsValue({ bill_amount: sum });
  };
  const handleBlur = async (value, parameter) => {
    if (value < 0) return;

    if (parameter === 0) {
      try {
        if (value === 0 || value === "") {
          opdClaimForm.setFieldsValue({ claimable_doctor_fee: 0.0 });
          opdClaimForm.setFieldsValue({ doctor_fee: 0.0 });
          return;
        }
        const response = await Axios.fetchAxiosData(
          config.GetClaimableAmount + `?amount=${value}&parameter=${parameter}`
        );
        const finalPrice = response.data.finalPrice;
        opdClaimForm.setFieldsValue({ claimable_doctor_fee: finalPrice });
      } catch (error) {
        notification.error({
          message: "Failed to get OPD claimable amount",
        });
      }
    } else if (parameter === 1) {
      try {
        if (value === 0 || value === "") {
          opdClaimForm.setFieldsValue({ claimable_pharmacy_fee: 0.0 });
          opdClaimForm.setFieldsValue({ pharmacy_fee: 0.0 });
          return;
        }
        const response = await Axios.fetchAxiosData(
          config.GetClaimableAmount + `?amount=${value}&parameter=${parameter}`
        );
        const finalPrice = response.data.finalPrice;
        opdClaimForm.setFieldsValue({ claimable_pharmacy_fee: finalPrice });
      } catch (error) {
        notification.error({
          message: "Failed to get Pharmacy claimable amount",
        });
      }
    } else if (parameter === 2) {
      try {
        if (value === 0 || value === "") {
          opdClaimForm.setFieldsValue({ claimable_lab_test_fee: 0.0 });
          opdClaimForm.setFieldsValue({ lab_test_fee: 0.0 });
          return;
        }
        const response = await Axios.fetchAxiosData(
          config.GetClaimableAmount + `?amount=${value}&parameter=${parameter}`
        );
        const finalPrice = response.data.finalPrice;
        opdClaimForm.setFieldsValue({ claimable_lab_test_fee: finalPrice });
      } catch (error) {
        notification.error({
          message: "Failed to get Lab Tests claimable amount",
        });
      }
    } else if (parameter === 3) {
      try {
        if (value === 0 || value === "") {
          opdClaimForm.setFieldsValue({
            claimable_combined_pharmacy_test_fees: 0.0,
          });
          opdClaimForm.setFieldsValue({ combined_pharmacy_test_fees: 0.0 });
          return;
        }
        const response = await Axios.fetchAxiosData(
          config.GetClaimableAmount + `?amount=${value}&parameter=${parameter}`
        );
        const finalPrice = response.data.finalPrice;
        opdClaimForm.setFieldsValue({
          claimable_combined_pharmacy_test_fees: finalPrice,
        });
      } catch (error) {
        notification.error({
          message: "Failed to get Pharmacy & Diagnostics claimable amount",
        });
      }
    }
    const claimableLabFees =
      opdClaimForm.getFieldValue("claimable_lab_test_fee") || 0;
    const claimableDocFees =
      opdClaimForm.getFieldValue("claimable_doctor_fee") || 0;
    const claimablePharmacyFees =
      opdClaimForm.getFieldValue("claimable_pharmacy_fee") || 0;
    const combinedPharmacyLabFees =
      opdClaimForm.getFieldValue("claimable_combined_pharmacy_test_fees") || 0;
    const finalClaimableAmount =
      claimableLabFees +
      claimableDocFees +
      claimablePharmacyFees +
      combinedPharmacyLabFees;
    opdClaimForm.setFieldsValue({ claimable_amount: finalClaimableAmount });
  };

  const handleDocumentSubmit = async () => {
    try {
      if (disputeFiles.length > 0) {
        const formData = new FormData();
        disputeFiles.forEach((file) => {
          formData.append("files", file.file);
        });

        const response = await Axios.postAxiosData(
          config.UploadClaim,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.success) {
          return { data: response.data };
        } else {
          throw new Error(`Failed to upload documents`);
        }
      }
      const uploadPromises = disputeFiles?.map(
        async ({ files, documentType }) => {
          if (files.length > 0) {
            const formData = new FormData();
            files.forEach((file) => {
              formData.append("files", file.file);
            });

            const response = await Axios.postAxiosData(
              config.UploadClaim,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            if (response.success) {
              return { documentType, data: response.data.data };
            } else {
              throw new Error(`Failed to upload ${documentType} documents`);
            }
          }
          return null;
        }
      );

      const results = await Promise.all(uploadPromises);
      const documents = results.reduce((acc, result) => {
        if (result) {
          acc[result.documentType] = result.data;
        }
        return acc;
      }, {});

      setDisputeFilesUrl(documents);
    } catch (error) {
      notification.error({
        message: "Failed to upload documents",
      });
    }
  };

  return (
    <>
      <div className="container bg-white">
        <div className="row">
          <Link
            to="/user/claims"
            onClick={() => {
              sessionStorage.removeItem("opdClaimForm");
            }}
          >
            <LeftCircleOutlined className="text-purple fs-3" />
          </Link>

          <div className="d-flex align-items-center gap-3 my-0 py-0 mb-3 mt-2">
            {isClaimsDetails ? (
              <h4 className="my-1 text-purple">Claims Details</h4>
            ) : (
              <h4 className="my-1">Claims Form</h4>
            )}
          </div>

          <Form
            form={opdClaimForm}
            layout="vertical"
            disabled={
              (isClaimsDetails &&
                claimStatus !== CONSTANTS.CLAIM_STATUS.STATUS.CLARIFICATION) ||
              (claimStatus === CONSTANTS.CLAIM_STATUS.STATUS.CLARIFICATION &&
                userReaction)
            }
            initialValues={{
              _id: defaultForm?._id,
              claim_type: defaultForm?.claim_type,
              doc_name: defaultForm?.doc_name,
              city: defaultForm?.city,
              approved_claimable_amount: defaultForm?.claimable_amount || 0,
              approved_claimable_doctor_fee : defaultForm?.claimable_doctor_fee || 0,
              approved_claimable_lab_test_fee: defaultForm?.claimable_lab_test_fee || 0,
              approved_claimable_pharmacy_fee: defaultForm?.claimable_pharmacy_fee || 0,
              approved_claimable_combined_pharmacy_test_fees: defaultForm?.claimable_combined_pharmacy_test_fees || 0,
              doc_registration: defaultForm?.doc_registration,
              diagonosis_detail: defaultForm?.diagonosis_detail,
              specialization: defaultForm?.specialization,
              hospital: defaultForm?.hospital,
              pincode: defaultForm?.pincode,
              doc_address: defaultForm?.doc_address,
              bill_amount: defaultForm?.bill_amount || 0,
              member_id: defaultForm?.member_id,
              opd_date: defaultForm?.opd_date && dayjs(defaultForm?.opd_date),
              doctor_fee: defaultForm?.doctor_fee || 0,
              lab_test_fee: defaultForm?.lab_test_fee || 0,
              pharmacy_fee: defaultForm?.pharmacy_fee || 0,
              combined_pharmacy_test_fees: defaultForm?.combined_pharmacy_test_fees || 0,
              claimable_amount: defaultForm?.claimable_amount || 0,
              claimable_doctor_fee: defaultForm?.claimable_doctor_fee || 0,
              claimable_lab_test_fee: defaultForm?.claimable_lab_test_fee || 0,
              claimable_pharmacy_fee: defaultForm?.claimable_pharmacy_fee || 0,
              claimable_combined_pharmacy_test_fees: defaultForm?.claimable_combined_pharmacy_test_fees || 0,
              doc_email: defaultForm?.doc_email,
              doc_phone: defaultForm?.doc_phone,
              doc_country_code: docCountryCode,
            }}
          >
            <Row>
              <Col>
                <Form.Item label="ClaimId" name="_id" hidden>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
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
                  <Select
                    placeholder="Select patient"
                    // disabled={isClaimsDetails}
                  >
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
                  name="opd_date"
                  label="OPD Visit Date"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your OPD Visit Date",
                    },
                  ]}
                >
                  <DatePicker
                    placeholder="Select Date"
                    format="DD/MM/YYYY"
                    style={{ width: "50%" }}
                    disabledDate={disableDobHandler}
                    // disabled={isClaimsDetails}
                  />
                </Form.Item>
              </Col>
            </Row>
            <h5 className="my-4 text-purple">Doctor's Details</h5>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={8}>
                <Form.Item
                  name="doc_name"
                  label="Doctor's Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your doctor's name",
                    },
                    {
                      regex: CONSTANTS.REGEX.DOCTOR_NAME,
                      message: "Invalid doctor name",
                    },
                  ]}
                >
                  <Input
                    placeholder="Doctor's name"
                    // disabled={isClaimsDetails}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8}>
                <Tooltip placement="topLeft" title="Medical Council Of India">
                  <Form.Item
                    name="doc_registration"
                    label="Registration No."
                    rules={[
                      {
                        required: true,
                        message: "Please enter doctor Regn. No.",
                      },
                      {
                        pattern: CONSTANTS.REGEX.DOC_REGESTRATION,
                        message: "Alpha numeric and - / . allowed ",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Registration no"
                      // disabled={isClaimsDetails}
                    />
                  </Form.Item>
                </Tooltip>
              </Col>

              <Col xs={24} sm={24} md={12} lg={8}>
                <Form.Item name="specialization" label="Specialization">
                  <Select placeholder="Select Specialization">
                    {specializations?.records?.map((s) => (
                      <Option key={s._id} value={s.name} label={s.name}>
                        {s.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={8}>
                <Form.Item
                  name="hospital"
                  label="Hospital / Clinic Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Hospital / Clinic name",
                    },
                  ]}
                >
                  <Input
                    placeholder="Hospital / Clinic name"
                    // disabled={isClaimsDetails}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={8}>
                <Form.Item
                  name="city"
                  label="City"
                  rules={[
                    {
                      required: true,
                      message: "Please enter city name",
                    },
                    {
                      regex: CONSTANTS.REGEX.DOCTOR_NAME,
                      message: "Invalid city name",
                    },
                  ]}
                  style={{ marginBottom: "10px" }}
                >
                  <Input
                    placeholder="Enter city name"
                    type="text"
                    // disabled={isClaimsDetails}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8}>
                <Form.Item
                  name="pincode"
                  label="Pincode"
                  style={{ marginBottom: "10px" }}
                  rules={[
                    {
                      required: true,
                      message: "Please enter pincode",
                    },
                    {
                      pattern: CONSTANTS.REGEX.PINCODE,
                      message: "Enter valid pincode",
                    },
                  ]}
                >
                  {/* <Select placeholder="Select state" 
                  // disabled={isClaimsDetails}
                  >
                    {stateList?.map((state) => (
                      <Option key={state.id} value={state.id}>
                        {state.name}
                      </Option>
                    ))}
                  </Select> */}
                  <Input
                    placeholder="pincode"
                    type="text"
                    // disabled={isClaimsDetails}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={8}>
                <Form.Item
                  name="doc_address"
                  label="Address"
                  style={{ marginBottom: "10px" }}
                  rules={[
                    {
                      required: true,
                      message: "Please enter address",
                    },
                  ]}
                >
                  <TextArea
                    placeholder="Enter Address"
                    autoSize
                    // ={{ minRows: 2 }}
                    style={{ overflowY: "hidden" }}
                    // disabled={isClaimsDetails}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8}>
                <Form.Item
                  name="doc_email"
                  label="Email"
                  style={{ marginBottom: "10px" }}
                  rules={[
                    {
                      type: "email",
                      message: "Enter valid E-mail!",
                    },
                  ]}
                >
                  <Input
                    placeholder="doctor@email.com"
                    type="email"
                    //  disabled={isClaimsDetails}
                  />
                </Form.Item>
              </Col>
              <div className=" d-flex gap-0 col-4">
                <Col xs={24} sm={24} md={12} lg={8}>
                  <Form.Item
                    name="doc_country_code"
                    label="Mobile"
                    rules={[
                      { required: true, message: "Country code is required" },
                    ]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      defaultValue="+91"
                      placeholder="code"
                      style={{ width: "100%" }}
                      disabled
                    >
                      {codes?.map((country) => (
                        <Option
                          key={country.isoCode2}
                          value={country.countryCodes[0]}
                        >
                          {`+${country.countryCodes[0]}`}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8}>
                  <Form.Item
                    name="doc_phone"
                    label={
                      <span className="text-black d-none">Mobile No.</span>
                    }
                    rules={[{ required: true, message: "Mobile is required" }]}
                    labelCol={{ span: 0 }}
                    style={{ marginTop: "1.9rem" }}
                  >
                    <Input
                      type="tel"
                      style={{
                        width: "100%",
                      }}
                      placeholder="mobile no."
                      maxLength={13}
                    />
                  </Form.Item>
                </Col>
              </div>
            </Row>

            <Row className="mt-3" gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={8}>
                <Form.Item
                  name="diagonosis_detail"
                  label="Reason for Doctor Consultation"
                  rules={[
                    {
                      required: true,
                      message: "Diagnosis Details is required",
                    },
                  ]}
                  style={{ marginBottom: "10px" }}
                >
                  <TextArea
                    placeholder="Enter Diagnosis Details"
                    autoSize
                    // ={{ minRows: 2 }}
                    style={{ overflowY: "hidden" }}
                    // disabled={isClaimsDetails}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8}>
                <Form.Item
                  name="user_remark"
                  label="Additional Information (if any)"
                  style={{ marginBottom: "10px" }}
                >
                  <Input
                    placeholder="Add Remarks (if any)"
                    autoSize
                    // ={{ minRows: 2 }}
                    style={{ overflowY: "hidden" }}
                    // disabled={isClaimsDetails}
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className="row mt-3">
              <div className="col-6">
                <h6 className="fw-bold">Actual Bill Amounts</h6>
              </div>
              <div className="col-6">
                <h6 className="fw-bold">Claimable Amounts</h6>
              </div>
            </div>

            {subscribedPlan?.claim_combination ===
              CONSTANTS.CLAIM_COMBINATION.SEPERATE && (
              <>
                <div className="row mt-3">
                  <div className="col-12">
                    <div>
                      <label className="text-start ms-0 " style={{fontWeight:'bold'}}>Doctor's Fees</label>
                    </div>
                    <div className="col-12 d-flex">
                      <div className="col-6">
                    {/* <Col span={12}> */}
                      <Form.Item
                        name="doctor_fee"
                        // label={
                        //   <span className="text-start ms-0">Doctor's Fees</span>
                        // }
                        layout="horizontal"
                        labelAlign="left"
                        labelCol={{
                          span: 14,
                        }}
                        rules={[
                          {
                            type: "number",
                            min: 1,
                            message: "Min Amount ₹1",
                          },
                          {
                            type: "number",
                            max: 100000,
                            message: `Max amount ₹100000`,
                          },
                        ]}
                      >
                        <InputNumber
                          type="number"
                          placeholder="Doctor's fees"
                          precision={2}
                          // disabled={isClaimsDetails}
                          style={{ width: "80%" }}
                          onChange={(value) =>
                            handleChargesChange(value, "consultation")
                          }
                          onBlur={(e) => handleBlur(e.target.value, 0)}
                        />
                      </Form.Item>
                      {/* </Col> */}
                      </div>
                      <div className="col-6">
                      {/* <Col span={24}> */}

                      <Form.Item
                        name="claimable_doctor_fee"
                        // label="Claimable Amounts"
                      >
                        <InputNumber
                          type="number"
                          placeholder=""
                          precision={2}
                          disabled
                          className="inputTextBlack"
                          style={{ width: "80%" }}
                        />
                      </Form.Item>
                    {/* </Col> */}
                    </div>
                    </div>
                    </div>

                    <div className="col-12">
                    <div>
                      <label className="text-start ms-0"  style={{fontWeight:'bold'}}>Bill Amt. For Pharmacy</label>
                    </div>
                    <div className="col-12 d-flex">
                      <div className="col-6">
                    {/* <Col span={12}> */}
                    <Form.Item
                        name="pharmacy_fee"
                        // label={
                        //   <span className="text-start lh-sm">
                        //     Bill Amt. For Pharmacy
                        //   </span>
                        // }
                        layout="horizontal"
                        labelAlign="left"
                        // style={{ width: "80%" }}
                        labelCol={{
                          span: 14,
                        }}
                        rules={[
                          {
                            type: "number",
                            min: 0,
                            message: "Min Amount ₹0",
                          },
                          {
                            type: "number",
                            max: 100000,
                            message: `Max amount ₹100000`,
                          },
                        ]}
                      >
                        <InputNumber
                          type="number"
                          placeholder="Pharmacy Charges"
                          precision={2}
                          min={0}
                          // disabled={isClaimsDetails}
                          style={{ width: "80%" }}
                          onChange={(value) =>
                            handleChargesChange(value, "pharmacy")
                          }
                          onBlur={(e) => handleBlur(e.target.value, 1)}
                        />
                      </Form.Item>
                      {/* </Col> */}
                      </div>
                      <div className="col-6">
                      {/* <Col span={24}> */}

                      <Form.Item name="claimable_pharmacy_fee">
                        <InputNumber
                          type="number"
                          placeholder=""
                          precision={2}
                          disabled
                          className="inputTextBlack"
                          style={{ width: "80%" }}
                        />
                      </Form.Item>
                    {/* </Col> */}
                    </div>
                    </div>
                    </div>

                    <div className="col-12">
                    <div>
                      <label className="text-start ms-0"  style={{fontWeight:'bold'}}>Bill Amt. For Diagnostics</label>
                    </div>
                    <div className="col-12 d-flex">
                      <div className="col-6">
                    {/* <Col span={12}> */}
                    <Form.Item
                        name="lab_test_fee"
                        // label={<span>Bill Amt. For Diagnostics</span>}
                        layout="horizontal"
                        // style={{ width: "80%" }}
                        labelCol={{
                          span: 14,
                        }}
                        labelAlign="left"
                        rules={[
                          {
                            type: "number",
                            min: 0,
                            message: "Min Amount ₹0",
                          },
                          {
                            type: "number",
                            max: 100000,
                            message: `Max amount ₹100000`,
                          },
                        ]}
                      >
                        <InputNumber
                          type="number"
                          placeholder="Lab Test Charges"
                          precision={2}
                          // disabled={isClaimsDetails}
                          style={{ width: "80%" }}
                          onChange={(value) =>
                            handleChargesChange(value, "lab")
                          }
                          onBlur={(e) => handleBlur(e.target.value, 2)}
                        />
                      </Form.Item>
                      {/* </Col> */}
                      </div>
                      <div className="col-6">
                      {/* <Col span={24}> */}

                      <Form.Item name="claimable_lab_test_fee">
                        <InputNumber
                          type="number"
                          placeholder=""
                          precision={2}
                          disabled
                          className="inputTextBlack"
                          style={{ width: "80%" }}
                        />
                      </Form.Item>
                    {/* </Col> */}
                    </div>
                    </div>
                    </div>

                    <div className="col-12">
                    <div>
                      <label className="text-start ms-0"  style={{fontWeight:'bold'}}>Grand Total</label>
                    </div>
                    <div className="col-12 d-flex">
                      <div className="col-6">
                    {/* <Col span={12}> */}
                    <Form.Item
                        name="bill_amount"
                        // label="Grand Total"
                        layout="horizontal"
                        labelCol={{
                          span: 14,
                        }}
                        labelAlign="left"
                      >
                        <InputNumber
                          type="number"
                          placeholder="Total Amount"
                          precision={2}
                          disabled
                          style={{ width: "80%" }}
                          className="inputTextBlack"
                          value={chargesSum}
                        />
                      </Form.Item>
                      {/* </Col> */}
                      </div>
                      <div className="col-6">
                      {/* <Col > */}

                      <Form.Item name="claimable_amount">
                        <InputNumber
                          type="number"
                          placeholder=""
                          precision={2}
                          disabled
                          rules={[
                            {
                              type: "number",
                              min: 1,
                              message: "Min Amount ₹0",
                            },
                          ]}
                          className="inputTextBlack"
                          style={{ width: "80%"}}
                        />
                      </Form.Item>
                    {/* </Col> */}
                    </div>
                    </div>
                    </div>

                </div>
              </>
            )}

            {subscribedPlan?.claim_combination ===
              CONSTANTS.CLAIM_COMBINATION.PHARMACY_LAB_COMBINED && (
              <>
                <div className="row mt-3">
                  {/* <div className="col-6">
                    <Col span={24}>
                      <Form.Item
                        name="doctor_fee"
                        label={
                          <span className="text-start ms-0">Doctor's Fees</span>
                        }
                        layout="horizontal"
                        labelAlign="left"
                        labelCol={{
                          span: 14,
                        }}
                        rules={[
                          {
                            type: "number",
                            min: 1,
                            message: "Min Amount ₹1",
                          },
                          {
                            type: "number",
                            max: 100000,
                            message: `Max amount ₹100000`,
                          },
                        ]}
                      >
                        <InputNumber
                          type="number"
                          placeholder="Doctor's fees"
                          precision={2}
                          // disabled={isClaimsDetails}
                          style={{ width: "100%" }}
                          onChange={(value) =>
                            handleChargesChange(value, "consultation")
                          }
                          onBlur={(e) => handleBlur(e.target.value, 0)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="combined_pharmacy_test_fees"
                        label={
                          <span className="text-start">
                            Pharmacy + Diagnostics
                          </span>
                        }
                        layout="horizontal"
                        labelAlign="left"
                        labelCol={{
                          span: 14,
                        }}
                        rules={[
                          {
                            type: "number",
                            min: 0,
                            message: "Min Amount ₹0",
                          },
                          {
                            type: "number",
                            max: 100000,
                            message: `Max amount ₹100000`,
                          },
                        ]}
                      >
                        <InputNumber
                          type="number"
                          placeholder="Pharmacy Charges"
                          precision={2}
                          min={0}
                          // disabled={isClaimsDetails}
                          style={{ width: "100%" }}
                          onChange={(value) =>
                            handleChargesChange(value, "combined_pharmacy_test")
                          }
                          onBlur={(e) => handleBlur(e.target.value, 3)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="bill_amount"
                        label="Grand Total"
                        layout="horizontal"
                        labelCol={{
                          span: 14,
                        }}
                        labelAlign="left"
                      >
                        <InputNumber
                          type="number"
                          placeholder="Total Amount"
                          precision={2}
                          disabled
                          style={{ width: "100%" }}
                          className="inputTextBlack"
                          value={chargesSum}
                        />
                      </Form.Item>
                    </Col>
                  </div>
                  <div className="col-6">
                    <Col span={24}>
                      <Form.Item
                        name="claimable_doctor_fee"
                        // label="Claimable Amounts"
                      >
                        <InputNumber
                          type="number"
                          placeholder=""
                          precision={2}
                          disabled
                          className="inputTextBlack"
                          style={{ width: "47%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="claimable_combined_pharmacy_test_fees">
                        <InputNumber
                          type="number"
                          placeholder=""
                          precision={2}
                          disabled
                          className="inputTextBlack"
                          style={{ width: "47%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}></Col>
                    <Col span={24}>
                      <Form.Item name="claimable_amount">
                        <InputNumber
                          type="number"
                          placeholder=""
                          precision={2}
                          disabled
                          className="inputTextBlack"
                          style={{ width: "47%" }}
                        />
                      </Form.Item>
                    </Col>
                  </div> */}

                  <div className="col-12">
                    <div>
                      <label className="text-start ms-0 " style={{fontWeight:'bold'}}>Doctor's Fees</label>
                    </div>
                    <div className="col-12 d-flex">
                      <div className="col-6">
                    {/* <Col span={12}> */}
                    <Form.Item
                        name="doctor_fee"
                        // label={
                        //   <span className="text-start ms-0">Doctor's Fees</span>
                        // }
                        layout="horizontal"
                        labelAlign="left"
                        labelCol={{
                          span: 14,
                        }}
                        rules={[
                          {
                            type: "number",
                            min: 1,
                            message: "Min Amount ₹1",
                          },
                          {
                            type: "number",
                            max: 100000,
                            message: `Max amount ₹100000`,
                          },
                        ]}
                      >
                        <InputNumber
                          type="number"
                          placeholder="Doctor's fees"
                          precision={2}
                          // disabled={isClaimsDetails}
                          style={{ width: "80%" }}
                          onChange={(value) =>
                            handleChargesChange(value, "consultation")
                          }
                          onBlur={(e) => handleBlur(e.target.value, 0)}
                        />
                      </Form.Item>
                      {/* </Col> */}
                      </div>
                      <div className="col-6">
                      {/* <Col span={24}> */}

                      <Form.Item
                        name="claimable_doctor_fee"
                        // label="Claimable Amounts"
                      >
                        <InputNumber
                          type="number"
                          placeholder=""
                          precision={2}
                          disabled
                          className="inputTextBlack"
                          style={{ width: "80%" }}
                        />
                      </Form.Item>
                    {/* </Col> */}
                    </div>
                    </div>
                    </div>

                    <div className="col-12">
                    <div>
                      <label className="text-start ms-0 " style={{fontWeight:'bold'}}>Pharmacy + Diagnostics</label>
                    </div>
                    <div className="col-12 d-flex">
                      <div className="col-6">
                    {/* <Col span={12}> */}
                    <Form.Item
                        name="combined_pharmacy_test_fees"
                        // label={
                        //   <span className="text-start">
                        //     Pharmacy + Diagnostics
                        //   </span>
                        // }
                        layout="horizontal"
                        labelAlign="left"
                        labelCol={{
                          span: 14,
                        }}
                        rules={[
                          {
                            type: "number",
                            min: 0,
                            message: "Min Amount ₹0",
                          },
                          {
                            type: "number",
                            max: 100000,
                            message: `Max amount ₹100000`,
                          },
                        ]}
                      >
                        <InputNumber
                          type="number"
                          placeholder="Pharmacy Charges"
                          precision={2}
                          min={0}
                          // disabled={isClaimsDetails}
                          style={{ width: "80%" }}
                          onChange={(value) =>
                            handleChargesChange(value, "combined_pharmacy_test")
                          }
                          onBlur={(e) => handleBlur(e.target.value, 3)}
                        />
                      </Form.Item>
                      {/* </Col> */}
                      </div>
                      <div className="col-6">
                      {/* <Col span={24}> */}

                      <Form.Item name="claimable_combined_pharmacy_test_fees">
                        <InputNumber
                          type="number"
                          placeholder=""
                          precision={2}
                          disabled
                          className="inputTextBlack"
                          style={{ width: "80%" }}
                        />
                      </Form.Item>
                    {/* </Col> */}
                    </div>
                    </div>
                    </div>

                    <div className="col-12">
                    <div>
                      <label className="text-start ms-0 " style={{fontWeight:'bold'}}>Grand Total</label>
                    </div>
                    <div className="col-12 d-flex">
                      <div className="col-6">
                    {/* <Col span={12}> */}
                    <Form.Item
                        name="bill_amount"
                        // label="Grand Total"
                        layout="horizontal"
                        labelCol={{
                          span: 14,
                        }}
                        labelAlign="left"
                      >
                        <InputNumber
                          type="number"
                          placeholder="Total Amount"
                          precision={2}
                          disabled
                          style={{ width: "80%" }}
                          className="inputTextBlack"
                          value={chargesSum}
                        />
                      </Form.Item>
                      {/* </Col> */}
                      </div>
                      <div className="col-6">
                      {/* <Col span={24}> */}

                      <Form.Item name="claimable_amount">
                        <InputNumber
                          type="number"
                          placeholder=""
                          precision={2}
                          disabled
                          className="inputTextBlack"
                          style={{ width: "80%" }}
                        />
                      </Form.Item>
                    {/* </Col> */}
                    </div>
                    </div>
                    </div>
                </div>
              </>
            )}

            <Row gutter={16}></Row>

           
            <Row className="d-flex justify-content-between align-items-center">
              <Col xs={24} sm={24} md={20} lg={20}>
                {!isClaimsDetails && (
                  <div className="container mt-3 mb-4">
                    <p
                      className="font-weight-bold d-inline"
                      style={{ display: "inline", fontWeight: "bold" }}
                    >
                      Note-
                    </p>
                    <ul
                      style={{
                        display: "inline",
                        listStyleType: "none",
                        paddingLeft: 0,
                        margin: 0,
                      }}
                    >
                      <li style={{ display: "inline" }}>
                        •{" "}
                        <span className="text-danger">
                          All * marked fields are mandatory.
                        </span>
                      </li>
                    </ul>
                    <ul
                      style={{
                        listStyleType: "none",
                        paddingLeft: "2.3rem",
                        margin: 0,
                      }}
                    >
                      <li className="me-1">
                        •{" "}
                        <span className="text-danger">
                          OPD claims should be submitted within 7 days of OPD
                          visit.
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </Col>
              <Col xs={24} sm={24} md={4} lg={4} className="text-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="my-4 px-3 w-100"
                  onClick={handleNext}
                  hidden={isClaimsDetails}
                >
                  Next
                </Button>
              </Col>
            </Row>

            {isClaimsDetails && (
              <>
                <h5 className="my-4 text-purple">Uploaded Documents</h5>
                <Row className="d-flex justify-content-end">
                  <Col span={24}>
                  <div className="table-container">
                    <table className="table table-responsive p-3 ">
                      <thead>
                        <tr>
                          <th className="custom-thead">Document Type</th>
                          <th className="custom-thead">Documents</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-purple">Doctor's Prescription</td>
                          <td>
                            {prescription?.map((url, index) => (
                              <span key={index}>
                                <a href={url} target="_blank">{`Prescription_${
                                  index + 1
                                },`}</a>
                                &nbsp;&nbsp;&nbsp;
                              </span>
                            ))}
                          </td>
                        </tr>
                        <tr>
                          <td>Doctor's Fee Bill</td>
                          <td>
                            {fee_receipt?.map((url, index) => (
                              <span key={index}>
                                <a href={url} target="_blank">{`Doctor_Fee_${
                                  index + 1
                                },`}</a>
                                &nbsp;&nbsp;&nbsp;
                              </span>
                            ))}
                          </td>
                        </tr>

                        <tr>
                          <td>Diagnostics Bills </td>
                          <td>
                            {test_receipt?.map((url, index) => (
                              <span key={index}>
                                <a
                                  href={url}
                                  target="_blank"
                                >{`Diagostics_Bill_${index + 1},`}</a>
                                &nbsp;&nbsp;&nbsp;
                              </span>
                            ))}
                          </td>
                        </tr>
                        <tr>
                          <td>Diagnostics Reports</td>
                          <td>
                            {test_reports?.map((url, index) => (
                              <span key={index}>
                                <a href={url} target="_blank">{`Report_${
                                  index + 1
                                },`}</a>
                                &nbsp;&nbsp;&nbsp;
                              </span>
                            ))}
                          </td>
                        </tr>
                        <tr>
                          <td>Pharmacy Bill</td>
                          <td>
                            {pharmacy_receipt?.map((url, index) => (
                              <span key={index}>
                                <a href={url} target="_blank">{`Pharmacy_Bill_${
                                  index + 1
                                },`}</a>
                                &nbsp;&nbsp;&nbsp;
                              </span>
                            ))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    </div>
                  </Col>
                </Row>
              </>
            )}

            {claimStatus !== null && (
              <>
                <h5 className="my-4 text-purple">Messages</h5>
                <Row className="d-flex justify-content-end">
                  <Col span={24}>
                  <div className="table-container">
                    <table className="table table-bordered my-4 table-hover">
                      <thead className="thead-dark">
                        <tr>
                          <th className="custom-thead form-label lightgreen fs-6 text-center table-heading-color col-1">
                            S.No.
                          </th>
                          <th className="custom-thead form-label lightgreen fs-6 text-center table-heading-color col-2">
                            Date Time
                          </th>
                          <th className="custom-thead form-label lightgreen fs-6 text-center table-heading-color col-2">
                            By
                          </th>
                          <th className="custom-thead form-label lightgreen fs-6 text-left table-heading-color">
                            Remarks
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages?.map((data, index) => (
                          <>
                            {data.message != null && (
                              <tr key={index}>
                                <td className="col-1">{index + 1}</td>
                                <td className="col-2">
                                  {data.createdAt
                                    ? dayjs(data.createdAt).format(
                                        "DD/MM/YYYY - hh:mm:ss A"
                                      )
                                    : "-"}
                                </td>
                                <td className="col-3">
                                  {data.approver_id === null ? (
                                    <p>Subsciber</p>
                                  ) : (
                                    <p>Support</p>
                                  )}
                                </td>
                                <td>{data.message}</td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </Col>
                </Row>
                <div className="text-end">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="my-4 px-3"
                    onClick={handleNext}
                    hidden={
                      (isClaimsDetails &&
                        claimStatus !==
                          CONSTANTS.CLAIM_STATUS.STATUS.CLARIFICATION) ||
                      userReaction
                    }
                  >
                    Re-upload Documents
                  </Button>
                </div>
              </>
            )}
          </Form>

          {action === CONSTANTS.CLAIM_STATUS.STATUS.DISPUTE && !dispute && (
            <div>
              <>
                {" "}
                <h5 className="my-4 text-purple">Dispute</h5>
                <Form
                  form={disputeForm}
                  layout="vertical"
                  onFinish={onFinishDispute}
                >
                  <Form.Item label="Date" name="dispute_date">
                    <DatePicker
                      showTime
                      format={"DD/MM/YYYY hh:mm:ss A"}
                      defaultValue={dayjs()}
                      disabled
                    />
                  </Form.Item>

                  <Row>
                    <Col span={6}>
                      <DocumentUploader
                        action={action}
                        onFilesChange={(files) => setDisputeFiles(files)}
                        imageprop={disputeimg}
                        alttext="icon"
                      />
                    </Col>
                  </Row>

                  <Form.Item
                    label="Raise Concern"
                    name="user_remark"
                    rules={[
                      {
                        required: true,
                        message: "Remark is required",
                      },
                    ]}
                  >
                    <TextArea
                      showCount
                      maxLength={1000}
                      autoSize={{
                        minRows: 4,
                        maxRows: 8,
                      }}
                    />
                  </Form.Item>

                  <Form.Item label=" ">
                    <Row justify={"end"}>
                      <Col>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className=""
                          hidden={
                            action !== CONSTANTS.CLAIM_STATUS.STATUS.DISPUTE
                          }
                          disabled={
                            !isClaimsDetails &&
                            (claimStatus !==
                              CONSTANTS.CLAIM_STATUS.STATUS.DISPUTE ||
                              dispute)
                          }
                        >
                          Raise Dispute
                        </Button>
                      </Col>
                    </Row>
                  </Form.Item>
                </Form>
              </>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserClaimsForm;
