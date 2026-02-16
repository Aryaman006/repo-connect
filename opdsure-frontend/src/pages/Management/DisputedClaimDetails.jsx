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

const DisputedClaimDetails = () => {
  const internalDesignation = Number(localStorage.getItem("designation"));
//   const [claimDetails, setClaimDetails] = useState([]);
//   const [alldoc, setAlldoc] = useState([]);
  const [allDetails, setAllDetails] = useState();
  const [allDisputeDetails, setAllDisputeDetails] = useState();
  const [stateList, setStateList] = useState({});
  const [disableApproveButton, setdisableApproveButton] = useState(false);
  const [disableRejectButton, setdisableRejectButton] = useState(false);
  const [disableRemark, setdisableRemark] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(undefined);
  const [subscriberReaction, setSubscriberReaction] = useState(undefined);
  const [disputeRemarks, setDisputeRemarks] = useState([]);
  const [invalidStatus, setInvalidStatus] = useState(false);
  const [internalStatus, setInternalStatus] = useState(undefined);
  const [disputeDocs, setDisputeDocs] = useState([]);
  const { id } = useParams();
  const [remarksForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchStateData();
  }, []);

  const fetchData = async () => {
    const result = await Axios.fetchAxiosData(
      config.GetDisputedClaimManagement + id
    );
    setAllDetails(result.data.original_claim_id);
    setAllDisputeDetails(result.data);
    setInternalStatus(result.data?.internal_status);
    setDisputeRemarks(result?.data?.remark);
    setDisputeDocs(result.data?.files);
    setSubscriberReaction(result?.data?.subscriber_remark[0].message)
   
  };
  useEffect(() => {
    const DisableButtons = () => {     
      if (internalStatus === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.REJECTED ||
        internalStatus === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED
       ) {
        setdisableRejectButton(true);
        setdisableApproveButton(true);       
        return;
      }
      if (internalDesignation === CONSTANTS.DESIGNATIONS[3].internal_id) {
        if (
          internalStatus &&
          internalStatus !== CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.NO_ACTION
        ) {
          setdisableRejectButton(true);
          setdisableApproveButton(true);
         
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
         
        } else {
          setdisableRejectButton(true);
          setdisableApproveButton(true);
        
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
    console.log("stateObject",stateObject)
  };  
  const getClaimInternalStatusForMessage = (s) => {
    if(s===null) return "Subscriber"
    switch (s){
       case 2 : return "Approved";
       case 3 : return "Manager";
       case 4 : return "Approved";
       case 5 : return "Rejected";
       case 8 : return "Approved";
       default : return null;
    }
  };
  const getClaimNotificationMessage = (s) => {
   
    switch (s){
       case 2 : return "Claim Approval Successfull";
       case 3 : return "Claim Approval Successfull";
       case 4 : return "Claim Approval Successfull";
       case 5 : return "Claim Rejected Successfully";      
       case 8 : return "Claim Approval Successfull";
       default : return null;
    }
  };

  const handleSaveRemarks = async (approvalStatus) => {
    confirm({
      title: <h4 className="textblue">Confirmation !</h4>,
      content: <div>
        <p>Are you sure you want to proceed further ?</p>
        </div>,
      icon: <ExclamationCircleFilled />,
      centered: true,
      async onOk() {
        try {
          const values = await remarksForm.validateFields();
          const result = await Axios.patchAxiosData(
            config.UpdateDisputeClaimManagement + id,
            { approval_status: approvalStatus, remark: values.remark }
          );
          if (result.success === true) {
            remarksForm.resetFields();       
              notification.success({
                message: getClaimNotificationMessage(approvalStatus),
              });
            
            navigate("/management/claims/disputed");
          } else {
            notification.error({
              message: result.message,
            });
          }
        }
        catch (error) {
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
      default : return "";
    }
  }
  return (
    <div className="container">
         <div className="d-flex align-items-center gap-3 mb-3">
            <Link to="/management/claims/disputed">
              <LeftCircleOutlined className="text-primary fs-3" />
            </Link>           
          </div>
      <div className="row">
        <h5 className="text-dark fw-bold my-2">Disputed Claim Details</h5>
      </div>
      <div className="container border rounded-2 border-1">
        {/* 1st row */}
        <div className="row rounded-2 p-2">
          <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Id:</p>
          </div>
          <div className="col-2">
            <p className="my-auto">{allDetails?.claim_id}</p>
          </div>
          <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Name:</p>
          </div>
          <div className="col-2">
            <p className="my-auto">{allDetails?.member_id.name}</p>
          </div>
          <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Contact No:</p>
          </div>
          <div className="col-2">
            <p className="my-auto">
              {allDetails?.member_id?.country_code}-
              {allDetails?.member_id?.phone}
            </p>
          </div>
        </div>
        <div className="row rounded-2 p-2">
          <div className="col-2 fw-bold">
            <p className="my-auto">Email:</p>
          </div>
          <div className="col-2">
            <p className="my-auto">{allDetails?.user_id?.email}</p>
          </div>

          <div className="col-2 fw-bold">
            <p className="my-auto">Doctor Name:</p>
          </div>
          <div className="col-2">
            <p className="my-auto">{allDetails?.doc_name}</p>
          </div>
          <div className="col-2 fw-bold">
            <p className="my-auto">City:</p>
          </div>
          <div className="col-2">
            <p className="my-auto">{allDetails?.city}</p>
          </div>
        </div>
        {/* 2nd row */}
        <div className="row rounded-2 p-2">
          <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Claim Date:</p>
          </div>
          <div className="col-2">
           
            <p className="my-auto">{Utils.DateFormat(allDetails?.createdAt)}</p>
          </div>
          <div className="col-2 fw-bold">
            <p className="my-auto">Doc Regn. No:</p>
          </div>
          <div className="col-2">
            <p className="my-auto">{allDetails?.doc_registration}</p>
          </div>
          {/* <div className="col-2 fw-bold">
            <p className="my-auto">State:</p>
          </div>
          <div className="col-2">
            <p className="my-auto">
              {stateList[allDetails?.state] || "Unknown"}
              {allDetails?.state}
            </p>
          </div> */}
          {/* <div className="col-2">
          <p className="my-auto">{allDetails?.state}</p>
        </div> */}
        </div>
        {/* 3rd row */}
        <div className="row rounded-2 p-2">
          <div className="col-2  my-auto fw-bold">
            <p className="my-auto">Claim Type:</p>
          </div>
          <div className="col-2">
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
            <p className="my-auto">Specialization:</p>
          </div>
          <div className="col-2">
            <p className="my-auto">{allDetails?.specialization}</p>
          </div>
          <div className="col-2 fw-bold">
            <p className="my-auto">Bill Amount:</p>
          </div>
          <div className="col-2">
            <p className="my-auto">{allDetails?.bill_amount.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
        {/* 4th row */}
        <div className="row rounded-2 p-2">
          <div className="col-2  my-auto fw-bold">
            <p className="my-auto">OPD Date:</p>
          </div>
          <div className="col-2">
           
            <p className="my-auto">{Utils.DateFormat(allDetails?.opd_date)}</p>
          </div>
          <div className="col-2 fw-bold">
            <p className="my-auto">Hospital Name:</p>
          </div>
          <div className="col-2">
            <p className="my-auto">{allDetails?.hospital}</p>
          </div>
          <div className="col-2 fw-bold">
            <p className="my-auto">Claimable Amount:</p>
          </div>
          <div className="col-2">
            <p className="my-auto">{allDetails?.claimable_amount.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="row rounded-2 p-2">
          <div className="col-2 fw-bold">
            <p className="my-auto">Diagonosis Details:</p>
          </div>
          <div className="col-10">
            <p className="my-auto">{allDetails?.diagonosis_detail}</p>
          </div>
        </div>
      </div>

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
                  {allDisputeDetails?.prescription?.map((url, index) => (
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
                  {allDisputeDetails?.fee_receipt?.map((url, index) => (
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
                  {allDisputeDetails?.test_reports?.map((url, index) => (
                    <span key={index}>
                      <a href={url} target="_blank">{`Report_${index + 1},`}</a>
                      &nbsp;&nbsp;&nbsp;
                    </span>
                  ))}
                </td>
              </tr>
              <tr>
                <td>Diagnostics Bills</td>
                <td>
                  {allDisputeDetails?.test_receipt?.map((url, index) => (
                    <span key={index}>
                      <a href={url} target="_blank">{`Diagnostics_Bill_${index + 1},`}</a>
                      &nbsp;&nbsp;&nbsp;
                    </span>
                  ))}
                </td>
              </tr>
              <tr>
                <td>Pharmacy Bills</td>
                <td>
                  {allDisputeDetails?.pharmacy_receipt?.map((url, index) => (
                    <span key={index}>
                      <a href={url} target="_blank">{`Pharmacy_Bill_${index + 1},`}</a>
                      &nbsp;&nbsp;&nbsp;
                    </span>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>   

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
              <td className="col-3">
                {data.message_claim_internal_status === null ? (index===0 ? <p>Submitted by subscriber</p> : <p>Resubmitted by subscriber</p>) : <p>
                  {getClaimInternalStatusForMessage(data.message_claim_internal_status)} by {" "}
                  {CONSTANTS.DESIGNATIONS[data.designation].value}
                  </p>}
              </td>
              <td>{data.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
      <div className="row mt-2">
        <h6 className="text-purple fw-bold my-2">Dispute Details</h6>
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
            <th className="form-label lightgreen fs-6 text-left table-heading-color">
              Documents
            </th>
          </tr>
        </thead>
        <tbody>
          {disputeRemarks?.map((data, index) => (
            <tr key={index}>
              <td className="col-1">{index + 1}</td>
              <td className="col-2">
                {data.createdAt
                  ? dayjs(data.createdAt).format("DD/MM/YYYY - hh:mm A")
                  : "-"}
              </td>
              {/* <td>{getKeyFromValue(data.message_claim_internal_status, CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS)}</td> */}
              <td className="col-3">
                {data.message_claim_internal_status === null ? <p>Dispute Raise by subsciber</p> : <p>
                  {getClaimInternalStatusForMessage(data.message_claim_internal_status)} by {" "}
                  {CONSTANTS.DESIGNATIONS[data.designation].value}
                  </p>}
              </td>
              <td>{data.message}</td>
              <td>
                  {index===0 && disputeDocs?.map((url, index) => (
                    <span key={index}>
                      <a href={url} target="_blank">{`document-${index + 1},`}</a>
                      &nbsp;&nbsp;&nbsp;
                    </span>
                  ))}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="row">
        <ul>
          {allDetails?.rejection_remark?.map((r, index) => (
            <li key={index}>{r.message}</li>
          ))}
        </ul>
      </div>
      <Row justify="end" 
        hidden = {(internalStatus===CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED)||
          (internalStatus===CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.REJECTED) ||
          (internalStatus===CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.INVALID) 
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
          (approvalStatus === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.CLARIFICATION ? "" : " Disputed Claim")
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
                  required: true,
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

export default DisputedClaimDetails;
