import React, { useState, useEffect } from "react";
import { Card , Avatar,Tooltip} from "antd";
import CONSTANTS from "../constant/Constants";

const ProfileCard = ({ name, email, designation, mobile }) => {

  const [designationString, setDesignationString] = useState("");
  const getDesignationString = (designation) => {
    if (designation == undefined || designation == undefined || designation == null) {
      setDesignationString("System Admin");
    } else {
      setDesignationString(CONSTANTS.DESIGNATIONS[Number(designation)]?.value);
    }
  };

  useEffect(() => {
    getDesignationString(designation);
  }, [designation]);

  return (
    <Card
      style={{
        width: '13rem',
        height: '3rem',
        display: 'flex',
        alignItems: 'center',
        border: 'none',
      }}
    >
      <div className="d-flex justify-content-between my-auto ">
        <div className="me-2">
        <Tooltip title={<div className="m-0 p-0"> <p className="m-0 p-0">{name}</p> <p className="m-0 p-0">{email}</p></div>}>
        <Avatar
        style={{
        backgroundColor: '#a8c5e8',
        color: '#486AB3',
        }}
        >
        {designationString.charAt(0).toUpperCase()}
        </Avatar>
        </Tooltip>
        </div>
        <div className="my-auto ms-2">
        <p className="textblue my-auto ">{designationString}</p>
         </div>
      </div>
      
    </Card>
  );
};

export default ProfileCard;
