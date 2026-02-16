import React, { useState } from 'react';
import { Switch } from 'antd';
import Doctor from "./doctor";
import DoctorFromClaims from '../doctorsFromClaims';

const DoctorToggleComponents = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = (checked) => {
    setIsToggled(checked);
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: '0.5rem',
        }}
      >
        <h4 style={{ fontWeight: "bold", marginRight : "2rem" }} className="textblue">Doctor Master</h4>
        <Switch
          checked={isToggled}
          onChange={handleToggle}
          checkedChildren="Doctors"
          unCheckedChildren="Doctors From Claims"
        />
      </div>

      {isToggled ? <Doctor /> : <DoctorFromClaims />}
    </div>
  );
};

export default DoctorToggleComponents;
