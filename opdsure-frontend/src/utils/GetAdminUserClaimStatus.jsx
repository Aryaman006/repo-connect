import CONSTANTS from "../constant/Constants";
import { Tag } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

const GetAdminUserClaimStatus = (status, resubmissionStatus) => {
  switch (status) {
    case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.REJECTED:
      return (
        <Tag icon={<CloseCircleOutlined />} color="error">
          Rejected
        </Tag>
      );
    case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.INVALID:
      return (
        <Tag icon={<CloseCircleOutlined />} color="error">
          Invalid
        </Tag>
      );
    case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.CLARIFICATION:
      return (
        <Tag icon={<MinusCircleOutlined />} color="default">
          Clarification
        </Tag>
      );
      
     case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_APPROVER:
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Approved by Approver
      </Tag>
    );
    case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_VERIFIER:
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Approved by Verifier
      </Tag>
    );
    case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_FINANCER:
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
         Approved by Financer
      </Tag>
    );
    case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED_BY_MANAGER:
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
         Approved by Manager
      </Tag>
    );
    case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED:
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Approved
        </Tag>
      );
    case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.SETTLED:
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Settled
        </Tag>
      );
    case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.NO_ACTION:
      return resubmissionStatus ? (
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
          Re-Submitted
        </Tag>
      ) : (
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
          Pending
        </Tag>
      );
    default:
      return <Tag color="default">Unknown Status</Tag>;
  }
};

export default GetAdminUserClaimStatus;
