import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Radio,
  Select,
  Switch,
  Badge,
  Form,
  Checkbox,
  notification,
} from "antd";
import {
  CheckCircleOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import config from "../config/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Axios } from "../axios/axiosFunctions";
import { Link } from "react-router-dom";
import congrats from "../assets/congrats.png";
import CONSTANTS from "../constant/Constants";
import {useAuth} from "../context/authProvider";
// import { LeftCircleOutlined } from "@ant-design/icons";
const userType = Number(localStorage.getItem("user_type"));
const PlanSelection = () => {
  const { corporate,subscriberType } = useAuth();
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [planData, setPlanData] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cardStates, setCardStates] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const navigate = useNavigate();
  const onPlanChange = (checked, cardIndex) => {
    
    setSelectedCard({ ...cardStates[cardIndex]});

    const updatedCardStates = [...cardStates];
    updatedCardStates[cardIndex] = {
      ...updatedCardStates[cardIndex],
      isChecked: checked,
      selectedPlan: 0 || null,
      selectedPlanLabel: null,
      selectedPlanPrice: null,
      selectedPlanPriceGST: null,
      cardSelectVisibility: {
        ...updatedCardStates[cardIndex].cardSelectVisibility,
        [cardIndex]: checked,
      },
    };
    setCardStates(updatedCardStates);
  };

  const sortPlanData = (data) => {
    return data.sort((a, b) => {
      const chargeA = a.membership_options[0]?.charges || 0;
      const chargeB = b.membership_options[0]?.charges || 0;
      return chargeA - chargeB; 
    });
  };
  const fetchPlanData = async () => {
    const response = await Axios.fetchAxiosData(config.GetPlanData);

    const sortedPlanData = sortPlanData(response.data?.records);
      setPlanData(sortedPlanData);
      setCardStates(
      new Array(sortedPlanData.length).fill({
        isChecked: false,
        selectedPlan:0 ,
        selectedPlanLabel: null,
        selectedPlanPrice: null,
        selectedPlanPriceGST: null,
        cardSelectVisibility: {},
      })
    );
  };

  useEffect(() => {
    fetchPlanData();
  }, []);

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  // Function to chunk array into groups of 4
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

  const chunkedPlanData = chunkArray(planData, 4);

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
  const handlePlanSelection = (plan, cardIndex) => {
    setSelectedCard({ ...plan, cardIndex });
    if (!cardStates[cardIndex].selectedPlanPrice && !cardStates[cardIndex].selectedPlanPriceGST && !cardStates[cardIndex].isChecked) {
      const defaultOption = plan?.membership_options[0];
      const updatedCardStates = [...cardStates];
      updatedCardStates[cardIndex] = {
        ...updatedCardStates[cardIndex],
        selectedPlanPrice: defaultOption?.charges,
        selectedPlanPriceGST: defaultOption?.charges_incl_GST,
      };
      setCardStates(updatedCardStates);
    }
    setIsModalVisible(true);
  };

  // testing function with useeffect

  useEffect(() => {
    if (selectedCard) {
      const updatedCardStates = [...cardStates];
      const { cardIndex, selectedPlan } = selectedCard;

      const selectedOption = planData[cardIndex]?.membership_options?.find(
        (option) => option.membership_id === selectedPlan
      );

      if (selectedOption) {
        updatedCardStates[cardIndex] = {
          ...updatedCardStates[cardIndex],
          selectedPlanLabel: selectedOption.membership_label,
          selectedPlanPrice: selectedOption.charges,
          selectedPlanPriceGST: selectedOption.charges_incl_GST,
        };
        setCardStates(updatedCardStates);
      }
    }
  }, [selectedCard]);

  const onPlanTypeChange = (value, cardIndex) => {
    setSelectedCard({ cardIndex, selectedPlan: value });
    const updatedCardStates = [...cardStates];
    updatedCardStates[cardIndex] = {
      ...updatedCardStates[cardIndex],
      selectedPlan: value ,
      cardSelectVisibility: {
        ...updatedCardStates[cardIndex].cardSelectVisibility,
        [cardIndex]: value,
      },
    };
    setCardStates(updatedCardStates);
  };

   const handleOk = () => {
    if (!agreedTerms) {
      notification.error({
        message: "Please agree to Terms and Conditions",
      });
      return;
    }
    setIsModalVisible(false);
    const {_id: plan_id, name: plan_name} = selectedCard
   
    navigate("/user/payment", { state: { plan_values :{agreedTerms , plan_id,plan_name, selectedCard, membership_id: cardStates[selectedCard?.cardIndex]?.selectedPlan , planType: cardStates[selectedCard?.cardIndex]?.selectedPlanLabel, planPrice: cardStates[selectedCard?.cardIndex]?.selectedPlanPrice}} });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>

<div className="d-flex align-items-center gap-3 m-3">
             <Link to={userType === CONSTANTS.MAN_USER_TYPES.GENERAL ? -1 : `/`}>
              <LeftCircleOutlined className="text-primary fs-3" />
            </Link>           
          </div>
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
              <div className="container-fluid bg-light">
                <div className="row mx-5" style={{ height: "100%" }}>
                  {chunk?.map((plan, cardIndex) => (
                    <div
                      key={plan?._id}
                      className="col-md-3 col-lg-3 my-5 h-100"
                      style={{ height: "100%" }}
                    >
                      <Badge.Ribbon
                        text={
                          cardStates[cardIndex]?.isChecked &&
                          cardStates[cardIndex]?.cardSelectVisibility[cardIndex]
                            ? "Family"
                            : "Individual"
                        }
                        color={
                          cardStates[cardIndex]?.isChecked &&
                          cardStates[cardIndex]?.cardSelectVisibility[cardIndex]
                            ? "green"
                            : "purple"
                        }
                      >
                        <div
                          className="card rounded-4 border-0  h-100 planCard "
                          style={{ height: "100%" }}
                        >
                          <div className="card-header bg-white border-0 rounded-4">
                            <h2 className="card-title my-3">{plan?.name}</h2>

                            <p className="text-start text-purple fw-bold custom-font-size" style={{lineHeight:0.1}}>

                              <FontAwesomeIcon
                                icon={faIndianRupeeSign}
                                size="xs"
                              />{" "}
                              &nbsp;
                              {!cardStates[cardIndex]?.isChecked &&
                              !cardStates[cardIndex]?.cardSelectVisibility[
                                cardIndex
                              ] ? (
                                // <>{plan?.membership_options[0].charges_incl_GST.toLocaleString("en-IN")}</>
                                <>{Math.round(plan?.membership_options[0].charges_incl_GST).toLocaleString("en-IN")}</>

                              ) : (
                                <>
                                  {cardStates[cardIndex]?.selectedPlan &&
                                  cardStates[cardIndex]?.cardSelectVisibility[
                                    cardIndex
                                  ] ? (
                                    <>
                                      {
                                        Math.round(plan?.membership_options?.find(
                                          (option) =>
                                            option.membership_id ===
                                            cardStates[cardIndex]?.selectedPlan
                                        )?.charges_incl_GST).toLocaleString("en-IN")
                                      }
                                    </>
                                  ) : !cardStates[cardIndex]?.selectedPlan &&
                                    !cardStates[cardIndex]
                                      ?.cardSelectVisibility[cardIndex] &&
                                    cardStates[cardIndex]?.isChecked ? (
                                    <>{Math.round(plan?.membership_options[0].charges_incl_GST).toLocaleString("en-IN")}</>
                                  ) : (
                                    <>Select Member</>
                                    // default showing value of array index 1 which is family plan 
                                        // because index 0 is excluded as it is  individual
                                    // <>
                                    // {plan?.membership_options[1].charges.toLocaleString("en-IN")}
                                    // </>
                                  )}
                                </>
                              )}
                              {
                                ((!cardStates[cardIndex]?.isChecked  && cardStates[cardIndex]?.selectedPlanPrice === null)
                                 || cardStates[cardIndex]?.selectedPlanPrice !== null) ?
                                 (<>
                                  /
                                  {plan?.frequency === 1
                                         ? "Year"
                                         : plan?.frequency === 2
                                         ? "Half Year"
                                         : plan?.frequency === 3
                                         ? "Quarter Year"
                                         : plan?.frequency === 4
                                         ? "Month"
                                         : ""}
                                </>):null
                              }
                            
                            </p>
                            <p className="textblue fw-bold">(incl GST {CONSTANTS.PAYMENT.GST}%)</p>
                            <div className="d-flex justify-content-between">
                              <p className="">
                                Billed{" "}
                                {plan?.frequency === 1
                                         ? "Annually"
                                         : plan?.frequency === 2
                                         ? "Half Yearly"
                                         : plan?.frequency === 3
                                         ? "Quarterly"
                                         : plan?.frequency === 4
                                         ? "Monthly"
                                         : ""}
                              </p>
                              <Radio.Group
                                value={cardStates[cardIndex]?.isChecked}
                                onChange={(e) =>
                                  onPlanChange(e.target.value, cardIndex)
                                }
                              >
                                <Radio value={false}>Individual</Radio>
                                <Radio value={true}>Family</Radio>
                              </Radio.Group>
                             
                            </div>
                                <Select
                                  placeholder="Select Member"
                                  className="col-12 my-3 text-start"
                                  onChange={(value) =>
                                    onPlanTypeChange(value, cardIndex)
                                  }
                                  disabled={!(cardStates[cardIndex]?.isChecked &&
                                    cardStates[cardIndex]?.cardSelectVisibility[cardIndex ])}
                                  value={cardStates[cardIndex]?.selectedPlan ===0 ? null : cardStates[cardIndex]?.selectedPlan}
                                  // default showing value of array index 1 which is family plan 
                                        // because index 0 is excluded as it is  individual
                                  // value={cardStates[cardIndex]?.selectedPlan || plan?.membership_options[1]?.membership_id}
                                >
                                  {plan?.membership_options
                                    ?.filter(
                                      (item) =>
                                        item.wallet_balance !== 0 &&
                                        item.charges !== 0
                                    )
                                    ?.map(
                                      (item, index) =>
                                        index !== 0 && (
                                          <Option
                                            key={item.membership_id}
                                            value={item.membership_id}
                                          >
                                            {item.membership_label}
                                          </Option>
                                        )
                                    )}
                                </Select>
                            <div
                              className="p-1 border border-1 rounded-3 bg-palelilac text-purple"
                              style={{ lineHeight: 1.2 }}
                            >
                              <p className="text-wrap">
                                On this plan, You will be rewarded with &nbsp;
                                <FontAwesomeIcon
                                  icon={faIndianRupeeSign}
                                  size="xs"
                                />
                                <span className="fw-bold">
                                  {!cardStates[cardIndex]?.isChecked &&
                                  !cardStates[cardIndex]?.cardSelectVisibility[
                                    cardIndex
                                  ] ? (
                                    <>
                                      {
                                        plan?.membership_options[0]
                                          .wallet_balance.toLocaleString("en-IN")
                                      }
                                    </>
                                  ) : (
                                    <>
                                      {cardStates[cardIndex]?.selectedPlan &&
                                      cardStates[cardIndex]
                                        ?.cardSelectVisibility[cardIndex] ? (
                                        <>
                                          {
                                            plan?.membership_options?.find(
                                              (option) =>
                                                option.membership_id ===
                                                cardStates[cardIndex]
                                                  ?.selectedPlan
                                            )?.wallet_balance.toLocaleString("en-IN")
                                          }
                                        </>
                                      ) : !cardStates[cardIndex]
                                          ?.selectedPlan &&
                                        !cardStates[cardIndex]
                                          ?.cardSelectVisibility[cardIndex] &&
                                        cardStates[cardIndex]?.isChecked ? (
                                        <>
                                          {
                                            plan?.membership_options[0]
                                              .wallet_balance.toLocaleString("en-IN")
                                          }
                                        </>
                                      ) : (
                                        <>-</>
                                        // default showing value of array index 1 which is family plan 
                                        // because index 0 is excluded as it is  individual
                                        // <>
                                        // {plan?.membership_options[1].wallet_balance.toLocaleString("en-IN")}
                                        // </>
                                      )}
                                    </>
                                  )}
                                  &nbsp;Wallet Balance.
                                </span>
                              </p>
                            </div>
                            <p className="text-start fw-bold mt-3 fs-6 mb-0">
                              Benefits of {plan?.name}:
                            </p>
                          </div>
                          <div
                            className="card-body mt-0"
                            style={{ height: "27vh", overflow: "auto", scrollbarWidth: "none",
                              msOverflowStyle: "none" }}
                          >
                            <ul className="list-with-icons">
                              {plan?.plan_benefits?.map((benefit,index) => (
                                <li className="list-item" key={index}>
                                  <CheckCircleOutlined className="list-icon text-purple" />
                                  <p>
                                    <span className="fw-bold">
                                      {benefit?.plan_label}
                                    </span>
                                    -{benefit?.plan_feature}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="card-footer text-center bg-white rounded-4 border-0">
                            <Button
                              className="text-center my-4"
                              type="primary"
                              onClick={() =>
                                handlePlanSelection(plan, cardIndex)
                              }
                              disabled={
                                cardStates[cardIndex]?.isChecked &&
                                cardStates[cardIndex]?.selectedPlan === null
                              }
                            >
                              Buy Now
                            </Button>
                          </div>
                        </div>
                      </Badge.Ribbon>
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
          onClick={handlePrev}
          hidden={activeIndex === 0}
        >
          <span aria-hidden="true">
            <LeftCircleOutlined className="textblue fs-1 position-absolute start-0 ms-3" />
          </span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next mx-0 px-0"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
          onClick={handleNext}
          hidden={activeIndex === chunkedPlanData.length - 1}
        >
          <span aria-hidden="true">
            <RightCircleOutlined className="textblue fs-1 position-absolute end-0 me-3" />
          </span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <Modal
        open={isModalVisible}
        onOk={handleOk}
        okText="Continue"
        onCancel={handleCancel}
        centered
        width={"25%"}
        height={"80%"}
        
      >
        <div className="container-fluid"  style={{backgroundColor:"#f6faff"}} >
          <div className="row" >
            <div className="col-12">
              <img src={congrats} alt="congrats" className="img-fluid mb-2"/>
              </div>
            {selectedCard && (
              <div className="col-12 ms-3">
                <h6 className="">
                  You have selected{" "}
                  <span className="fw-bold text-primary">
                    {selectedCard?.name} Plan
                  </span>
                  &nbsp; for{" "}
                  {cardStates[selectedCard?.cardIndex]?.isChecked
                    ? "Family"
                    : "Yourself"}
                </h6>
                {cardStates[selectedCard?.cardIndex]?.isChecked ? (
                  <>
                    <h6 className="fw-bold">
                      {" "}
                      Plan Type:{" "}
                      {cardStates[selectedCard?.cardIndex]?.selectedPlanLabel}
                    </h6>
                  </>
                ) : (
                  ""
                )}
                <h6 className="">
                  costing {" "}
                  <span className="fw-bold text-primary">
                    {" "}
                    <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
                    &nbsp;
                    {cardStates[selectedCard?.cardIndex]?.selectedPlanPriceGST?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span> (incl. GST)</span>
                </h6>
              </div>
            )}
          </div>

          <div className="col-12 d-flex align-items-center">
          <p className="mt-4 text-small">
                <Checkbox
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                >
                  By confirming, you agree to the
                  <Link
                    to="#"
                    onClick={() =>
                      openInNewTab("/user/terms-and-conditions/payment")
                    }
                  >
                    {" "}
                    Terms and Conditions
                  </Link>
                </Checkbox>
          </p>
          </div>
           
        </div>
      </Modal>
    </>
  );
};

export default PlanSelection;
