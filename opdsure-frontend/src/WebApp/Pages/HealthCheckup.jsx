import React, { useEffect, useState } from "react";
import { Button, Collapse, theme } from "antd";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  Link, useNavigate, useLocation } from "react-router-dom";
import { Axios } from "../../axios/axiosFunctions";
import config from "../../config/config";
import { LeftCircleOutlined } from "@ant-design/icons";
import arrow from "../../WebApp/Assets/ArrowLeft.png";

const { Panel } = Collapse;
const HealthCheckupPlans = () => {
  const [healthPlanData, setHealthPlanData] = useState([]);
  const [isWebsitePlans , setIsWebsitePlans] = useState(false);
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchHealthPlanData = async () => {
    const response = await Axios.fetchAxiosData(config.GetAllHealthPlanData);
    setHealthPlanData(response.data?.records);
  };
  useEffect(() => {
    fetchHealthPlanData();
  }, []);

  const handleBookHealthPlan = () => {
        navigate("/user/register")
  };

  return (
    <>

<div className={`${isWebsitePlans ? "bg-gradient-light container-fluid px-3 py-3" : "container"}`}>
   {/* Back button */}
   <div className="row">
            <div className={`col-12 text-center mt-4`}>
              <Link to={-1}>
                <img
                  src={arrow}
                  alt="arrow for back to homepage"
                  className="img-fluid z-5 position-absolute start-0 ms-lg-5 ms-3 arrowSize"
                />
              </Link>
 
             <h1 className="fw-700 fs-32px my-4">Health Checkup Plans</h1>
  
            </div>
    </div>

{/* Health Plan Cards */}
  <div className="row g-3">
    {healthPlanData?.map((plan) => (
      <div
        key={plan?._id}
        className="col-12 col-sm-6 col-md-4 my-2 h-100"
      >
        <div className="card rounded-4 border-1 shadow-sm h-100">
            {/* Card Header */}
          <div className="card-header bg-white border-0 rounded-top-4 pt-0">
            <div className="row d-flex">
              <div className="col-9">
                <h5 className="card-title my-3 fw-semibold textHover">{plan?.name}</h5>
              </div>
              <div
                className="col-3 p-1 textblue fs-3 text-center border-0 cardheadergradient rounded-end-4"
                style={{ lineHeight: "1" }}
              >
                <p className="text-small fw-bold">{plan?.parameters}</p>
                <p className="responsive-text fw-bold">Tests</p>

              </div>
            </div>
            <hr style={{ borderStyle: "dashed" }} />
            <h6 className="fw-bold mb-0">Tests Included</h6>
          </div>

           {/* Card Body */}
          <div
            className="card-body mt-0"
            style={{
              height: "27vh",
              overflowY: "hidden",
            }}
          >
            <Collapse
              bordered={false}
              defaultActiveKey={["0"]}
              expandIconPosition="right"
              style={{ background: token.colorBgContainer }}
            >
              {plan?.test_details?.map((benefit, index) => (
                <Panel
                  header={
                    <span className="fw-bold textblue">
                      {benefit.sub_parameter}
                    </span>
                  }
                  key={index}
                  collapsible={benefit.sub_parameter_count === 1 ? 'disabled' : 'header'}
                >
                  <div
                    className="textHover"
                    dangerouslySetInnerHTML={{
                      __html: benefit.tests_name,
                    }}
                  ></div>
                </Panel>
              ))}
            </Collapse>
          </div>

          {/* Card Footer */}  
          <div
            className="card-footer text-center rounded-bottom-4 border-0 py-0"
            style={{ backgroundColor: "#f6faff" }}
          >
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="d-flex gap-3">
                <h5 className="fw-bold mb-0">
                  ₹ {plan?.discounted_price.toLocaleString("en-IN")}
                </h5>
                <h5 className="text-decoration-line-through text-muted">
                  ₹ {plan?.base_price.toLocaleString("en-IN")}
                </h5>
              </div>
              <div>
                <Button
                  className="text-center my-4 px-3 py-2 rounded-3 fw-bold fs-6"
                  type="primary"
                  onClick={() => handleBookHealthPlan(plan._id)}
                >
                  Buy Now
                  <FontAwesomeIcon icon={faArrowRightLong} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

    </>
  );
};

export default HealthCheckupPlans;
