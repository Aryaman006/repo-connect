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
  CheckOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Axios } from "../../axios/axiosFunctions";
import { Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import congrats from "../../assets/congrats.png";
import CONSTANTS from "../../constant/Constants";
import config from "../../config/config";
import arrow from "../Assets/ArrowLeft.png";
import arrowR from "../Assets/carouselR.png";
import arrowL from "../Assets/carouselL.png";
import tickicon from "../Assets/checktickicon.png";
import corpBenefits from "../Assets/corpBenefits.svg";

import CorpdocImg from '../Assets/CorpdocImg.png';
import SpecialistImg from '../Assets/SpecialistImg.png';
import PharmacyImg from '../Assets/PharmacyImg.png';
import DiagnosticTestsImg from '../Assets/DiagnosticTestsImg.png';
import PreventiveCheckupsImg from '../Assets/PreventiveCheckupsImg.png';
import WellnessPlansImg from '../Assets/WellnessPlansImg.png';
import OnSiteHealthServicesImg from '../Assets/OnSiteHealthServicesImg.png';
import MentalHealthWellnessImg from '../Assets/MentalHealthWellnessImg.png';
import FitnessAndLifestyleImg from '../Assets/FitnessAndLifestyleImg.png';
import VaccinationCoverageImg from '../Assets/CorpdocImg.png';
import HealthEducationImg from '../Assets/HealthEducationImg.png';
import OPDServicesImg from '../Assets/OPDServicesImg.png';

import GetStartedTodayForm from '../CommonComponents/GetStartedTodayForm';


const PlanPage = () => {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [planData, setPlanData] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cardStates, setCardStates] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [chunkSize, setChunkSize] = useState(3);

  const location = useLocation();
  const navigate = useNavigate();
  const onPlanChange = (checked, cardIndex) => {
    setSelectedCard({ ...cardStates[cardIndex] });

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
    const response = await Axios.fetchAxiosData(config.GetPlanData, {
      params: { pageSize: 1000 },
    });

    const sortedPlanData = sortPlanData(response.data?.records);
    setPlanData(sortedPlanData);
    setCardStates(
      new Array(sortedPlanData.length).fill({
        isChecked: false,
        selectedPlan: 0,
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
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChunkSize(1); 
      }
      else if (window.innerWidth < 992) {
        setChunkSize(3); 
      }
      else {
        setChunkSize(3); 
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const chunkedPlanData = chunkArray(planData, chunkSize);

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
    if (
      !cardStates[cardIndex].selectedPlanPrice &&
      !cardStates[cardIndex].selectedPlanPriceGST &&
      !cardStates[cardIndex].isChecked
    ) {
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
      selectedPlan: value,
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
    const { _id: plan_id, name: plan_name } = selectedCard;

    navigate("/user/payment", {
      state: {
        plan_values: {
          agreedTerms,
          plan_id,
          plan_name,
          selectedCard,
          membership_id: cardStates[selectedCard?.cardIndex]?.selectedPlan,
          planType: cardStates[selectedCard?.cardIndex]?.selectedPlanLabel,
          planPrice: cardStates[selectedCard?.cardIndex]?.selectedPlanPrice,
        },
      },
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const [isindividualPlans, setIsIndividualPlans] = useState(true);

  // const handleButtonChange = (event) => {
  //   setIsIndividualPlans(event.target.checked);
  // };

 

  useEffect(() => {
    if (location.pathname === '/subscription-plans') {
      setIsIndividualPlans(true);
    } else if (location.pathname === '/subscription-plans-corporate') {
      setIsIndividualPlans(false);
    }
  }, [location.pathname]); 

  const getModalWidth = () => {
    if (window.innerWidth < 576) return '80vw'; 
    if (window.innerWidth < 768) return '50vw'; 
    if (window.innerWidth < 992) return '50vw'; 
    if (window.innerWidth < 1200) return '25vw'; 
    return '25vw';
  };

  const  getButtonWidth = () =>{
    if (window.innerWidth < 576) return 30; 
    if (window.innerWidth < 768) return 30; 
    if (window.innerWidth < 992) return 40; 
    if (window.innerWidth < 1200) return 40; 
    return 40;
  }

  const corporatePlansBenefit = [
    {
      id: 1,
      title: "Doctor Access",
      description: "Get 24/7 access to top doctors in clinics, hospitals, or online anywhere in India",
      img: CorpdocImg,
    },
    {
      id: 2,
      title: "Specialist Coverage",
      description: "Consult with specialists in Allopathy, Homeopathy, and Ayurveda",
      img: SpecialistImg, 
    },
    {
      id: 3,
      title: "Pharmacy Benefits",
      description: "Receive up to 50% reimbursement on prescribed pharmacy bills",
      img: PharmacyImg, 
    },
    {
      id: 4,
      title: "Diagnostic Tests",
      description: "Claim up to 50% reimbursement on prescribed diagnostic tests",
      img: DiagnosticTestsImg,
    },
    {
      id: 5,
      title: "Preventive Health Checkups",
      description: "Enjoy complimentary annual preventive health checkups",
      img: PreventiveCheckupsImg, 
    },
    {
      id: 6,
      title: "Customized Wellness Plans",
      description: "Benefit from personalized consultations covering fitness, nutrition, stress management, and more",
      img: WellnessPlansImg, 
    },
    {
      id: 7,
      title: "On-Site Health Services",
      description: "OPDSure organizes on-site health services, including regular check-ups and consultations with healthcare professionals",
      img: OnSiteHealthServicesImg,
    },
    {
      id: 8,
      title: "Mental Health Wellness",
      description: "OPDSure provides mental health support, including consultations with mental health professionals and wellness programs",
      img: MentalHealthWellnessImg, 
    },
    {
      id: 9,
      title: "Fitness and Lifestyle",
      description: "Participate in yoga and meditation classes, healthy eating workshops, and other wellness programs",
      img: FitnessAndLifestyleImg, 
    },
    {
      id: 10,
      title: "Vaccination Coverage",
      description: "Coverage for vaccinations following animal bites to prevent infections and serious injuries",
      img: VaccinationCoverageImg, 
    },
    {
      id: 11,
      title: "Health Education and Workshops",
      description: "Attend regular sessions and workshops on nutrition, disease prevention, and healthy living practices",
      img: HealthEducationImg,
    },
    {
      id: 12,
      title: "24/7 OPD Services",
      description: "Our program offers round-the-clock access to doctors of your choice, enabling consultations with top specialists whenever needed",
      img: OPDServicesImg, 
    }
  ];
  

  return (
    <>
    <style>
      {`.ant-modal .ant-modal-footer {
        padding:1rem;
      }`}
    </style>
      <div className={`container-fluid ${isindividualPlans ? 'bg-gradient-light' : 'bg-white p-0'}`}>
        <div className="row">
          <div className={`col-12 text-center ${isindividualPlans ? 'pt-3' : 'p-0'}`}>
            <Link to={-1}>
              <img
                src={arrow}
                alt="arrow for back to homepage"
                className="img-fluid z-5 position-absolute start-0 ms-lg-5 ms-3 arrowSize"
              />
            </Link>
            {/* <img src={hearttemplate} className="img-fluid z-5 position-absolute start-0 ms-2 element" style={{top:"38%"}} alt="heart template" /> */}
{isindividualPlans ?
<>
<h1 className="fw-700 fs-32px">Retail Plans</h1>
<p>Coverage for Doctor Consultations and OPD Expenses</p>
</>
  :
<>
<img src={corpBenefits} alt="corporate benefits" className="img-fluid w-100 d-block mb-5"/>


</>
}
           
            {/* for toogler */}
            {/* <div className="btn-container d-flex justify-content-center mt-4">
              <label className="switch btn-color-mode-switch">
                <input
                  type="checkbox"
                  id="color_mode"
                  name="color_mode"
                  checked={isindividualPlans}
                  onChange={handleButtonChange}
                />
                <label
                  className="btn-color-mode-switch-inner"
                  data-off="Corporate"
                  data-on="Retail"
                  htmlFor="color_mode"
                />
              </label>
            </div> */}
          </div>
        </div>
        <div className="row justify-content-end me-5 mb-2">
          <div className="col-1 d-flex gap-1">
            <button
              className="border-0 bg-transparent"
              disabled={activeIndex === 0}
              onClick={handlePrev}
              hidden={!isindividualPlans}
            >
              <img src={arrowL} alt="arrow" width={getButtonWidth()} height={getButtonWidth()} />
            </button>
            <button
              className="border-0 bg-transparent"
              disabled={activeIndex === chunkedPlanData.length - 1}
              onClick={handleNext}
              hidden={!isindividualPlans}
            >
              <img src={arrowR} alt="arrow" width={getButtonWidth()} height={getButtonWidth()} />
            </button>
          </div>
        </div>
        <div className="row">
          {isindividualPlans ? (
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
                       <div className="row mx-lg-5 mx-2 mb-5" style={{ height: "75rem" }}>
                         {chunk?.map((plan, cardIndex) => (
                           <div
                             key={plan?._id}
                             className="col-md-4 col-lg-4 col-12 "
                             
                           >
                             <div
                               className="card h-100 cardplanhoverbig"
                               style={{
                                //  height: "100%",
                                 border: "1px solid #153780",
                               }}
                             >
                               <div className="card-header bg-transparent border-0 rounded-4">
                                 <h4 className="card-title my-3 text-153780">
                                   {plan?.name}
                                 </h4>
 
                                 <p
                                   className="text-start fw-bold custom-font-size blurred-text"
                                   style={{ lineHeight: 0.1 }}
                                 >
                                   <FontAwesomeIcon
                                     icon={faIndianRupeeSign}
                                     size="xs"
                                   />{" "}
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
                                     </>
                                   ) : null}
                                 </p>
                                 <p className="fw-bold blurred-text">
                                   (incl GST {CONSTANTS.PAYMENT.GST}%)
                                 </p>
                                 <div className="d-flex justify-content-between">
                                   <p className="fw-normal">
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

                                 </div>

                                 <p className="text-start fw-bold mt-3 fs-6 mb-0">
                                   Benefits of {plan?.name}:
                                 </p>
                               </div>
                               <div
                                 className="card-body mt-0 "
                                 style={{
                                   height: "27vh",
                                  //  overflow: "auto",
                                  //  scrollbarWidth: "none",
                                  //  msOverflowStyle: "none",
                                  // minHeight: "auto"
                                 }}
                               >
                                 <ul className="list-with-icons">
                                   {plan?.plan_benefits?.map(
                                     (benefit, index) => (
                                       <li className="list-item" key={index}>
                                         <img
                                           src={tickicon}
                                           alt="points icon"
                                           className="me-1 mt-1"
                                         />
                                         <p>
                                           <span className="fw-bold">
                                             {benefit?.plan_label}
                                           </span>
                                           -{benefit?.plan_feature}
                                         </p>
                                       </li>
                                     )
                                   )}
                                 </ul>
                               </div>
                               <div className="card-footer text-center bg-transparent rounded-4 border-0">
                                 <Button
                                   className="text-center my-4"
                                   type="primary"
                                   onClick={() =>
                                    navigate("/user/register")
                                  }
                                  //  disabled={
                                  //    cardStates[cardIndex]?.isChecked &&
                                  //    cardStates[cardIndex]?.selectedPlan === null
                                  //  }
                                  //  block
                                 >
                                   Subscribe Now
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
                 hidden
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
                 hidden
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
               width={getModalWidth()}
               height={"80%"}
               okButtonProps={{ disabled: !agreedTerms }}
             >
               <div
                 className="container-fluid"
                 style={{ backgroundColor: "#f6faff" }}
               >
                 <div className="row">
                   <div className="col-12">
                     <img
                       src={congrats}
                       alt="congrats"
                       className="img-fluid mb-2"
                     />
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
                             {
                               cardStates[selectedCard?.cardIndex]
                                 ?.selectedPlanLabel
                             }
                           </h6>
                         </>
                       ) : (
                         ""
                       )}
                       <h6 className="">
                         costing{" "}
                         <span className="fw-bold text-primary">
                           {" "}
                           <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
                           &nbsp;
                           {cardStates[
                             selectedCard?.cardIndex
                           ]?.selectedPlanPriceGST?.toLocaleString("en-IN", {
                             minimumFractionDigits: 2,
                             maximumFractionDigits: 2,
                           })}
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
           </div>
          )  :
          (
            <>
            {corporatePlansBenefit?.map((benefit, index) => (
              <div className="row d-flex align-items-center my-3 mx-auto rounded-3 border-0 bg-deefff" key={benefit.id} style={{width:"80%"}}>
                <div className="col-lg-1 col-md-1 col-3 my-auto">
                  <img
                    src={benefit.img}
                    alt="benefit"
                    className="img-fluid"
                    />
            
                </div>
                <div className="col-9 text-start my-2">
                  <h3 className="fw-600 fs-18px" style={{marginBottom:"0.1rem"}}>{benefit.title}</h3>
                  <p className="fw-400 fs-14px">{benefit.description}</p>
                </div>
              </div>))}

              <div>
              <GetStartedTodayForm />
              </div>
              </>
          )}     
         
        </div>
      </div>
    </>
  );
};

export default PlanPage;
