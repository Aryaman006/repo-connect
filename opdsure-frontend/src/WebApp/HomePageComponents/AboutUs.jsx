import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { notification } from "antd";
import appstore from "../Assets/App Store.png";
import playstore from "../Assets/Play Store.png";
import happyclient from "../Assets/online-doctor-concept.png";
import doctor from "../Assets/doctorvector.png";
import celebration from "../Assets/celebration.png";
import appointment from "../Assets/appointment.png";
import config from "../../config/config";
import { Axios } from "../../axios/axiosFunctions";
import CONSTANTS from "../../constant/Constants";
const AboutUs = () => {
  const [happyyclient, setHappyclient] = useState(0);
  const [doctorr, setDoctor] = useState(0);
  const [experience, setExperience] = useState(0);
  const [appointmentt, setAppointment] = useState(0);
  const handleLinkClick = (link, e) => {
    e.preventDefault(); 
    if (link) {
      window.open(link, '_blank');
    } else {
      notification.info({
        message: 'Mobile App Coming Soon',
        placement: 'topRight',
      });
    }
  };
  const aboutUsRef = useRef(null);
  const isVisible = useRef(false);

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

  const getYoutubeWidth = () => {
    if (window.innerWidth <= 576) return "400";
    if (window.innerWidth <= 820) return "600";
    if (window.innerWidth < 992) return "700";
    if (window.innerWidth < 1200) return "700";
    if(window.innerWidth < 1500) return "700";
    return "753";
  };

  const getYoutubeHeight = () => {
    if (window.innerWidth < 576) return "240";
    if (window.innerWidth < 768) return "318";
    if (window.innerWidth < 992) return "318";
    if (window.innerWidth < 1200) return "418";
    return "418";
  };

  return (
    <>
      <div
        className="container-fluid bg-gradient-lightR pb-5 border border-1"
        ref={aboutUsRef}
      >
       
        <h1 className="fs-32px text-center pt-3 fw-600">About Us</h1>
        <div className="content-container my-4">
  <div className="row">
    <div className="col-md-6 d-flex justify-content-center align-items-center">
      <iframe
        className="video-cont"
        width="100%"
        height={getYoutubeHeight()} // Adjust height dynamically
        src="https://www.youtube.com/embed/YPfk7TN-Ghc?si=AeX0GuFip3dXrE2v"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        style={{ maxHeight: '400px' }} // Set a max height for the iframe
      ></iframe>
    </div>
    <div className="col-md-6 d-flex flex-column justify-content-center mt-3 mt-md-0">
      <p style={{ textAlign: "justify" }}>
        OPDSure is India’s first platform for doctor consultations, offering 24/7 access to top clinics and hospitals across India. Whether you require allopathy, homeopathy, Ayurvedic, or Unani consultations, OPDSure is your trusted healthcare partner. Focused on preventive care, we provide free annual preventive checkups, along with up to 50% reimbursement on prescribed pharmacy and diagnostic bills to ensure affordability.
      </p>
      <div className="d-flex gap-3 mt-4">
        <Link onClick={(e) => handleLinkClick(CONSTANTS.COMPANY_DETAILS.PLAY_STORE, e)}>
          <img src={playstore} alt="playstore" width={120} />
        </Link>
        <Link onClick={(e) => handleLinkClick(CONSTANTS.COMPANY_DETAILS.APP_STORE, e)}>
          <img src={appstore} alt="appstore" width={120} />
        </Link>
      </div>
    </div>
  </div>
</div>



        <div className="row border-0 d-flex justify-content-center margin-90px">
          {/* card 1 margin-90px*/}
          <div className="col-lg-3 col-md-6 col-6 my-2 d-flex justify-content-center">
            <div
              className="card bg-f7f7f7 border-0 text-center cardhover counter-card"
              // style={{ width: "17.25rem", minHeight: "11.87rem" }}
            >
              <div className="card-body">
                <img src={happyclient} alt="happy-client" height={50} />
                <h6 className="card-subtitle my-3 text-body-secondary fs-18px">
                  Specialities
                </h6>
                <h3 className="card-title fw-600 fs-40px ">{happyyclient.toLocaleString("en-IN")}+</h3>
              </div>
              <div className="go-corner"></div>
            </div>
          </div>
          {/* card 2 */}
          <div className="col-lg-3 col-md-6 col-6 my-2 d-flex justify-content-center ">
            <div
              className="card bg-f7f7f7 border-0 text-center cardhover counter-card"
              // style={{ width: "17.25rem", minHeight: "12rem" }}
            >
              <div className="card-body ">
                <img src={celebration} alt="experience" height={50} />
                <h6 className="card-subtitle my-3 text-body-secondary fs-18px">
                  Years of Experience
                </h6>
                <h3 className="card-title fw-600 fs-40px">{experience.toLocaleString("en-IN")}+</h3>
              </div>
            </div>
          </div>

          {/* card 3 */}
          <div className="col-lg-3 col-md-6 col-6 my-2 d-flex justify-content-center ">
            <div
              className="card bg-f7f7f7 border-0 text-center cardhover counter-card"
              // style={{ width: "17.25rem", minHeight: "12rem" }}
            >
              <div className="card-body">
                <img src={doctor} alt="doctor" height={50} />
                <h6 className="card-subtitle my-3 text-body-secondary fs-18px">
                  Specialized Doctors
                </h6>
                <h3 className="card-title fw-600 fs-40px">{doctorr.toLocaleString("en-IN")}+</h3>
              </div>
            </div>
          </div>
          {/* card 4 */}
          <div className="col-lg-3 col-md-6 col-6 my-2 d-flex justify-content-center">
            <div
              className="card bg-f7f7f7 border-0 text-center cardhover counter-card"
              // style={{ width: "17.25rem", minHeight: "12rem" }}
            >
              <div className="card-body">
                <img src={appointment} alt="appointment" height={50} />
                <h6 className="card-subtitle my-3 text-body-secondary fs-18px">
                  Online Appointments
                </h6>
                <h3 className="card-title fw-600 fs-40px">{appointmentt.toLocaleString("en-IN")}+</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
