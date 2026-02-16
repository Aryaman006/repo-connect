import CONSTANTS from "../constant/Constants";
import { Tag } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';

const GetSubscriberClaimStatus = (s,subscriberReaction) =>{
    switch (s) {
      case CONSTANTS.CLAIM_STATUS.STATUS.PENDING : return <Tag icon={<ClockCircleOutlined />} >Submitted</Tag>;
      case CONSTANTS.CLAIM_STATUS.STATUS.APPROVED : return <Tag icon={<CheckCircleOutlined />} color="success">Approved</Tag>;
      case CONSTANTS.CLAIM_STATUS.STATUS.SETTLED : return <Tag icon={<CheckCircleOutlined />} color="success">Settled</Tag>;
      case CONSTANTS.CLAIM_STATUS.STATUS.REJECTED : return <Tag icon={<CloseCircleOutlined />} color="error">Rejected</Tag>;
      case CONSTANTS.CLAIM_STATUS.STATUS.DUPLICATE : return <Tag icon={<CloseCircleOutlined />} color="error">Duplicate</Tag>;
      case CONSTANTS.CLAIM_STATUS.STATUS.IN_PROCESS : return <Tag icon={<SyncOutlined  />} color="processing">In Process</Tag>;
      case CONSTANTS.CLAIM_STATUS.STATUS.INVALID : return <Tag icon={<CloseCircleOutlined />} color="error">Invalid</Tag>;
      case CONSTANTS.CLAIM_STATUS.STATUS.CLARIFICATION :return (subscriberReaction===false ?  <Tag icon={<ExclamationCircleOutlined />} color="warning">Clarification Required</Tag> : <Tag icon={<CheckCircleOutlined />} color="success">Re Submitted</Tag>);
      default : return null;
    }
  }

  export default GetSubscriberClaimStatus;