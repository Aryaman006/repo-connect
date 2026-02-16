import React, { useEffect, useState } from "react";
import {
  Input,
  Tabs,
  Select
} from "antd";
import PurchasedPlanDetails from "./PurchasedPlanDetails";
import PurchasedHealthPlanDetails from "./PurchasedHealthPlanDetails";
import QueuedPlanDetails from "./QueuedPlanDetails";
import { useAuth } from "../../context/authProvider";
import { Axios } from "../../axios/axiosFunctions";
import config from "../../config/config";
import { useNavigate } from "react-router-dom";
import CONSTANTS from "../../constant/Constants";
const { Option } = Select;
const UserDashboard = () => {
  const navigate = useNavigate();
  const handleTabChange = (key) => {
    setActiveKey(key);
  };
  const [activeKey, setActiveKey] = useState("1");
  const { setSubscriberType, setCorporate, subscriberType } = useAuth();

  const fetchProfileData = async () => {  
    try {
     
      const response = await Axios.fetchAxiosData(config.GetProfile);          
      setCorporate(response.data.corporate);
      setSubscriberType(response.data.subscriber_type);    
    
    } catch (error) {
      navigate("/user/dashboard",{replace:true});
    }   
};
useEffect(()=>{
  fetchProfileData();
},[])

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {/* tabs */}
          <Tabs
            defaultActiveKey="1"
            activeKey={activeKey}
            onChange={handleTabChange}
          >
            <Tabs.TabPane
              tab={<h5 className="text-purple">Subscription Plan</h5>}
              key="1"
            >
              <PurchasedPlanDetails />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={<h5 className="text-purple">Health Checkup Plan</h5>}
              key="2"
            >
              <PurchasedHealthPlanDetails />
            </Tabs.TabPane>
            {
              subscriberType === CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL &&
              <Tabs.TabPane
              tab={<h5 className="text-purple">Queued Plans</h5>}
              key="3"
            >
              <QueuedPlanDetails />
            </Tabs.TabPane>
   
            }
                  </Tabs>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
