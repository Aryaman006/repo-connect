import CONSTANTS from "../constant/Constants";
import { Tag } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';

const GetSubscriberDisputeClaimStatus = (s) =>{
    switch (s) {
      case CONSTANTS.CLAIM_STATUS.DISPUTE_STATUS.APPROVED :  return <Tag icon={<CheckCircleOutlined />} color="success">Approved</Tag>;
      case CONSTANTS.CLAIM_STATUS.DISPUTE_STATUS.REJECTED : return <Tag icon={<CloseCircleOutlined />} color="error">Rejected</Tag>;
      default : return <Tag icon={<SyncOutlined  />} color="error">Dispute Raised</Tag>;
    }
  }

  export default GetSubscriberDisputeClaimStatus;