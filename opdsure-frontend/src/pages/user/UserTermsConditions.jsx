import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/config";
import { useParams } from "react-router-dom";
import { Axios } from "../../axios/axiosFunctions";
import template from "../../assets/template.png";
import opdlogo from "../../assets/opdlogo1.png";

const UserTermsConditions = () => {

  const navigate = useNavigate();
  const [termsdata, setTermsData] = useState([]);

  const { TC_TYPE_ENUM } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
  }, []);
  useEffect(() => {
    const getTermsData = async () => {
      const result = await Axios.fetchAxiosData(
        `${config.GetTermsAndCondition}?TC_TYPE_ENUM=${TC_TYPE_ENUM.toUpperCase()}`
      );
      setTermsData(result.data);
    };
    getTermsData();
  }, [TC_TYPE_ENUM.toUpperCase]);

  return (
    <>
      <div
        className="container-fluid bg-light-blue d-flex align-items-center"
        style={{ height: "100vh" }}
      >
        {/* <img
          src={template}
          alt="background template"
          className="img-fluid z-5 position-absolute bottom-0 start-0 d-none d-lg-block d-md-block"
        /> */}

        <div className="row mx-auto" style={{ minWidth: "70%" }}>
          <div className="col-lg-10 col-12 mx-auto p-5 " style={{ textAlign: "justify" }}>
            <img src={opdlogo} width={200} height={100} alt="logo" />
            <h3 className="text-start textblue">Terms and Conditions</h3>      
              <div
              className="mt-4"
                style={{
                  height: "50vh",
                  overflowY: "scroll",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#486ab3 #eff4ff",
                  fontFamily:"'Lato', sans-serif"
                }}
                dangerouslySetInnerHTML={{ __html: termsdata?.condition }}
              />
            </div>
          </div>
        </div>
     
    </>
  );
};

export default UserTermsConditions;
