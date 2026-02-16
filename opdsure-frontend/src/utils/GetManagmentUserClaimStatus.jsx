import CONSTANTS from "../constant/Constants";
import { Tag } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

const GetManagmentUserClaimInternalStatus = (
  s,
  resubmissionStatus,
  internalDesignation
) => {
  if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.REJECTED)
    return (
      <Tag icon={<CloseCircleOutlined />} color="error">
        Rejected
      </Tag>
    );
  if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.INVALID)
    return(
      <Tag icon={<CloseCircleOutlined />} color="error">
      Invalid
    </Tag>
    )
  if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.CLARIFICATION)
    return (
      <Tag icon={<MinusCircleOutlined />} color="default">
        Clarification Required
      </Tag>
    );
  if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED)
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Approved
      </Tag>
    );
  if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.SETTLED)
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Settled
      </Tag>
    );
  if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_APPROVER)
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Approved by Approver
      </Tag>
    );
  if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_VERIFIER)
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Approved by Verifier
      </Tag>
    );
  if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_FINANCER)
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
         Approved by Financer
      </Tag>
    );
  if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_MANAGER)
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
         Approved by Manager
      </Tag>
    );

  if( s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.NO_ACTION ){
    return resubmissionStatus ? (
      <Tag icon={<ExclamationCircleOutlined />} color="warning">
      Re-Submitted
      </Tag>
    ):
    (
      <Tag icon={<ExclamationCircleOutlined />} color="warning">
      Pending
      </Tag>
    );
  }
    
  if (internalDesignation === CONSTANTS.DESIGNATIONS[3].internal_id) {
    console.log("for verifier and resubmission")
    if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.NO_ACTION) {
      return resubmissionStatus ? (
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
           Re-Submitted
        </Tag>
      ) : (
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
          Pendding
        </Tag>
      );
    }else if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_VERIFIER) {
      return resubmissionStatus ? (
        <Tag icon={<CheckCircleOutlined />} color="success">
           Re-Approved
        </Tag>
      ) : (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Approved
        </Tag>
      );
    }
    else if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_MANAGER) {
      return resubmissionStatus ? (
        <Tag icon={<CheckCircleOutlined />} color="success">
           Re-Approved by manager
        </Tag>
      ) : (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Approved by manager 
        </Tag>
      );   
    }
   
  } else if (internalDesignation === CONSTANTS.DESIGNATIONS[1].internal_id) {
    if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_VERIFIER) {
      return resubmissionStatus ? (
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
           Re-submitted
        </Tag>
      ) : (
        <Tag icon={<ClockCircleOutlined />} color="warning">
          Pending
        </Tag>
      );
    }else if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_MANAGER) {
      return resubmissionStatus ? (
        <Tag icon={<CheckCircleOutlined />} color="success">
           Re-Approved
        </Tag>
      ) : (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Approved
        </Tag>
      );   
    }
  } 
  
  
  else if (internalDesignation === CONSTANTS.DESIGNATIONS[4].internal_id) {
    if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_MANAGER) {
        return resubmissionStatus ? (
            <Tag icon={<ExclamationCircleOutlined />} color="warning">
              Re-submitted
            </Tag>
          ) : (
            <Tag icon={<ExclamationCircleOutlined />} color="warning">
              Pending
            </Tag>
          );
    } else if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED) {
        return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              {resubmissionStatus ? "Re-Approved" : "Approved"}
            </Tag>
          );
    }
  }
};

export default GetManagmentUserClaimInternalStatus;
