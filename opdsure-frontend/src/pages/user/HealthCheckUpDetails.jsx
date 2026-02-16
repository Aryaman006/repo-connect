import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, Button, message, notification } from "antd";
import config, { CONFIG_OBJ } from "../../config/config";
import { Axios } from "../../axios/axiosFunctions";
import { useNavigate, useParams } from "react-router-dom";
const HealthCheckUpDetails = () => {
  const { id } = useParams();
  const [allDetails, setAllDetails] = useState();

  const fetchData = async () => {
    const result = await Axios.fetchAxiosData(
      config.GetClaimsDetailsManagement + id
    );
    setAllDetails(result.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
  <>
  <h5>Health Check Up Details</h5>
  </>
  );
};

export default HealthCheckUpDetails;
