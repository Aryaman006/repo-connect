import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import doctorAboutUs from "../Assets/doctor-about-us.png";
import MarqueeBox from "../CommonComponents/MarqueeBox";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  imageUrlsCoporateClients,
  imageUrlsOrganizationTrusted,
} from "../imageData";
import {Card} from "antd";
import ContactUsPage from "./ContactUsPage";
import happyclient from "../Assets/online-doctor-concept.png";
import doctor from "../Assets/doctorvector.png";
import celebration from "../Assets/celebration.png";
import appointment from "../Assets/appointment.png";
import config from "../../config/config";
import { Axios } from "../../axios/axiosFunctions";
import visionMissionImg from "../Assets/visionMission.svg";
import banneraboutus from "../Assets/foraboutus.svg";
import banner1 from "../Assets/banner1.png"
import appstore from "../Assets/App Store.png";
import playstore from "../Assets/Play Store.png";
import CONSTANTS from "../../constant/Constants";
import jyotiImg from "../Assets/jyoti-img.png";
import tareqImg from "../Assets/tareq-img.png";
import umeshImg from "../Assets/umesh-img.jpeg";
import manojImg from "../Assets/manoj-img.jpeg";
import neerajImg from "../Assets/neeraj-img.jfif";
import richaImg from "../Assets/richa-img.jfif";
import missionVisionNew from "../Assets/mission_vision_new.png";
import { FloatButton } from "antd";
import { ArrowUpOutlined,PhoneFilled,MailFilled, EnvironmentFilled } from "@ant-design/icons";
import pdf1 from "../Assets/StartupIndia.pdf";
import pdf from "../Assets/MSMEUdyam.pdf";
import {
  faCircleChevronRight,
  faCircleChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
const AboutUsPage = () => {
  const [happyyclient, setHappyclient] = useState(0);
  const [doctorr, setDoctor] = useState(0);
  const [experience, setExperience] = useState(0);
  const [appointmentt, setAppointment] = useState(0);
  const aboutUsRef = useRef(null);
  const isVisible = useRef(false);
  const [showFloatButton, setShowFloatButton] = useState(true);
  const [chunkSize, setChunkSize] = useState(4);
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
  }, []);
  const handleScrollToTop = () => {
   
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      notification.error({
        message: "Scroll Error",
        description:
          "An error occurred while scrolling to the top. Please try again later.",
      });
    }
  };
  const startAnimations = () => {
    if (!isVisible.current) {
      isVisible.current = true;
      fetchCountStats();
    }
  };

  const fetchCountStats = async () => {
    try {
      const response = await Axios.fetchAxiosData(config.GetFileSize);
      animateValue(setHappyclient, 0, response?.data[0]?.speciality, 2000);
      animateValue(setDoctor, 0, response?.data[0]?.doctor, 2000);
      animateValue(setExperience, 0, response?.data[0]?.years_of_exp, 2000);
      animateValue(setAppointment, 0, response?.data[0]?.appointment, 2000);
    } catch (error) {
      console.error("Error fetching count stats:", error);
    }
  };

  const animateValue = (setter, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setter(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimations();
        } else {
          isVisible.current = false;
        }
      },
      { threshold: 0.5 }
    );

    if (aboutUsRef.current) {
      observer.observe(aboutUsRef.current);
    }

    return () => {
      if (aboutUsRef.current) {
        observer.unobserve(aboutUsRef.current);
      }
    };
  }, []);

  const OurTeamData = [
    {
      name: "Mr. Umesh Gangadhar",
      position: "Founder & Chief Executive Officer",
      image: umeshImg,
      profile:
        "Umesh, holds more than two decades experience in sales & operations. Umesh was keen on the idea of OPDSure, which originated post COVID-19 Pandemic with a mission to provide affordable healthcare services along with knowledge of personal finance to everyone, all under one roof, to cater to long-term wealth and health needs. At OPDSure, we aim to drive the company to making high-quality healthcare, through technology, affordable and accessible to everyone, anywhere, and everywhere",
      linkedinLink: "https://www.linkedin.com/in/umesh-g-opdsure/",
    },
    // {
    //   name: "Mr. Neeraj Kapoor",
    //   position: "Co-Founder & Chief Operating Officer",
    //   image: neerajImg,
    //   profile:
    //     "Neeraj Kapoor brings over two decades of expertise in technology and digital transformation to his role as Co-Founder and Chief Operating Officer at OPDSure. He views OPDSure as a groundbreaking force in the HealthTech sector, seamlessly blending cutting-edge technology with strategic operational excellence to reshape how medical services are delivered. Neeraj believes OPDSure stands at the forefront of a transformative shift in healthcare, committed to enhancing medical accessibility and personal well-being through innovative solutions. His leadership and vision are instrumental in driving OPDSure’s mission to empower proactive health management and foster a more connected and efficient healthcare ecosystem, where technology and compassionate care converge to improve lives on a global scale.",
    //   linkedinLink: "https://www.linkedin.com/in/neeraj-kapoor-a02a02a0/",
    // },
    // {
    //   name: "Mrs. Jyoti (Tiwari) Bhaskar",
    //   position: "Co-Founder & Chief Sales Officer",
    //   image: jyotiImg,
    //   profile:
    //     "Jyoti holds nearly two decades of experience in B2B Sales, Distribution management & Key account management. Jyoti believes OPDSure as a HealthTech reflects a transformative synergy between cutting-edge technology and compassionate care, promising to improve medical accessibility, empower proactive well-being, and usher in an era of effortless and holistic tailored health management. She trusts OPDSure has the ability to transform how we perceive and pursue our wellness journey, combining creativity with empathy to build a healthier and more harmonious world.",
    //   linkedinLink: "https://www.linkedin.com/in/jyoti-bhaskar-opdsure/",
    // },
    // {
    //   name: "Mr. Manoj Pal",
    //   position: "Co-Founder & Chief Financial Officer",
    //   image: manojImg,
    //   profile:
    //     "Manoj holds more than three decades experience in Finance & operations. Manoj's focus brings forth exemplary leadership in improving and creating healthier lives by offering great health and wealth services while lowering the cost of healthcare for everyone in the areas we serve.",
    //   linkedinLink: "https://www.linkedin.com/in/manoj-pal-a3842823/",
    // },
   
    // {
    //   name: "Dr. Tareq Abdulqader",
    //   position: "Co-Founder & Chief Technology Officer",
    //   image: tareqImg,
    //   profile:
    //     "Dr. Tareq holds extensive knowledge in Engineering with experience in working with multiple sectors like, Oil and Gas, Renewables, Water Treatment Centers and Manufacturing Dr. Tareq's diverse and varied knowledge, combined with his passion for innovation and next-generation technologies, has prompted him to become part of OPDSsure. He understands the significance of healthcare and its potential growth in the next few years. He continues to focus his efforts on adopting business strategies in accordance with technology, which will contribute to OPDSure being a top player with exponential and steady growth.",
    //   linkedinLink: "https://www.linkedin.com/in/tareq-abdulqader/",
    // },
    // {
    //   name: "Ms. Richa Chhatani",
    //   position: "Director of Marketing",
    //   image: richaImg,
    //   profile:
    //     "Richa Chhatani brings a wealth of expertise in the fields of business development and strategy, with a proven track record of driving growth and innovation. With extensive experience in managing cross-functional teams and leading impactful projects, Richach is known for her strategic vision and ability to foster strong client relationships. Her commitment to excellence and her adeptness in navigating complex business landscapes underscore her role as a key driver in optimizing organizational performance and delivering sustainable success.",
    //   linkedinLink: "https://www.linkedin.com/in/richachhatani/",
    // },
  ];
  const getDownloadButtonWidth = () => {
    if (window.innerWidth < 576) {
      return 40;
    }
    else if (window.innerWidth < 768) {
      return 95;
    } else if (window.innerWidth < 992) {
      return 85;
    } else {
      return 120;
    }
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setChunkSize(1);
      }
      else if (window.innerWidth < 768) {
        setChunkSize(1); 
      }
      else if (window.innerWidth < 992) {
        setChunkSize(2); 
      }
      else if (window.innerWidth < 1200) {
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

  const chunkedCoreTeamData = chunkArray(OurTeamData,  chunkSize);
  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? chunkedCoreTeamData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === chunkedCoreTeamData.length - 1 ? 0 : prevIndex + 1
    );
  };
  return (
    <>
     <style>
        {`
          .next, .prev {
            width: 9% !important;
            opacity: 1;
            margin-bottom: 7rem;
          }
        `}
      </style>
      <div className="container-fluid bg-gradient-light pb-4">
        {/* <div className="row mx-5">
          <div className="col-lg-8 col-12 mt-5">
            <h1 className="fw-800 text-243572 fs-36px">
              Revolutionizing Doctor Consultation with OPDsure
            </h1>
            <p className="text-dark my-4 fw-400">
              OPDsure is at the forefront of revolutionizing doctor
              Consultations through innovative technology solutions. Our mission
              is to provide accessible and efficient healthcare services to
              individuals and families across India.
            </p>
          </div>
        </div>

        <div className="row mx-5">
          <div className="col-lg-8 col-12 mt-5">
            <h1 className="fw-800 text-243572 fs-36px mb-4">
            Unleashing Technological Innovation
            </h1>
            <h5 className="fw-600 text-5dadec">
              Innovative Solutions
            </h5>
            <p className="text-dark my-4 fw-400">
            OPDsure leverages cutting-edge technology to develop innovative solutions that transform doctor consultation process.
            </p>

            <h5 className="fw-600 text-5dadec">
            Advanced Technology
            </h5>
            <p className="text-dark my-4 fw-400">
            Our use of advanced technology ensures efficient and secure doctor consultation service.
            </p>

            <h5 className="fw-600 text-5dadec">
            Integrated Systems
            </h5>
            <p className="text-dark my-4 fw-400">
            We integrate various systems to create a seamless doctor consultation process and preventive healthcare.
            </p>
          </div>
        </div>

        <div className="row mt-3 pt-5">
          <div className="col-lg-6 col-12">
            <img src={doctorAboutUs} alt="doctor image" className="img-fluid" />
          </div>
          <div className="col-lg-6 col-12" ref={aboutUsRef}>
            <h2 className="fw-800 text-243572 fs-36px">
              Streamlined OPD Solutions for Efficient Healthcare
            </h2>
            <div className="col-12 d-flex mt-5 flex-wrap justify-content-center">
              <div className="col-lg-6 mt-0 mt-lg-4">
                <div
                  className="card bg-f7f7f7 border-0 text-center cardhover mx-5"
                  style={{ minWidth: "17.25rem", minHeight: "12rem" }}
                >
                  <div className="card-body">
                    <img src={happyclient} alt="happy-client" height={50} />
                    <h6 className="card-subtitle my-3 text-body-secondary fs-18px">
                      Specialities
                    </h6>
                    <h3 className="card-title fw-600 fs-40px ">
                      {happyyclient}+
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mt-4">
                <div
                  className="card bg-f7f7f7 border-0 text-center cardhover mx-5"
                  style={{ minWidth: "17.25rem", minHeight: "12rem" }}
                >
                  <div className="card-body ">
                    <img src={celebration} alt="experience" height={50} />
                    <h6 className="card-subtitle my-3 text-body-secondary fs-18px">
                      Years of Experience
                    </h6>
                    <h3 className="card-title fw-600 fs-40px">{experience}+</h3>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mt-4">
                <div
                  className="card bg-f7f7f7 border-0 text-center cardhover mx-5"
                  style={{ minWidth: "17.25rem", minHeight: "12rem" }}
                >
                  <div className="card-body">
                    <img src={doctor} alt="doctor" height={50} />
                    <h6 className="card-subtitle my-3 text-body-secondary fs-18px">
                      Specialized Doctors
                    </h6>
                    <h3 className="card-title fw-600 fs-40px">{doctorr}+</h3>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 my-4">
                <div
                  className="card bg-f7f7f7 border-0 text-center cardhover mx-5"
                  style={{ minWidth: "17.25rem", minHeight: "12rem" }}
                >
                  <div className="card-body">
                    <img src={appointment} alt="appointment" height={50} />
                    <h6 className="card-subtitle my-3 text-body-secondary fs-18px">
                      Online Appointments
                    </h6>
                    <h3 className="card-title fw-600 fs-40px">
                      {appointmentt}+
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

         <div className="row position-relative">
          <div className="col-12 p-0">
            <img src={banner1} alt="banner" className="img-fluid w-100 "/>
          </div>
          {/* <div className="col-5 end-0 bottom-0 position-absolute d-flex justify-content-start gap-lg-5 gap-4 mb-1 mb-lg-3">
              <div className="col-lg-1 me-lg-5 me-md-5 me-4 col-1 d-flex justify-content-center">
              <Link to={CONSTANTS.COMPANY_DETAILS.PLAY_STORE} target="_blank">
                <img src={playstore} alt="playstore" width={getDownloadButtonWidth()} />
              </Link>
              </div>
              <div className="col-lg-1 col-1 d-flex justify-content-center">
              <Link to={CONSTANTS.COMPANY_DETAILS.APP_STORE} target="_blank">
                <img src={appstore} alt="appstore" width={getDownloadButtonWidth()} />
              </Link>
              </div>
          </div> */}
        </div>
            
        <div className="row mx-5 mt-lg-3 mt-0">
          <div className="col-lg-12 col-12">
            <h1 className="fw-700  text-center mb-3 fs-32px">Founder and CEO</h1>
          </div>
        </div>

        <div id="coreteamCarousel" className="carousel slide">
        <div className="carousel-inner">
        {chunkedCoreTeamData?.map((chunk, index) => (
            <div
              key={index}
              className={`carousel-item ${index === activeIndex ? "active" : ""}`}
            >
        <div className="row d-flex justify-content-center">
          {chunk?.map((data, index) => (
            <div
              className="col-lg-3 col-md-6 col-12 "
              key={index}
            >
              <div
                className="card bg-white border-0 team-card "
                style={{ width: '100%', height:"76%"}}
              >
                <div className="card-header text-center bg-white  border-0 h-100">
                  <Link to={data.linkedinLink} target="_blank">
                    <FontAwesomeIcon
                      icon={faLinkedin}
                      style={{ color: "#0664b1" }}
                      size="2xl"
                      className="position-absolute top-0 end-0 m-3 icon-enlarge"
                    />
                  </Link>
                  <img
                    src={data.image}
                    alt="team member"
                    className="img-fluid rounded-circle mt-2"
                    style={{ width: "10rem", height: "10rem" }}
                  />
                  <h6 className="card-title fw-800 text-243572 mt-5">
                    {data.name}
                  </h6>
                  <p className="card-subtitle fw-600 text-5dadec fs-14px mb-4">
                    {data.position}
                  </p>
                </div>
                <div
                  className="card-body mt-0 team-card-body invisible"
                  style={{
                    height: "17vh",
                    overflow: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <p className="card-text text-dark fw-400 p-2" style={{textAlign:"justify"}}>
                    {data.profile}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
        
          ))}
           {/* <button
          className="carousel-control-prev prev"
          type="button"
          data-bs-target="#coreteamCarousel"
          data-bs-slide="prev"
          // hidden={activeIndex === 0}
          onClick={handlePrev}
        >
           <span aria-hidden="true">
                  <FontAwesomeIcon
                    icon={faCircleChevronLeft}
                    size="2xl"
                    className="text-243572 "
                  />
                </span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next next"
          type="button"
          data-bs-target="#coreteamCarousel"
          data-bs-slide="next"
          // hidden={activeIndex === chunkedCoreTeamData.length - 1}
          onClick={handleNext}
        >
           <span aria-hidden="true">
                  <FontAwesomeIcon
                    icon={faCircleChevronRight}
                    size="2xl"
                    className="text-243572"
                  />
                </span>
          <span className="visually-hidden">Next</span>
        </button> */}
        </div>
        </div>

         {/* marquee of organizations trusted us */}
         {/* <div className="row ">
          <div className="col-12 pt-3 position-relative border border-1 px-0 bg-white">
            <h1 className="text-center fw-700 mb-3 fs-32px">
              Organizations That Trusted Us
            </h1>
            <MarqueeBox
              images={imageUrlsCoporateClients}
              direction="right"
              bgColor={"bg-white"}
            />
            <MarqueeBox
              direction={"left"}
              images={imageUrlsOrganizationTrusted}
              bgColor={"bg-white"}
            />
          </div>
        </div> */}

        <div className="row d-flex justify-content-center">
          <div className="col-lg-10 col-12">
            <img src={missionVisionNew} alt="vision mission" className="img-fluid w-100 border rounded" />
          </div>
        </div>

        <div className="row d-flex justify-content-center">
        <h2 className="fw-700 text-243572 text-center my-3 fs-32px">Certified & Recognized By</h2>
          <div className="col-lg-4 col-md-5 col-12 my-3 pdf-height">
            <iframe src={pdf1} width="100%" height="100%"  frameBorder={0}> 
          </iframe>
          </div>
          <div className="col-lg-4 col-md-5 col-12 my-3 pdf-height">
         <iframe src={pdf} width="100%" height="100%"  frameBorder={0}>
         </iframe>
          </div>
        </div>

        {/* <ContactUsPage /> */}
       
      </div>
      {/* Scroll to Top Button */}
      {showFloatButton && (
        <FloatButton
          icon={<ArrowUpOutlined />}
          tooltip="Scroll to top"
          style={{ right: 20, bottom: 20, backgroundColor: "#5dadec" }}
          onClick={handleScrollToTop}
        />
      )}
    </>
  );
};

export default AboutUsPage;


{/* <Card
style={{
  maxWidth: '80rem',
  margin: 'auto',
  padding: '0.5rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}}
>
<div className="container">
  <h3 className="text-center mb-4 fw-700" style={{color:"#233572"}}>Contact Information</h3>
  <div className="row text-center">
    
    <div className="col-12 col-md-4 mb-4">
      <div className="d-flex align-items-center justify-content-center">
        <PhoneFilled className="fs-2 me-2 text-primary"  style={{color:"4a68b1 "}} />
        <div>
         
          <p className="mb-0 text-muted">+91-9810113654</p>
        </div>
      </div>
    </div>

    <div className="col-12 col-md-4 mb-4">
      <div className="d-flex align-items-center justify-content-center">
        <MailFilled className="fs-2 me-2 text-primary" />
        <div>
        
          <p className="mb-0 text-muted">support@opdsure.com</p>
        </div>
      </div>
    </div>

    
    <div className="col-12 col-md-4 mb-4">
      <div className="d-flex align-items-center justify-content-center">
        <EnvironmentFilled className="fs-2 me-2 text-primary" />
        <div>
         
          <p className="mb-0 text-muted">
            OPDSure Altf Tower, Sector 142, Noida, Uttar Pradesh - 201304
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
</Card> */}