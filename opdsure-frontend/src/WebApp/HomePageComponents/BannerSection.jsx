import React, { useState, useEffect } from "react";
import { Input,Button, notification } from "antd";
import appstore from "../Assets/App Store.png";
import playstore from "../Assets/Play Store.png";
import CONSTANTS from "../../constant/Constants";

import opdBannerPlanBenefits from "../Assets/opd_banner_plan_benefits.png";
import banner1 from "../Assets/banner1.png";
import banner2 from "../Assets/banner2.png";
import banner3 from "../Assets/banner3.png";
import banner4 from "../Assets/banner4.png";
import banner5 from "../Assets/banner5.png";
import banner6 from "../Assets/banner6.png";
import banner7 from "../Assets/banner7.png";
import banner8 from "../Assets/banner8.png";
import { Link, useNavigate } from "react-router-dom";

import servicesCircularImg1 from "../Assets/servicesCircularImg (1).svg";
import servicesCircularImg2 from "../Assets/servicesCircularImg (2).svg";
import servicesCircularImg3 from "../Assets/servicesCircularImg (3).svg";
import servicesCircularImg4 from "../Assets/servicesCircularImg (4).svg";
import servicesCircularImg5 from "../Assets/servicesCircularImg (5).svg";
import servicesCircularImg6 from "../Assets/servicesCircularImg (6).svg";
import servicesCircularImg7 from "../Assets/servicesCircularImg (7).svg";
import servicesCircularImg8 from "../Assets/servicesCircularImg (8).svg";
import servicesCircularImg9 from "../Assets/servicesCircularImg (9).svg";
import servicesCircularImg10 from "../Assets/servicesCircularImg (10).svg";
import servicesCircularImg11 from "../Assets/servicesCircularImg (11).svg";
import servicesCircularImg12 from "../Assets/servicesCircularImg (12).svg";
import servicesCircularImg14 from "../Assets/servicesCircularImg (14).svg";

import {
  faCircleChevronRight,
  faCircleChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BannerSection = () => {
  const navigate = useNavigate();
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

  const imagesCircular = [
    {image:servicesCircularImg2,ref:"/services#in-clinic-consultation"},
    {image:servicesCircularImg1,ref:"/user/register"},
    {image:servicesCircularImg4,ref:"/services#diagnostics"},
    {image:servicesCircularImg11,ref:"/services#pharmacy"},
    {image:servicesCircularImg5,ref:"/services#health-card"},
    {image:servicesCircularImg12,ref:"/services#health-checkup"},
    {image:servicesCircularImg9,ref:"/services#ambulance"},
    {image:servicesCircularImg7,ref:"/services#gym-fitness"},
    {image:servicesCircularImg6,ref:"/services#mental-wellness"},
    {image:servicesCircularImg3,ref:"/services#special-education"},
    {image:servicesCircularImg10,ref:"/services#vaccination"},
    {image:servicesCircularImg8,ref:"/services#yoga"}
  ];
  const [chunkSize, setChunkSize] = useState(6);
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChunkSize(3);
      } else if (window.innerWidth < 992) {
        setChunkSize(4);
      } else {
        setChunkSize(6);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const chunkedCircularImgData = chunkArray(imagesCircular, chunkSize);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? chunkedCircularImgData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === chunkedCircularImgData.length - 1 ? 0 : prevIndex + 1
    );
  };

  // const chunkedBannerImgData = [
  //   {
  //     title: "India's First Exclusive Doctor Consultation Plan",
  //     subtitle: "",
  //     list: [
  //       {
  //         list_content: "Employee Health & Wellness Program",
  //         list_icon: listicon4,
  //       },
  //       {
  //         list_content: "Individual and Family Plans",
  //         list_icon: listicon3,
  //       },
  //       {
  //         list_content: "Easy, Paperless, and Quick Process",
  //         list_icon: listicon,
  //       },
  //     ],
  //     Largeimg: DocConImg,
  //     learnmore_url:"",
  //     getstarted_url:"",
  //   },
  //   {
  //     title: "Specialist Doctors Coverages",
  //     subtitle: "",
  //     list: [
  //       {
  //         list_content: "Allopathy",
  //         list_icon: listicon1,
  //       },
  //       {
  //         list_content: "Homeopathy",
  //         list_icon: listicon7,
  //       },
  //       {
  //         list_content: "Ayurvedic",
  //         list_icon: listicon8,
  //       },
  //     ],
  //     Largeimg: specBanImg,
  //     learnmore_url:"",
  //     getstarted_url:"",
  //   },
  //   {
  //     title: "Easy Quick and Paperless Process",
  //     subtitle: "",
  //     list: [
  //       {
  //         list_content: "Simple Steps",
  //         list_icon: listicon6,
  //       },
  //       {
  //         list_content: "Fast Result",
  //         list_icon: listicon5,
  //       },
  //     ],
  //     Largeimg: quickClaimBanImg,
  //     learnmore_url:"",
  //     getstarted_url:"",
  //   },
  //   {
  //     title: "Individual and Family Doctor Consultation Plans",
  //     subtitle: "Individual & Family OPD Coverage you need",
  //     list: [
        
  //     ],
  //     Largeimg: IndiBanImg,
  //     learnmore_url:"",
  //     getstarted_url:"",
  //   },
  //   {
  //     title: "Corporate Employee Health and Wellness Program",
  //     subtitle: "Invest in your people ,Invest in their Well Being",
  //     list: [
       
  //     ],
  //     Largeimg: corpBanImg,
  //     learnmore_url:"/subscription-plans-corporate",
  //     getstarted_url:"#empWellCorporateForm",
  //   },
  //   {
  //     title: "Visit any doctor in clinic or hospital across India",
  //     subtitle: "",
  //     list: [
        
  //     ],
  //     Largeimg: visitdocBanImg,
  //     learnmore_url:"",
  //     getstarted_url:"",
  //   },
  // ];


  const getDownloadButtonWidth = () => {
    if (window.innerWidth < 576) {
      return 70;
    }
    else if (window.innerWidth < 768) {
      return 95;
    } else if (window.innerWidth < 992) {
      return 85;
    } else {
      return 120;
    }
  };

  return (
    <>
      <style>
        {`
          .next, .prev {
            width: 7% !important;
            opacity: 1;
          }
        `}
      </style>
      <div className="container-fluid">
        <div className="row bg-A9C1FD border border-1">
          <div className="col-12 p-0">
            <div id="carouselExample1" className="carousel slide">
            <div className="carousel-inner">
  {/* Carousel item 1 */}
  <div className="carousel-item active">
    <div className="container-fluid position-relative">
      <div className="row">
        <img 
          src={banner1} 
          alt="banners" 
          className="img-fluid p-0" 
           
        />
        <div className="position-absolute button-overlay">
          <button className="mybtn" onClick={()=>navigate("/contact-us")}>
            Book a Demo
          </button>
        </div>
      </div>
    </div>
  </div>

  <div className="carousel-item">
    <div className="container-fluid position-relative">
      <div className="row">
        <img 
          src={banner6} 
          alt="banners" 
          className="img-fluid p-0" 
        />
        <div className="position-absolute button-overlay5">
          <button className="mybtn" onClick={()=>navigate("/subscription-plans-corporate")}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Carousel item 2 */}
  <div className="carousel-item">
    <div className="container-fluid position-relative">
      <div className="row">
        <img 
          src={banner2} 
          alt="banners" 
          className="img-fluid p-0" 
          // onClick={() => navigate(image2?.link)} 
        />
        <div className="position-absolute button-overlay1">
          <button className="mybtn" onClick={()=>navigate("/subscription-plans")}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Carousel item 3 */}
  <div className="carousel-item">
    <div className="container-fluid position-relative">
      <div className="row">
        <img 
          src={banner3} 
          alt="banners" 
          className="img-fluid p-0" 
        />
        <div className="position-absolute button-overlay2">
          <button className="mybtn" onClick={()=>navigate("/subscription-plans")}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Add more carousel items as needed for the remaining images (up to 8) */}
  
  <div className="carousel-item">
    <div className="container-fluid position-relative">
      <div className="row">
        <img 
          src={banner4} 
          alt="banners" 
          className="img-fluid p-0" 
        />
        <div className="position-absolute button-overlay3">
          <button className="mybtn" onClick={()=>navigate("/subscription-plans")}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  </div>


  <div className="carousel-item">
    <div className="container-fluid position-relative">
      <div className="row">
        <img 
          src={banner5} 
          alt="banners" 
          className="img-fluid p-0" 
        />
        <div className="position-absolute button-overlay4">
          <button className="mybtn" onClick={()=>navigate("/subscription-plans")}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  </div>

  <div className="carousel-item">
    <div className="container-fluid position-relative">
      <div className="row">
        <img 
          src={banner7} 
          alt="banners" 
          className="img-fluid p-0" 
        />
        <div className="position-absolute button-overlay7">
          <button className="mybtn" onClick={()=>navigate("/subscription-plans")}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  </div>

  <div className="carousel-item">
    <div className="container-fluid position-relative">
      <div className="row">
        <img 
          src={banner8} 
          alt="banners" 
          className="img-fluid p-0" 
        />
        <div className="position-absolute button-overlay6">
          <button className="mybtn" onClick={()=>navigate("/subscription-plans")}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Add items for image5, image6, image7, and image8 */}
</div>

              <button
                className="carousel-control-prev prev"
                type="button"
                data-bs-target="#carouselExample1"
                data-bs-slide="prev"
              >
                <span aria-hidden="true">
                  <FontAwesomeIcon
                    icon={faCircleChevronLeft}
                    size="2xl"
                    className="text-243572"
                  />
                </span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next next"
                type="button"
                data-bs-target="#carouselExample1"
                data-bs-slide="next"
              >
                <span aria-hidden="true">
                  <FontAwesomeIcon
                    icon={faCircleChevronRight}
                    size="2xl"
                    className="text-243572"
                  />
                </span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
                      <div className="row py-4 bg-deefff m-0 d-flex justify-content-center align-items-center">
  <div className="col-lg-2 col-md-3 col-6 text-center d-flex flex-column align-items-center">
    <p className="fw-700 fs-20 mb-2">Download App</p>
  </div>
  <div className="col-lg-1 me-lg-4 me-md-2 me-4 col-2 d-flex justify-content-center align-items-center">
    <Link onClick={(e) => handleLinkClick(CONSTANTS.COMPANY_DETAILS.PLAY_STORE, e)}>
      <img src={playstore} alt="playstore" width={getDownloadButtonWidth()} />
    </Link>
  </div>
  <div className="col-lg-1 col-2 d-flex justify-content-center align-items-center">
    <Link onClick={(e) => handleLinkClick(CONSTANTS.COMPANY_DETAILS.APP_STORE, e)}>
      <img src={appstore} alt="appstore" width={getDownloadButtonWidth()} />
    </Link>
  </div>
</div>

        </div>

        <div className="row d-flex justify-content-center align-items-center bg-gradient-light py-3">
          <p className="text-center margin-y fw-600 fs-32px">Our Services</p>
          {chunkedCircularImgData?.map((image, index) => (
            <div className="container" key={index}>
              <div className="row d-flex justify-content-center">
                {image?.map((img, imgIndex) => (
                  <img 
                    key={imgIndex}
                    src={img.image}
                    className="col-lg-2 my-3 col-md-3 col-4"
                    alt={`carousel-item-${imgIndex}`}
                    onClick={() => navigate(img.ref)}
                    style={{ cursor: 'pointer' }} 
                  />
                ))}
              </div>
            </div>
          ))}
        
        </div>
      </div>
    </>
  );
};

export default BannerSection;
