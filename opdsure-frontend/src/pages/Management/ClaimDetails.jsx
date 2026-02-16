import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  message,
  Modal,
  notification,
} from "antd";
import config, { CONFIG_OBJ } from "../../config/config";
import { Axios } from "../../axios/axiosFunctions";
import axios from "axios"
import { useNavigate, useParams, Link } from "react-router-dom";
import { LeftCircleOutlined } from "@ant-design/icons";
import CONSTANTS from "../../constant/Constants";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getKeyFromValue, Utils } from "../../utils";
const { TextArea } = Input;

const { confirm } = Modal;

const ClaimDetails = () => {
  const userType = Number(localStorage.getItem("user_type"));
  const internalDesignation = Number(localStorage.getItem("designation"));
  const [claimDetails, setClaimDetails] = useState([]);
  const [alldoc, setAlldoc] = useState([]);
  const [allDetails, setAllDetails] = useState();
  const [stateList, setStateList] = useState({});
  const [disableApproveButton, setdisableApproveButton] = useState(false);
  const [disableRejectButton, setdisableRejectButton] = useState(false);
  const [disableInvalidButton, setdisableInvalidButton] = useState(false);
  const [disableClarificationButton, setdisableClarificationButton] = useState(false);
  const [disableRemark, setdisableRemark] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(undefined);
  const [subscriberReaction, setSubscriberReaction] = useState(undefined);
  const [resubmission, setResubmission] = useState(false);
  const [invalidStatus, setInvalidStatus] = useState(false);
  const [internalStatus, setInternalStatus] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const [doctorFee, setDoctorFee] = useState(allDetails?.claimable_doctor_fee || 0);
  const [pharmacyFee, setPharmacyFee] = useState(allDetails?.claimable_pharmacy_fee || 0);
  const [labFee, setLabFee] = useState(allDetails?.claimable_lab_test_fee || 0);
  const [pharmacyTestFee, setPharmacyTestFee] = useState(allDetails?.claimable_combined_pharmacy_test_fees || 0);
  const [approvedDoctorFee, setApprovedDoctorFee] = useState(allDetails?.approved_claimable_doctor_fee || 0);
  const [approvedPharmacyFee, setApprovedPharmacyFee] = useState(allDetails?.approved_claimable_pharmacy_fee || 0);
  const [approvedLabFee, setApprovedLabFee] = useState(allDetails?.approved_claimable_lab_test_fee || 0);
  const [approvedPharmacyTestFee, setApprovedPharmacyTestFee] = useState(allDetails?.approved_claimable_combined_pharmacy_test_fees || 0);
  const { id } = useParams();
  const [remarksForm] = Form.useForm();
  const navigate = useNavigate();

  const claimableAmount = parseFloat(doctorFee || 0) + parseFloat(pharmacyFee || 0) + parseFloat(labFee || 0) + parseFloat(pharmacyTestFee || 0);

  const approvedClaimableAmount = parseFloat(approvedDoctorFee || 0) + parseFloat(approvedPharmacyFee || 0) + parseFloat(approvedLabFee || 0);

  const handleSave = async () => {
    try {
      const payload = {
        claimId: allDetails?._id,
        approved_claimable_doctor_fee: parseFloat(approvedDoctorFee),
        approved_claimable_pharmacy_fee: parseFloat(approvedPharmacyFee),
        approved_claimable_lab_test_fee: parseFloat(approvedLabFee),
        // approved_claimable_combined_pharmacy_test_fees : parseFloat(approvedPharmacyTestFee)
      };
  
      const response = await axios.patch("/api/v1/management/update-claimbills", payload);
  
      if (response?.status === 200 || response?.data?.success) {
        setShowModal(false);
        
        fetchData(); 
        
      }
    } catch (error) {
      notification.error("Error updating fees");
      console.error("Update error:", error);
    }
  };
  
  
  useEffect(() => {
    fetchData();
    fetchStateData();
  }, []);

  const fetchData = async () => {
    let url;
  
      url =config.GetClaimsDetailsManagement + id
 

    const result = await Axios.fetchAxiosData(
      url
    );

    setAlldoc(result.data);

    setAllDetails(result.data);
    setInternalStatus(result.data.internal_status);
    setSubscriberReaction(result.data.subscriber_reaction)
    setResubmission(result.data.resubmission)
    const keys = [
      "__v",
      "fee_receipt",
      "prescription",
      "pharmacy_receipt",
      "test_reports",
      "test_receipt",
      "createdAt",
      "updatedAt",
    ];
    const array = Object.entries(result.data)
      .filter(([label]) => !keys.includes(label))
      ?.map(([label, value]) => ({
        label,
        value: value?.toString(),
      }));
    setClaimDetails(array);
  };
  
  const { fee_receipt, prescription, pharmacy_receipt, test_receipt,test_reports } =
    alldoc || {};

  const formatFieldLabel = (label) => {
    return label
      .split("_")
      ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  useEffect(() => {
    const DisableButtons = () => {
     
      if (internalStatus === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.REJECTED ||
        internalStatus === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.INVALID ||
        internalStatus === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED
       ) {
        setdisableRejectButton(true);
        setdisableApproveButton(true);
        setdisableClarificationButton(true);
        setdisableInvalidButton(true);
        return;
      }
      if( internalStatus === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.CLARIFICATION && !subscriberReaction ){
        setdisableRejectButton(true);
        setdisableApproveButton(true);
        setdisableClarificationButton(true);
        setdisableInvalidButton(false);
      }
      if( internalStatus === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.CLARIFICATION && subscriberReaction ){
        setdisableRejectButton(false);
        setdisableApproveButton(false);
        setdisableClarificationButton(false);
        setdisableInvalidButton(false);
        return;
      }

      if (internalDesignation === CONSTANTS.DESIGNATIONS[3].internal_id) {
        if (
          internalStatus &&
          internalStatus !== CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.NO_ACTION
        ) {
          setdisableRejectButton(false);
          setdisableApproveButton(false);
          setdisableClarificationButton(false);
          setdisableInvalidButton(false);
        }
      } else if (
        internalDesignation === CONSTANTS.DESIGNATIONS[1].internal_id
      ) {
        if (
          internalStatus &&
          internalStatus ===
            CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_VERIFIER
        ) {
          setdisableRejectButton(false);
          setdisableApproveButton(false);
          setdisableClarificationButton(false);
          setdisableInvalidButton(false);
        } else {
          setdisableRejectButton(true);
          setdisableApproveButton(true);
          setdisableClarificationButton(true);
          setdisableInvalidButton(true);
        }
      } else if (
        internalDesignation === CONSTANTS.DESIGNATIONS[4].internal_id
      ) {
        if (
          internalStatus &&
          internalStatus ===
            CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_MANAGER
        ) {
          setdisableRejectButton(false);
          setdisableApproveButton(false);
        } else {
          setdisableRejectButton(true);
          setdisableApproveButton(true);
        }
      }
    };
    DisableButtons();
  }, [internalStatus]);

  const fetchStateData = async () => {
    const stateListData = await Axios.fetchAxiosData(config.GetStateList);
    const stateObject = {};
    stateListData.data?.forEach((state) => {
      stateObject[state.id] = state.name;
    });
    setStateList(stateObject);
  };

  
  const getClaimInternalStatusForMessage = (s) => {
    if(s===null) return "Subscriber"
    switch (s){
       case 2 : return "Approved";
       case 3 : return "Manager";
       case 4 : return "Approved";
       case 5 : return "Rejected";
       case 6 : return "Clarification Required ";
       case 7 : return "Invalid";
       case 8 : return "Approved";
       default : return null;
    }
  };
  const getClaimNotificationMessage = (s) => {
   
    switch (s){
       case 2 : return "Claim Approved Successfully";
       case 3 : return "Claim Approved Successfully";
       case 4 : return "Claim Approved Successfully";
       case 5 : return "Claim Rejected Successfully";
       case 6 : return "Clarification Submitted Successfully";
       case 7 : return "Claim Declared Invalid";
       case 8 : return "Claim Approved Successfully";
       default : return null;
    }
  };

  const handleSaveRemarks = async (approvalStatus) => {
    await remarksForm.validateFields(['remark']); 
    confirm({
      title: <h4 className="textblue">Confirmation !</h4>,
      content: <div>
        <p>Are you sure you want to proceed further with <span className="fw-bold">{getTitle(approvalStatus)}</span> ?</p>
        </div>,
      icon: <ExclamationCircleFilled />,
      centered: true,
      async onOk() {
    try {
      
      const values = await remarksForm.validateFields();
      const result = await Axios.postAxiosData(
        config.UpdateClaimManagement + id,
        { approval_status: approvalStatus, remark: values.remark }
      );
      if (result.success === true) {
        remarksForm.resetFields();
       
          notification.success({
            message: getClaimNotificationMessage(approvalStatus),
          });
        
        navigate("/management/claims");
      } else {
        notification.error({
          message: result.message,
        });
      }
    } catch (error) {
      notification.error({
        message: error.response.data.message,
      });
    }
  },
  onCancel() {},
    });
  };
  const getTitle = (approvalStatus) => {
    switch (approvalStatus){
      case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED : return  "Approve";
      case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.REJECTED : return "Reject";
      case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.INVALID : return "Invalidate";
      case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.CLARIFICATION : return  "Clarification Required";
      default : return "";
    }
  }

  const handlePayClaim = async (id) => {
    confirm({
      title: <h4 className="textblue">Confirmation !</h4>,
      content: <div>
        <p>Are you sure you want to Pay <span className="fw-bold textblue">₹&nbsp;{allDetails?.approved_claimable_amount? allDetails?.approved_claimable_amount : allDetails?.claimable_amount}</span>&nbsp; amount?</p>
        </div>,
      icon: <ExclamationCircleFilled />,
      centered: true,
      async onOk() {
      
      const result = await Axios.postAxiosData(config.PayClaimAmount, {id : id});
      if(result.success===true){
        notification.success({
          message: "Payment released successfully"
        })
        navigate("/management/claims");
      }
      else{
        notification.error({
          message: "Failed to release payment"
        })
      }
    },
    onCancel() {},
  });
  }


  return (
    <div className="container">
         <div className="d-flex align-items-center gap-3 mb-3">
            <Link to={"/management/claims"}>
              <LeftCircleOutlined className="text-primary fs-3" />
            </Link>           
          </div>
          
      <div className="row">
        <h5 className="text-dark fw-bold my-2">Claim Details</h5>
      </div>
      
      <div className="container border rounded-2 border-1">
      <div className="row rounded-2 p-2">
          <div className="col-6  my-auto fw-bold">
            <p className="my-auto text-decoration-underline">Applicant Details</p>
          </div>
         
          <div className="col-6 fw-bold ">
            <p className="my-auto text-decoration-underline">Doctor Details</p>
          </div>
         
         
        </div>
        {/* 1st row */}
        <div className="row rounded-2 p-2">
          <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Id:</p>
          </div>
          <div className="col-4">
            <p className="my-auto">{allDetails?.claim_id}</p>
          </div>
          <div className="col-2 fw-bold">
            <p className="my-auto">Doctor Name:</p>
          </div>
          <div className="col-4">
            <p className="my-auto">{allDetails?.doc_name}</p>
          </div>
         
        </div>
        {/* 2nd row */}
        <div className="row rounded-2 p-2">
          <div className="col-2 fw-bold">
            <p className="my-auto">Email:</p>
          </div>
          <div className="col-4">
            <p className="my-auto">{allDetails?.user_id?.email}</p>
          </div>
          <div className="col-2 fw-bold">
            <p className="my-auto">Doc Regn. No:</p>
          </div>
          <div className="col-4">
            <p className="my-auto">{allDetails?.doc_registration}</p>
          </div>
        
        </div>
        {/* 3rd row */}
        <div className="row rounded-2 p-2">
          <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Claim Date:</p>
          </div>
          <div className="col-4">
           
            <p className="my-auto">{Utils.DateFormat(allDetails?.createdAt)}</p>
          </div>
          <div className="col-2 fw-bold">
            <p className="my-auto">Specialization:</p>
          </div>
          <div className="col-4">
            <p className="my-auto">{allDetails?.specialization}</p>
          </div>
         
        </div>
        {/* 4th row */}
        <div className="row rounded-2 p-2">
          <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Claim Type:</p>
          </div>
          <div className="col-4">
            <p className="my-auto">
              {allDetails?.claim_type === 0
                ? "OPD"
                : allDetails?.claim_type === 1
                ? "Pharmacy"
                : allDetails?.claim_type === 2
                ? "Lab-Test"
                : ""}
            </p>
          </div>
          <div className="col-2 fw-bold">
            <p className="my-auto">Hospital Name:</p>
          </div>
          <div className="col-4">
            <p className="my-auto">{allDetails?.hospital}</p>
          </div>
         
        </div>
        {/* 5th row */}
        <div className="row rounded-2 p-2">
          <div className="col-2  my-auto fw-bold">
            <p className="my-auto">OPD Date:</p>
          </div>
          <div className="col-4">
           
            <p className="my-auto">{Utils.DateFormat(allDetails?.opd_date)}</p>
          </div>
          <div className="col-2 fw-bold">
            <p className="my-auto">Address:</p>
          </div>
          <div className="col-4">
            <p className="my-auto">{allDetails?.doc_address}</p>
          </div>
        
        </div>
        {/* 6th row */}
        <div className="row rounded-2 p-2">
          <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Patient Name:</p>
          </div>
          <div className="col-4">
            <p className="my-auto">{allDetails?.member_details.name}</p>
          </div>
          <div className="col-2 fw-bold">
            <p className="my-auto">City:</p>
          </div>
          <div className="col-4">
            <p className="my-auto">{allDetails?.city}</p>
          </div> 
         
        </div>
        {/* 7th row */}
        <div className="row rounded-2 p-2">
          <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Bill Amount:</p>
          </div>
          <div className="col-4">
          <p className="my-auto">{allDetails?.bill_amount.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="col-2 fw-bold">
            <p className="my-auto">Pincode:</p>
          </div>
          <div className="col-4">
            <p className="my-auto">{allDetails?.pincode}</p>
          </div> 
         
        </div>
        {/* 8th row */}
        <div className="row rounded-2 p-2">
          <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Doctor fee:</p>
          </div>
          <div className="col-4">
          <p className="my-auto">{allDetails?.claimable_doctor_fee?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="col-2 fw-bold">
            <p className="my-auto">Contact Number:</p>
          </div>
          <div className="col-4">
          <p className="my-auto">
              {allDetails?.member_details.country_code}-
              {allDetails?.member_details.phone}
            </p>
          </div> 
        </div>
        
        <div className="row rounded-2 p-2">
        <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Lab fee:</p>
          </div>
          <div className="col-4">
          <p className="my-auto">{allDetails?.claimable_lab_test_fee?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="row rounded-2 p-2">
        <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Diagnostics Bills:</p>
          </div>
          <div className="col-4">
          <p className="my-auto">{allDetails?.claimable_pharmacy_fee?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
        {/* <div className="row rounded-2 p-2">
        <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Claimable Pharmacy Test fee:</p>
          </div>
          <div className="col-4">
          <p className="my-auto">{allDetails?.claimable_combined_pharmacy_test_fees?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div> */}
        {/* 9th row */}
        <div className="row rounded-2 p-2">
          <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Total Claimable Amount:</p>
          </div>
          <div className="col-4">
          <p className="my-auto">{allDetails?.claimable_amount?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
         
        </div>

        <div className="row rounded-2 p-2">
        <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Approved Doctor fee:</p>
          </div>
          <div className="col-4">
          <p className="my-auto">{allDetails?.approved_claimable_doctor_fee?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="row rounded-2 p-2">
        <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Approved Pharmacy Bills:</p>
          </div>
          <div className="col-4">
          <p className="my-auto">{allDetails?.approved_claimable_lab_test_fee?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="row rounded-2 p-2">
        <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Approved Diagnostics Bills:</p>
          </div>
          <div className="col-4">
          <p className="my-auto">{allDetails?.approved_claimable_pharmacy_fee?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
        {/* <div className="row rounded-2 p-2">
        <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Approved Pharmacy Test fee:</p>
          </div>
          <div className="col-4">
          <p className="my-auto">{allDetails?.approved_claimable_combined_pharmacy_test_fees?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div> */}
        {/* 9th row */}
        <div className="row rounded-2 p-2">
          <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Approved Amount:</p>
          </div>
          <div className="col-4">
          <p className="my-auto">{allDetails?.approved_claimable_amount?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
         
        </div>
        {/* 10th row */}
        <div className="row rounded-2 p-2">
          <div className="col-2 fw-bold">
            <p className="my-auto">Reason For Dr. Consult.:</p>
          </div>
          <div className="col-10">
            <p className="my-auto">{allDetails?.diagonosis_detail}</p>
          </div>
        </div>
        {/* 10th row */}
        <div className="row rounded-2 p-2">
          <div className="col-2 fw-bold">
            <p className="my-auto">Additional Information:</p>
          </div>
          <div className="col-10">
            <p className="my-auto">{allDetails?.user_remark}</p>
          </div>
        </div>
      {( allDetails?.status !== 12)? (
        <div className="d-flex justify-content-end m-2">
          <button className="btn btn-outline-primary" onClick={() => {
              setApprovedDoctorFee(allDetails?.approved_claimable_doctor_fee || 0);
              setApprovedPharmacyFee(allDetails?.approved_claimable_pharmacy_fee || 0);
              setApprovedLabFee(allDetails?.approved_claimable_lab_test_fee || 0);
              setShowModal(true);
            }}>
            Edit Claim Bill
          </button>
        </div>
      ): ""}
{showModal && (
  <div className="modal show d-block" tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Edit Claim Fees</h5>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">Doctor Fee</label>
            <input type="string" className="form-control" value={approvedDoctorFee} onChange={(e) => setApprovedDoctorFee(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Diagnostics Bills</label>
            <input type="string" className="form-control" value={approvedPharmacyFee} onChange={(e) => setApprovedPharmacyFee(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Pharmacy Bills</label>
            <input type="string" className="form-control" value={approvedLabFee} onChange={(e) => setApprovedLabFee(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Total Claimable Amount</label>
            <input type="string" className="form-control" value={approvedClaimableAmount} disabled />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  </div>
)}

      </div>

      {/* display uploaded documents */}
      {/* <h6 className="my-4">Uploaded Documents</h6> */}
      <Row className="d-flex justify-content-end mt-2">
        <Col span={24}>
          <table className="table table-responsive ">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Document Type</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
            <tr>
                <td>Doctor's Prescription</td>
                <td>
                  {prescription?.map((url, index) => (
                    <span key={index}>
                      <a href={url} target="_blank">{`Prescription_${index + 1},`}</a>
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
                      <a href={url} target="_blank">{`Doctor_Fee_${index + 1},`}</a>
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
                      <a href={url} target="_blank">{`Reports_${index + 1},`}</a>
                      &nbsp;&nbsp;&nbsp;
                    </span>
                  ))}
                </td>
              </tr>
              <tr>
                <td>Diagnostics Bills</td>
                <td>
                  {test_receipt?.map((url, index) => (
                    <span key={index}>
                      <a href={url} target="_blank">{`Diagnostics_Bill_${index + 1},`}</a>
                      &nbsp;&nbsp;&nbsp;
                    </span>
                  ))}
                </td>
              </tr>
              <tr>
                <td>Pharmacy Receipt</td>
                <td>
                  {pharmacy_receipt?.map((url, index) => (
                    <span key={index}>
                      <a href={url} target="_blank">{`Pharmacy_Bills_${index + 1},`}</a>
                      &nbsp;&nbsp;&nbsp;
                    </span>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>

      {/* row for remarks addition */}
      <div className="row mt-2">
        <h6 className="text-dark fw-bold my-2">Action Details</h6>
      </div>

      <table className="table table-bordered my-4 table-hover">
        <thead className="thead-dark">
          <tr >
            <th className="form-label lightgreen fs-6 text-center table-heading-color col-1">
              S.No.
            </th>
            <th className="form-label lightgreen fs-6 text-center table-heading-color col-2">
              Date Time
            </th>
            <th className="form-label lightgreen fs-6 text-center table-heading-color col-3">
              Action/Taken By
            </th>
            <th className="form-label lightgreen fs-6 text-left table-heading-color">
              Remarks
            </th>
          </tr>
        </thead>
        <tbody>
          {allDetails?.remark?.map((data, index) => (
            <tr key={index}>
              <td className="col-1">{index + 1}</td>
              <td className="col-2">
                {data.createdAt
                  ? dayjs(data.createdAt).format("DD/MM/YYYY - hh:mm A")
                  : "-"}
              </td>
              {/* <td>{getKeyFromValue(data.message_claim_internal_status, CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS)}</td> */}
              <td className="col-3">
                {/* {data.message_claim_internal_status === null ? (index===0 ? <p>Submitted by subscriber</p> : <p>Resubmitted by subscriber</p>) : <p>
                  {getClaimInternalStatusForMessage(data.message_claim_internal_status)} by {" "}
                  {CONSTANTS.DESIGNATIONS[data.designation].value}
                  </p>} */}
                <p>
                  {data.message_claim_internal_status === null ? "Subscriber" : getClaimInternalStatusForMessage(data.message_claim_internal_status)} by {" "}
                  {data.designation === null ? "Subscriber" : CONSTANTS.DESIGNATIONS[data.designation]?.value}
                </p>
              </td>
              <td>{data.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="row">
        <ul>
          {allDetails?.rejection_remark?.map((r, index) => (
            <li key={index}>{r.message}</li>
          ))}
        </ul>
      </div>
      {
       
        (internalStatus===CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED) ?
        <>
         <Row justify="end">
           <Button
           type="primary"
           onClick={() => handlePayClaim(id)}
           style={{ marginRight: "1rem" }}
           >
           Pay
           </Button>
         </Row> 
        </>:""
      }
     
      <Row justify="end" 
        hidden = {
          (internalStatus===CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.SETTLED) || (internalStatus===CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED)
        }
      >
        <Button
          type="primary"
          onClick={() => {
            setModalVisible(true), setApprovalStatus(CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED);
          }}
          disabled={disableApproveButton}
          style={{ marginRight: "1rem" }}
        >
          Approve
        </Button>
        <Button
          onClick={() => {
            setModalVisible(true); setApprovalStatus(CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.CLARIFICATION)
          }}
          disabled={disableClarificationButton}
          style={{ marginRight: "1rem" }}
        >
          Clarification
        </Button>
        <Button
          danger
          onClick={() => {
            setModalVisible(true); setApprovalStatus(CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.INVALID)
          }}
          disabled={disableInvalidButton}
          style={{ marginRight: "1rem" }}
        >
          Invalid
        </Button>
        <Button
        type="primary"
          danger
          onClick={() => {
            setModalVisible(true), setApprovalStatus(CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.REJECTED);
          }}
          disabled={disableRejectButton}
        >
          Reject
        </Button>
      </Row>
      <Modal
        title={
          getTitle(approvalStatus) + 
          (approvalStatus === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.CLARIFICATION ? "" : " Claim")
        }
        open={modalVisible}
        onOk={() => {
          handleSaveRemarks(approvalStatus);
        }}
        onCancel={() => {
          setModalVisible(false);
          setInvalidStatus(false);
          setApprovalStatus(false);
        }}
        okText={"Submit"}
        width={550}
        centered
      >
        <div className="row">
          <Form
            className="mt-2"
            layout="vertical"
            form={remarksForm}
          >
            <Form.Item
              name="remark"
              label="Remarks"
              rules={[
                {
                  required: (approvalStatus!==CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED),
                  message: "Please fill remark",
                },
              ]}
            >
              <TextArea
                autoSize={{ minRows: 2, maxRows: 4 }}
                placeholder="Add Remarks here ..."
                disabled={disableRemark}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default ClaimDetails;
