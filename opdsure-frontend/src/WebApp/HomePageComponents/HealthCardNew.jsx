import React from "react";
import { Link } from "react-router-dom";
import healthcard from "../Assets/health-card.svg";
import { Button } from "antd";
import visitany from "../Assets/visitany.png";
import anywhere from "../Assets/anywhere.png";
import anytime from "../Assets/anytime.png";

const HealthCardNew = () => {
  const gethealthcardwidth = () => {
    if (window.innerWidth < 576) return 350;
    if (window.innerWidth < 768) return 350;
    if (window.innerWidth < 992) return 350;
    if (window.innerWidth < 1200) return 420;
    return 420;
  };
  return (
    <>
      <div className="container-fluid bg-gradient-lightR border border-1 position-relative">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center mt-3 fw-600 fs-32px">
              OPDSure Health Card
            </h1>
            <p className="text-center mb-4 fs-18px">Pay your OPD Expenses.</p>
          </div>
        </div>
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-lg-6 col-md-6 col-12 text-center px-0">
            <img
              src={healthcard}
              alt="healthcard image"
              className="img-fluid"
              width={gethealthcardwidth()}
            />
          </div>

          <div className="col-lg-5 col-md-5 col-12">
              <h5 className='my-4 fw-600 fs-24px'>Pay Your Doctor Consultation Fee Online or In-Clinic.</h5>
              <ul className='fs-18px list-unstyled'>
                <li><img src={visitany} alt="visit any icon" className='me-3 my-1'/>Access to any Clinic & Hospital</li>
                <li><img src={anywhere} alt="globe icon" className='me-3 my-1' />Anywhere in India</li>
                <li><img src={anytime} alt="clock icon" className='me-3 my-1' />Anytime & 24/7</li>
              </ul>
              <Link to="/user/register"> <Button className="bg-243673 fs-18px col-lg-3 col-md-6 col-5 mt-3 mb-3 health-card-button" type="primary" style={{width:"10rem"}} >
                Subscribe Now
               </Button> </Link>
            </div>
          {/* <div
            className="col-lg-5 col-md-5 col-12 position-relative"
            style={{ height: "auto" }}
          >
            <img
              src={healthcard}
              alt="background doctor"
              className="position-absolute"
              style={{
                filter: "brightness(1.2)",
                bottom: 50,
                left: 200,
                objectFit: "cover",
                zIndex: 1,
                height: "100%",
              }}
            />

            <div
              className="position-relative"
              style={{ zIndex: 2, padding: "20px" }}
            >
              <h5 className="my-4 fw-600 fs-24px">
                Pay Your Doctor Consultation Fee Online or In-Clinic.
              </h5>
              <ul className="fs-18px list-unstyled">
                <li>
                  <img
                    src={visitany}
                    alt="visit any icon"
                    className="me-3 my-1"
                  />
                  Access to any Clinic & Hospital
                </li>
                <li>
                  <img src={anywhere} alt="globe icon" className="me-3 my-1" />
                  Anywhere in India
                </li>
                <li>
                  <img src={anytime} alt="clock icon" className="me-3 my-1" />
                  Anytime & 24/7
                </li>
              </ul>
              <Link to="/user/register">
                <Button
                  className="bg-243673 fs-18px col-lg-3 col-md-6 col-5 mt-5 health-card-button"
                  type="primary"
                >
                  Subscribe Now
                </Button>
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default HealthCardNew;
