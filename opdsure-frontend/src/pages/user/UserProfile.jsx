import React, { useState } from "react";
import {
  Input,
  Tabs,
  Select
} from "antd";
const { TextArea } = Input;
import UserPersonalDetailsForm from "./UserPersonalDetailsForm";
import UserFamilyDetailsForm from "./UserFamilyDetailsForm";
import PurchasedPlanDetails from "./PurchasedPlanDetails";

const { Option } = Select;
const UserDashboard = () => {
  const handleTabChange = (key) => {
    setActiveKey(key);
    console.log(key);
  };
  const [activeKey, setActiveKey] = useState("1");

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
              tab={<h5 className="text-purple">Personal Details</h5>}
              key="1"
            >
              <UserPersonalDetailsForm />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={<h5 className="text-purple">Family Details</h5>}
              key="2"
            >
              <UserFamilyDetailsForm />
            </Tabs.TabPane>
            {/* <Tabs.TabPane
              tab={<h5 className="text-purple">Purchased Plan</h5>}
              key="3"
            >
              <PurchasedPlanDetails />
            </Tabs.TabPane> */}
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
