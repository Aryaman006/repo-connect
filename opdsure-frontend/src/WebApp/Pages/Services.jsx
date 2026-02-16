import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FloatButton } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import CONSTANTS from "../../constant/Constants";
import arrow from "../Assets/ArrowLeft.png";
import AccordionSection from "../CommonComponents/AccordionSection";

import inClinicImg from "../Assets/in-clinic-service.png";
import onlineImg from "../Assets/online-service.jpg";
import pharmacyImg from "../Assets/pharmacy-service1.jpg";
import vaccinationImg from "../Assets/vaccination-service.png";
import ambulanceImg from "../Assets/ambulance-service.jpg";
import diagnosticImg from "../Assets/diagnostic-service.png";
import gymfitnessImg from "../Assets/gym-service.jpg";
import healthcheckupImg from "../Assets/healthcheckups-service.jpg";
import yogaImg from "../Assets/yoga-service1.jpg";
import healthcardImg from "../Assets/healthcard-service.jpg";
import mentalImg from "../Assets/mentalwellness-service.jpg";
import specialImg from "../Assets/specialeducation-service.jpg";
import AccordionData from "../AccordionData";
import servicesBannerImg from "../Assets/services-banner.svg";
import { useLocation } from 'react-router-dom';


const Services = () => {
  const [showFloatButton, setShowFloatButton] = useState(true);
  const location = useLocation();
  const { hash } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const sectionId = location.hash.substring(1); // Remove the '#' from the hash
      const element = document.getElementById(sectionId);

      if (element) {
      
        const viewportHeight = window.innerHeight;
        const yOffset = viewportHeight / 2 - element.clientHeight / 2;
        const y = element.getBoundingClientRect().top + window.scrollY - yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    handleScroll();

  }, [location]);
  
 
  const handleScrollToTop = () => {
    // try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    // } catch (error) {
    //   notification.error({
    //     message: "Scroll Error",
    //     description:
    //       "An error occurred while scrolling to the top. Please try again later.",
    //   });
    // }
  };

  return (
    <>
      <div className="container-fluid bg-gradient-light pb-5">
        <div className="row">
          <div className="col-12 text-center p-0">
            <Link to="/homepage">
              <img
                src={arrow}
                alt="arrow for back to homepage"
                className="img-fluid z-5 position-absolute start-0 mt-2 ms-lg-5 ms-3 arrowSize bg-5dadec rounded-circle"
              />
            </Link>
          </div>
        </div>
        <div className="row d-flex justify-content-center align-items-center">
          <img
            src={servicesBannerImg}
            alt="Services Banner"
            className="w-100 img-fluid p-0"
          />
        </div>

        <div className="row mx-lg-5 mx-0">
          <div className="col-lg-12 col-12 mt-3">
            <h1 className="fw-700 text-243572 text-center fs-32px">
              OPDSure is your Comprehensive Solution for all OPD Benefits
            </h1>
            <p className="text-dark my-4 fw-400 " style={{textAlign:"justify"}}>
              OPDSure offers a complete solution for managing your OPD benefits, ensuring top-notch care and convenience. With access to premium doctor consultations, both online and in-person at clinics and hospitals across India, OPDSure prioritizes your health and well-being. Whether you need routine check-ups or specialized medical care, OPDSure simplifies the process, delivering excellence in healthcare services.
            </p>
          </div>
        </div>

        <AccordionSection
          title2="Online Consultations Made Easy "
          title1="In-Clinic Doctor Consultations Simplified"
          subtitle2="Book Online Consultations"
          subtitle1="Book In-clinic Consultations"
          imageSrc2={onlineImg}
          imageSrc1={inClinicImg}
          accordionData2={AccordionData.onlineConsultation}
          accordionData1={AccordionData.inClinicConsultation}
          accordionId2="accordion1"
          accordionId1="accordion2"
          cardlink2="/subscription-plans"
          cardlink1="/user/register"
          cardId2="online-consultation"
          cardId1="in-clinic-consultation"
        />
        <AccordionSection
          title1="Book Diagnostic Tests from Top Players"
          title2="Order Pharmacy"
          subtitle1="Order Tests"
          subtitle2={
            <p>
              Order Medicines -{" "}
              <Link to={CONSTANTS.COMPANY_DETAILS.PHARMA_EASY} target="_blank">
                ( PharmaEasy )
              </Link>
              &nbsp;
              <Link to={CONSTANTS.COMPANY_DETAILS.APOLLO_24} target="_blank">
                ( Apollo 24 )
              </Link>
            </p>
          }
          imageSrc1={diagnosticImg}
          imageSrc2={pharmacyImg}
          accordionData1={AccordionData.diagnostics}
          accordionData2={AccordionData.pharmacy}
          accordionId1="accordion3"
          accordionId2="accordion4"
          cardlink1={CONSTANTS.COMPANY_DETAILS.APOLLO_24}
          cardlink2=""
          cardId1="diagnostics"
          cardId2="pharmacy"
        />
        <AccordionSection
          title1="OPDSure’s Health Card"
          title2="Preventive Health Checkups"
          subtitle1="Create Health Card"
          subtitle2="Book Health Checkups"
          imageSrc1={healthcardImg}
          imageSrc2={healthcheckupImg}
          accordionData1={AccordionData.healthCard}
          accordionData2={AccordionData.healthCheckups}
          accordionId1="accordion6"
          accordionId2="accordion7"
          cardlink1="/user/register"
          cardlink2="/user/register"
          cardId1="health-card"
          cardId2="health-checkup"
        />
        <AccordionSection
          title1="Reliable Ambulance Services"
          title2="Dynamic Gym & Fitness Solutions"
          subtitle1="Call Ambulance"
          subtitle2="Book Classes"
          imageSrc1={ambulanceImg}
          imageSrc2={gymfitnessImg}
          accordionData1={AccordionData.ambulance}
          accordionData2={AccordionData.gymFitness}
          accordionId1="accordion8"
          accordionId2="accordion9"
          cardlink1="/user/register"
          cardlink2="/user/register"
          cardId1="ambulance"
          cardId2="gym-fitness"
        />
        <AccordionSection
          title1="Holistic Mental Wellness Support"
          title2="Specialized Education Services"
          subtitle1="Book Appointment"
          subtitle2="Book Classes"
          imageSrc1={mentalImg}
          imageSrc2={specialImg}
          accordionData1={AccordionData.mentalWellness}
          accordionData2={AccordionData.specialEducation}
          accordionId1="accordion10"
          accordionId2="accordion11"
          cardlink1="/user/register"
          cardlink2="/user/register"
          cardId1="mental-wellness"
          cardId2="special-education"
        />
        <AccordionSection
          title1="Convenient Vaccination Services"
          title2="Revitalize with Yoga"
          subtitle1="Book"
          subtitle2="Book Session"
          imageSrc1={vaccinationImg}
          imageSrc2={yogaImg}
          accordionData1={AccordionData.vaccinations}
          accordionData2={AccordionData.yoga}
          accordionId1="accordion12"
          accordionId2="accordion13"
          cardlink1="/user/register"
          cardlink2="/user/register"
          cardId1="vaccination"
          cardId2="yoga"
        />
      </div>
      {/* Scroll to Top Button */}
      {showFloatButton && (
        <FloatButton
          icon={<ArrowUpOutlined />}
          tooltip="Scroll to top"
          style={{ right: 60, bottom: 40, backgroundColor: "#5dadec" }}
          onClick={handleScrollToTop}
        />
      )}
    </>
  );
};

export default Services;
