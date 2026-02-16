import React, { useState, useEffect } from "react";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { Button, Radio, Select } from "antd";
import tickicon from "../Assets/checktickicon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { Axios } from "../../axios/axiosFunctions";
import CONSTANTS from "../../constant/Constants";
import config from "../../config/config";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {faCircleChevronRight,faCircleChevronLeft, faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";

const OurPlans = () => {
  const [isindividualPlans, setIsIndividualPlans] = useState(true);
  const [planData, setPlanData] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardStates, setCardStates] = useState([]);
  const [chunkSize, setChunkSize] = useState(4);

  const navigate = useNavigate();

  const handlePlanChange = (event) => {
    setIsIndividualPlans(event.target.checked);
  };
  const sortPlanData = (data) => {
    return data?.sort((a, b) => {
      const chargeA = a.membership_options[0]?.charges || 0;
      const chargeB = b.membership_options[0]?.charges || 0;
      return chargeA - chargeB;
    });
  };
  const fetchPlanData = async () => {
    const response = await Axios.fetchAxiosData(config.GetPlanData, {
      params: { pageSize: 1000 },
    });
    const sortedPlanData = sortPlanData(response.data?.records);
    setPlanData(sortedPlanData);
    setCardStates(
      new Array(sortedPlanData?.length).fill({
        isChecked: false,
        selectedPlan: 0,
        selectedPlanLabel: null,
        selectedPlanPrice: null,
        selectedPlanPriceGST: null,
        cardSelectVisibility: {},
      })
    );
  };

  const chunkArray = (myArray, chunkSize) => {
    let index = 0;
    const arrayLength = myArray?.length;
    const tempArray = [];
    for (index = 0; index < arrayLength; index += chunkSize) {
      const myChunk = myArray.slice(index, index + chunkSize);
      tempArray.push(myChunk);
    }
    return tempArray;
  };

  const chunkedPlanData = chunkArray(planData, chunkSize);

  useEffect(() => {
    fetchPlanData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChunkSize(1); 
      }
      else if (window.innerWidth < 992) {
        setChunkSize(2); 
      }
      else {
        setChunkSize(4); 
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? chunkedPlanData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === chunkedPlanData.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
   
      <div className="container-fluid bg-gradient-light border border-1">
        <div className="row ">
          <div className="col-12 text-center position-relative ">
            <h1 className="text-center pt-3 fw-600 fs-32px">Plans</h1>
            <p className="fs-18px">Coverage for Doctor Consultations and OPD Expenses</p>
          </div>
        </div>

        <div className="row bg-transparent ">
         
            {isindividualPlans ? 
            (
              <div className="col-12 bg-transparent mx-auto">
             <div
              id="carouselExample"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {chunkedPlanData?.map((chunk, index) => (
                  <div
                    key={index}
                    className={`carousel-item ${
                      index === activeIndex ? "active" : ""
                    }`}
                  >
                    <div className="container-fluid">
                      <div className="row mx-5 my-4" style={{ height: "100%" }}>
                        {chunk?.map((plan, cardIndex) => (
                          <div
                            key={plan?._id}
                            className="col-md-6 col-lg-3 my-2 h-100"
                            style={{ height: "100%" }}
                          >
                            <div
                              className="card h-100 rounded-4 cardplanhover p-3 border-0"
                              style={{
                                height: "100%",
                                border: "1px solid #eaecff",
                              }}
                            >
                              <div className="card-header bg-transparent border-0 rounded-4">
                                <h4 className="card-title my-3 text-475467">
                                  {plan?.name}
                                </h4>

                                <div className="d-flex align-items-center">
                                  
                                
                                <p
                                  className="text-start fw-bold custom-font-size blurred-text"
                                  style={{ lineHeight: 0.1 }}
                                >
                                  <FontAwesomeIcon
                                    icon={faIndianRupeeSign}
                                    size="xs"
                                  />
                                  &nbsp;
                                  {!cardStates[cardIndex]?.isChecked &&
                                  !cardStates[cardIndex]?.cardSelectVisibility[
                                    cardIndex
                                  ] ? (
                                    <>
                                      {plan?.membership_options[0].charges_incl_GST.toLocaleString(
                                        "en-IN"
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {cardStates[cardIndex]?.selectedPlan &&
                                      cardStates[cardIndex]
                                        ?.cardSelectVisibility[cardIndex] ? (
                                        <>
                                          {plan?.membership_options
                                            ?.find(
                                              (option) =>
                                                option.membership_id ===
                                                cardStates[cardIndex]
                                                  ?.selectedPlan
                                            )
                                            ?.charges_incl_GST.toLocaleString(
                                              "en-IN"
                                            )}
                                        </>
                                      ) : !cardStates[cardIndex]
                                          ?.selectedPlan &&
                                        !cardStates[cardIndex]
                                          ?.cardSelectVisibility[cardIndex] &&
                                        cardStates[cardIndex]?.isChecked ? (
                                        <>
                                          {plan?.membership_options[0].charges_incl_GST.toLocaleString(
                                            "en-IN"
                                          )}
                                        </>
                                      ) : (
                                        <>Select Member</>
                                      )}
                                    </>
                                  )}
                                  {(!cardStates[cardIndex]?.isChecked &&
                                    cardStates[cardIndex]?.selectedPlanPrice ===
                                      null) ||
                                  cardStates[cardIndex]?.selectedPlanPrice !==
                                    null ? (
                                    <>
                                      
                                      <span className="fw-lighter text-475467">
                                        / {plan?.frequency === 1
                                         ? "Year"
                                         : plan?.frequency === 2
                                         ? "Half Year"
                                         : plan?.frequency === 3
                                         ? "Quarter Year"
                                         : plan?.frequency === 4
                                         ? "Month"
                                         : ""}
                                      </span>
                                    </>
                                  ) : null}
                                </p>
                                </div>
                                <p className="fw-bold">
                                  (incl GST {CONSTANTS.PAYMENT.GST}%)
                                </p>
                               
                              </div>
                              <div
                                className="card-body mt-0"
                                style={{ height: "10vh" }}
                              >
                                <p className="text-truncated">
                                  Unlimited Doctor Consultations across India -
                                  Online/Offline.
                                </p>
                               
                              </div>
                              <div className="card-footer bg-transparent text-center rounded-4 border-0">
                                <Button
                                  className="text-center my-4 rounded-pill px-4"
                                  type="primary"
                                  onClick={() =>
                                    navigate("/user/register")
                                  }
                                  
                                >
                                  VIEW MORE
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="carousel-control-prev mx-0 px-0"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="prev"
                hidden={activeIndex === 0}
          onClick={handlePrev}
              >
                {/* <span aria-hidden="true">
                  <LeftCircleOutlined className="textblue fs-1 position-absolute start-0 ms-3" />
                </span> */}
                <span aria-hidden="true"><FontAwesomeIcon icon={faCircleChevronLeft} size="2xl" className="text-243572" /></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next mx-0 px-0"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="next"
                hidden={activeIndex === chunkedPlanData.length - 1}
          onClick={handleNext}
              >
                {/* <span aria-hidden="true">
                  <RightCircleOutlined className="textblue fs-1 position-absolute end-0 me-3" />
                </span> */}
                 <span aria-hidden="true"><FontAwesomeIcon icon={faCircleChevronRight} size="2xl" className="text-243572" /></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
            </div>
            )
            :
            (
            <div className="d-lg-flex d-block gap-5 align-items-center justify-content-center" style={{marginTop: "-3.5rem"}}>
            {/* <div className="col-lg-5 col-12 text-lg-end text-center">
            <img src={planCorporateImage} alt="corporate plan image"  className="img-fluid "/>
            </div>
            <div className="col-lg-5 col-10 mt-4 text-lg-start mx-lg-0 mx-auto">
              <p className="fw-800 fs-24px" style={{lineHeight: "0.8em"}}>Employee Wellness Assistance Program!</p>
              <p className=" fw-600 fs-20px" style={{lineHeight: "0.7em"}}>We have everything covered for you.</p>
              <p className="fw-500 fs-18px">With affordable OPD annual subscription plans, we bridge gaps in medical assistance through technology, ensuring reliable care for everyone.</p>   
              <ol className="fw-400 fs-14px ps-3">
                <li>In-clinic Doctor / Virtual Consultation from top specialist doctors across India.</li>
                <li>Enjoy a 50% claim on prescribed pharmacy bills.</li>
                <li>Enjoy a 50% claim on prescribed diagnostic test bill.</li>
                <li>Flat 15% discounts on pharmacy ordering online.</li>
                <li>Free Preventive Annual Health Check-ups.</li>
                <li>Free loan and real estate consultations.</li>
                <li>Free wealth wellness consultation including personal tax planning and ITR filing from the experts.</li>
              </ol>
              <div className="d-flex justify-content-center">
              <a
                  href="#empWellCorporateForm" className="col-lg-6 col-12 mt-3">
                    <Button className="text-center bg-243673 col-12 text-white col-6 py-3 fs-18px fw-600" >Request Callback</Button>
                    </a> 
              </div>
            </div> */}
            </div>)}     
        </div>
        
      </div>
   
  );
};

export default OurPlans;
