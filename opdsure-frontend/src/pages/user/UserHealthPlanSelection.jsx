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
const UserHealthPlanSelection = () => {
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

  const handleBookHealthPlan = (plan_id) => {
    navigate("/user/payment", { state: { health_plan_values: plan_id } });
  };


  useEffect(() => {
    if (location.pathname === '/health-plans') {
      setIsWebsitePlans(true);
    } else if (location.pathname === '/user/health-plans') {
      setIsWebsitePlans(false);
    }
  }, [location.pathname]);

  return (
    <>
      {/* <div className={`${isWebsitePlans ? "bg-gradient-light container-fluid px-5 py-4" : "container"}`}>
        
      <div className={`d-flex align-items-center gap-3 mb-2 ${isWebsitePlans ? 'pt-1' : 'pt-4'} `}>
        {!isWebsitePlans ? (
           <Link to="/user/dashboard">
           <LeftCircleOutlined className=" fs-1 text-purple mb-2" />
           </Link>
        ): (
          <Link to="/homepage">
              <img
                src={arrow}
                alt="arrow for back to homepage"
                className="img-fluid z-5 position-absolute start-0 ms-lg-5 ms-3 arrowSize"
              />
            </Link>
        )}
           
          </div>
        <div className="row">
          {healthPlanData?.map((plan) => (
            <div
              key={plan?._id}
              className="col-md-4 col-lg-4 my-2 h-100"
              style={{ height: "100%" }}
            >
              <div
                className="card rounded-4 border-1 shadow-sm h-100 mt-4 planCard"
                style={{ height: "100%" }}
              >
                <div className="card-header bg-white border-0 rounded-top-4 pt-0">
                  <div className="row d-flex">
                    <div className="col-9">
                      <h5 className="card-title my-3 fw-bold textHover">
                        {plan?.name}
                      </h5>
                    </div>

                    <div
                      className="col-3 p-2 textblue fs-3 text-center border-0 cardheadergradient rounded-end-4"
                      style={{ lineHeight: "0.7" }}
                    >
                      <p className="text-small fw-bold">{plan?.parameters}</p>
                      <p>Tests</p>
                    </div>
                  </div>
                  <hr style={{ borderStyle: "dashed" }} />
                  <h6 className="fw-bold mb-0">Tests Included</h6>
                </div>

                <div
                  className="card-body mt-0"
                  style={{
                    height: "27vh",
                    overflow: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
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
                <div
                  className="card-footer text-center rounded-bottom-4 border-0 py-0"
                  style={{ backgroundColor: "#f6faff" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-3">
                      <h5 className="text-center fw-bold">
                        ₹ {plan?.discounted_price.toLocaleString("en-IN")}
                      </h5>
                      <h5 className="text-center text-body-tertiary text-decoration-line-through">
                        ₹ {plan?.base_price.toLocaleString("en-IN")}
                      </h5>
                    </div>
                    <div>
                      <Button
                        className="text-center my-4 px-3 py-4 rounded-3 fw-bold fs-6"
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
      </div> */}

<div className={`${isWebsitePlans ? "bg-gradient-light container-fluid px-3 py-3" : "container"}`}>
   {/* Back button */}
  <div className={`d-flex align-items-center gap-3 mb-3 ${isWebsitePlans ? 'pt-1' : 'pt-4'}`}>
    {!isWebsitePlans ? (
      <Link to="/user/dashboard">
        <LeftCircleOutlined className="fs-1 text-purple mb-2" />
      </Link>
    ) : (
      <Link to="/homepage">
        <img
          src={arrow}
          alt="Back to homepage"
          className="img-fluid z-5 position-absolute start-0 ms-lg-5 ms-3 arrowSize"
          style={{ maxWidth: '30px', height: 'auto' }}
        />
      </Link>
    )}
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

export default UserHealthPlanSelection;
