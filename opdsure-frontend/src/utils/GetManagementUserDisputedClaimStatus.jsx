import CONSTANTS from "../constant/Constants";
import { Tag } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

const GetManagmentUserDisputedClaimInternalStatus = (
  s, internalDesignation
) => {
  if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.REJECTED)
    return (
      <Tag icon={<CloseCircleOutlined />} color="error">
        Dispute Rejected
      </Tag>
    );
  
  if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED)
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Dispute Resolved
      </Tag>
    );
    
  if (internalDesignation === CONSTANTS.DESIGNATIONS[3].internal_id) {
    if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.NO_ACTION) {
      return <Tag icon={<ExclamationCircleOutlined />} color="warning">
          Dispute Raised
        </Tag>
    }else if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_VERIFIER) {
      return <Tag icon={<CheckCircleOutlined />} color="success">
          Dispute Forwared
        </Tag>
    }
    else if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_MANAGER) {
      return <Tag icon={<CheckCircleOutlined />} color="success">
          Approved by manager 
        </Tag>   
    }   
  }else if (internalDesignation === CONSTANTS.DESIGNATIONS[2].internal_id) {
    if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.NO_ACTION) {
      return <Tag icon={<ExclamationCircleOutlined />} color="warning">
          Dispute Raised
        </Tag>
    }else if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_VERIFIER) {
      return <Tag icon={<CheckCircleOutlined />} color="success">
          Dispute Forwared
        </Tag>
    }
  }else if (internalDesignation === CONSTANTS.DESIGNATIONS[1].internal_id) {
    if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_VERIFIER) {
      return <Tag icon={<ClockCircleOutlined />} color="warning">
          Dispute Raised
        </Tag>
    }else if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_MANAGER) {
      return <Tag icon={<CheckCircleOutlined />} color="success">
          Dispute Forwared
        </Tag>
    }
  }   
  else if (internalDesignation === CONSTANTS.DESIGNATIONS[4].internal_id) {
    if (s === CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_MANAGER) {
        return <Tag icon={<ExclamationCircleOutlined />} color="warning">
             Dispute Raised
            </Tag>
    }
  }
};

export default GetManagmentUserDisputedClaimInternalStatus;
