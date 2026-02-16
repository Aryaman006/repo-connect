import React, { useState,useEffect } from "react";
import instagram from "../Assets/instagram.png";
import linkedin from "../Assets/linkedin.png";
import {faCircleChevronRight,faCircleChevronLeft, faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Axios} from "../../axios/axiosFunctions";
import config from "../../config/config";
import {Tooltip} from "antd";
import {Link} from "react-router-dom";
import CONSTANTS from "../../constant/Constants";

const FollowUs = () => {
  
  const [allLinkedinPost, setAllLinkedinPost] = useState([]);
  const fetchAllLinkedinPosts = async () => {
    const response = await Axios.fetchAxiosData(config.GetAllLinkedinPosts);
    setAllLinkedinPost(response?.data?.records);
  };
  useEffect(() => {
    fetchAllLinkedinPosts();
  }, []);

  const height = 284;


 
  const tooltipTextLinkedIn = (
    <Link to={CONSTANTS.COMPANY_DETAILS.LINKEDIN} target="_blank">
      Visit Site <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
    </Link>
  )
  const tooltipTextInstagram = (
    <Link to={CONSTANTS.COMPANY_DETAILS.INSTAGRAM} target="_blank">
      Visit Site <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
    </Link>
  )

  return (
    <>
      <div className="container-fluid border border-1 position-relative">
        <div className="row text-center">
          <div className="col-12 mb-3">
          
            <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap align-items-center">
              <h1 className="col-lg-3 col-12 text-lg-end fw-600 fs-32px">
                Follow Us On{" "}
              </h1>
              <Link to={CONSTANTS.COMPANY_DETAILS.INSTAGRAM} target="_blank">
              <img src={instagram} alt="instagram" className="img-fluid" />
              </Link>
              
              <p className="text-muted fs-2" style={{marginBottom:"10px"}}>|</p>

              <Link to={CONSTANTS.COMPANY_DETAILS.LINKEDIN} target="_blank">
              <img src={linkedin} alt="linkedin" className="img-fluid" style={{marginBottom:"3px"}}/>
              </Link>
            </div>
            <p className="text-muted fs-18px">
              Connect with Us on Instagram and LinkedIn
            </p>
          </div>
        </div>
        <div className="row mx-auto d-flex gap-3 justify-content-center mb-5">
          <div className="col-lg-5 col-md-5 col-12">
            <div className="card border-dark bg-f0f8ff h-100">
              <div className="card-body">
                <h5 className="card-title text-center">
                {/* <Tooltip placement="rightTop" title={tooltipTextInstagram}> */}
                 <Link to={CONSTANTS.COMPANY_DETAILS.INSTAGRAM} target="_blank">
                  <img src={instagram} alt="instagram" className="img-fluid icon-enlarge" />
                  </Link>
                  {/* </Tooltip> */}
                </h5>
                <iframe
                  width="100%"
                  height="350"
                  src="https://www.instagram.com/opdsure/embed"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="col-lg-5 col-md-5 col-12">
      <div className="card border-dark bg-f0f8ff h-100">
        <div className="card-body">
          <h5 className="card-title text-center">
          {/* <Tooltip placement="rightTop" title={tooltipTextLinkedIn}> */}
          <Link to={CONSTANTS.COMPANY_DETAILS.LINKEDIN} target="_blank">
            <img src={linkedin} alt="linkedin" className="img-fluid icon-enlarge" />
            </Link>
            {/* </Tooltip> */}
          </h5>
          <div id="carouselExampleControls" className="carousel slide">
            <div className="carousel-inner">
              {allLinkedinPost?.map((iframe, index) => (
                <div className={`carousel-item${index === 0 ? ' active' : ''}`} key={index}>
                  <iframe
                    src={iframe?.iframe}
                    height={height}
                    width="100%"
                    allowFullScreen
                    title={iframe?.title}
                  />
                </div>
              ))}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
             <span aria-hidden="true"><FontAwesomeIcon icon={faCircleChevronLeft} size="xl" className="text-243572" /></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
               <span aria-hidden="true"><FontAwesomeIcon icon={faCircleChevronRight} size="xl" className="text-243572" /></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
        </div>
      </div>
    </>
  );
};

export default FollowUs;
