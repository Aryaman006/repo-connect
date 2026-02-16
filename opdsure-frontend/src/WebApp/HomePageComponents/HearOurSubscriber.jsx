import React, { useState, useEffect } from "react";
import config from "../../config/config";
import { Axios } from "../../axios/axiosFunctions";
import wave from "../Assets/waveDown.png";
import line1 from "../Assets/dashline1.png";
import line2 from "../Assets/dashline2.png";
import line3 from "../Assets/dashline3.png";
import leftArrowIcon from "../Assets/CircleArrow.png";
import rightArrowIcon from "../Assets/CircleArrowR.png";
import {faCircleChevronRight,faCircleChevronLeft} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import aprostrophe from "../Assets/aprostrophe.png";
import profileavatar from "../Assets/profile-avatar.jpg";
import { Rate } from "antd";

const HearOurSubscriber = () => {
  const [isIndividualSubs, setIsIndividualSubs] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [corpsubscriberData, setCorpSubscriberData] = useState([]);
  const [indisubscriberData, setIndiSubscriberData] = useState([]);
  const [chunkSize, setChunkSize] = useState(3);

  const fetchAllReviews = async () => {
    const response = await Axios.fetchAxiosData(config.GetAllGoogleReviews,{params: { pageSize: 1000 }});
    const corporateData = response?.data?.records.filter(data => data.corporate_review === true);
    const individualData = response?.data?.records.filter(data => data.corporate_review === false);
    setCorpSubscriberData(corporateData);
    setIndiSubscriberData(individualData);
  };

  const avatarsIndividual = indisubscriberData?.map(record => ({
    name: record.name,
    avatar_url: record.avatar_url,
    review_url: record.review_url,
  }));

  const avatarsCorporate = corpsubscriberData?.map(record => ({
    name: record.name,
    avatar_url: record.avatar_url,
    review_url: record.review_url,
  }));

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const handleSubscriberChange = (event) => {
    setIsIndividualSubs(event.target.checked);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? corpsubscriberData.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === corpsubscriberData.length - 1 ? 0 : prevIndex + 1));
  };


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChunkSize(1); 
      }
      else if (window.innerWidth < 992) {
        setChunkSize(2); 
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

  const chunkedCorpSubscriberData = chunkArray(corpsubscriberData, chunkSize);
  const chunkedIndiSubscriberData = chunkArray(indisubscriberData, chunkSize);

  function truncateText(text, maxLength) {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  }

  const getPlaceholderAvatar = (name) => {
    const firstLetter = (name || 'A').charAt().toUpperCase();
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#deefff",
          color: "#243673",
          fontSize: "2rem",
          textAlign: "center",
        }}
      >
        {firstLetter}
      </div>
    );
  };

  const getCardStyle = (index) => {
    switch (index) {
      case 0:
        return { minWidth: "30rem", height: "16.302rem" };
      case 1:
        return {
          minWidth: "34.313rem",
          height: "18.645rem",
          zIndex: "3",
          transform: "scale(1.1)",
          transition: "transform 0.3s ease-in-out",
        };
      default:
        return { minWidth: "30rem", height: "16.302rem" };
    }
  };

  return (
    <>
      <style>
        {`
          .carousel-control-next, .carousel-control-prev {
            width: 20%;
            opacity: 1;

          }
        `}
      </style>

      <div className="container-fluid position-relative px-0">
        <img
          src={wave}
          alt="wave image background"
          className="img-fluid zn-1 position-absolute bottom-0 p-0"
          width={"100%"}
        />
        <div className="row px-0 mx-0 subscriber-row-height">
          <div className="col-12 text-center px-0 position-relative">
            <h1 className="fw-700 pt-3 fs-32px mt-1">
              Empowering Health: Hear From Our Subscriber
            </h1>

            <div className="btn-container d-flex justify-content-center mt-3">
              <label className="switch btn-color-mode-switch">
                <input
                  type="checkbox"
                  id="color_mode3"
                  name="color_mode3"
                  checked={isIndividualSubs}
                  onChange={handleSubscriberChange}
                />
                <label
                  className="btn-color-mode-switch-inner"
                  data-off="Corporate"
                  data-on="Individual"
                  htmlFor="color_mode3"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="row line-margin">
          <div className="col-12 ">
            <img
              src={line2}
              alt="line dashed"
              className="img-fluid position-absolute p-0 subscriber-line1"
              width={"100%"}
            />
            <img
              src={line1}
              alt="line dashed"
              className="img-fluid position-absolute p-0 mt-5 subscriber-line2"
              width={"100%"}            
            />
            <img
              src={line3}
              alt="line dashed"
              className="img-fluid position-absolute p-0 subscriber-line3"
              width={"100%"}            
            />
          </div>
        </div>
        {
          isIndividualSubs ? (
            <>
            <img onClick={() => window.open(avatarsIndividual[0]?.review_url, "_blank")} src={avatarsIndividual[0]?.avatar_url || profileavatar} alt="profile image" className="position-absolute subscriber-img img-siz1" />
            <img onClick={() => window.open(avatarsIndividual[4]?.review_url, "_blank")} src={avatarsIndividual[4]?.avatar_url || profileavatar} alt="profile image" className="position-absolute subscriber-img img-siz2" />
            <img onClick={() => window.open(avatarsIndividual[5]?.review_url, "_blank")} src={avatarsIndividual[5]?.avatar_url || profileavatar} alt="profile image" className="position-absolute subscriber-img img-siz3" />
    
            <img onClick={() => window.open(avatarsIndividual[1]?.review_url, "_blank")} src={avatarsIndividual[1]?.avatar_url || profileavatar} alt="profile image" className="position-absolute subscriber-img img-siz4" />
            <img onClick={() => window.open(avatarsIndividual[2]?.review_url, "_blank")} src={avatarsIndividual[2]?.avatar_url || profileavatar} alt="profile image" className="position-absolute subscriber-img img-siz5" />
            {/* <img onClick={() => window.open(avatarsIndividual[3]?.review_url, "_blank")} src={avatarsIndividual[3]?.avatar_url || profileavatar} alt="profile image" className="position-absolute subscriber-img" style={{left: '65vw', top: '33vh'}}/> */}
            </> )
            :
            (
            <>
            <img onClick={() => window.open(avatarsCorporate[0]?.review_url, "_blank")} src={avatarsCorporate[0]?.avatar_url || profileavatar} alt="profile image" className="position-absolute subscriber-img border img-siz6" />
            <img onClick={() => window.open(avatarsCorporate[4]?.review_url, "_blank")} src={avatarsCorporate[4]?.avatar_url || profileavatar} alt="profile image" className="position-absolute subscriber-img border img-siz7" />
            <img onClick={() => window.open(avatarsCorporate[5]?.review_url, "_blank")} src={avatarsCorporate[5]?.avatar_url || profileavatar} alt="profile image" className="position-absolute subscriber-img border img-siz8" />
 
            <img onClick={() => window.open(avatarsCorporate[1]?.review_url, "_blank")} src={avatarsCorporate[1]?.avatar_url || profileavatar} alt="profile image" className="position-absolute subscriber-img border img-siz9" />
            <img onClick={() => window.open(avatarsCorporate[2]?.review_url, "_blank")} src={avatarsCorporate[2]?.avatar_url || profileavatar} alt="profile image" className="position-absolute subscriber-img border img-siz10" />
            <img onClick={() => window.open(avatarsCorporate[3]?.review_url, "_blank")} src={avatarsCorporate[3]?.avatar_url || profileavatar} alt="profile image" className="position-absolute subscriber-img border img-siz11" />
            </>
            )
        }
      
        <div className="row pb-3 mx-0 ">
          <div className="col-12 text-center px-0">
            <div id="subscriberCarousel" className="carousel slide my-mine">
              <div className="carousel-inner ">
                {(isIndividualSubs ? chunkedIndiSubscriberData : chunkedCorpSubscriberData)?.map((subscriber, index) => (
                  <div
                    key={index}
                    className={`carousel-item ${index === activeIndex ? "active" : ""}`}
                  >
                    <div className="row d-flex justify-content-center margin-mine">
                      {subscriber?.map((item, i) => (
                        <div className="col-lg-4 col-md-6 col-12" key={i}>
                          <div className="card text-start bg-4a68b1 rounded-0 p-3"
                           style={{ minHeight: "12.302rem" }}
                          
                          >
                            <div className="card-body text-white d-flex">
                              <div className="col-8">
                                <Rate allowHalf disabled defaultValue={item.rating} className="text-white me-3" />
                                <img 
    src={aprostrophe} 
    alt="icon" 
    className="img-fluid m-0 p-0" 
    style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
  />
                                <p className="fs-12px fw-600">{truncateText(item.feedback, 140)}</p>
                                <p className="fs-16px fw-600" style={{lineHeight:0.2}}>{item.name}</p>
                                <p className="fs-16px fw-600" style={{lineHeight:0.2}}>{item.corporate_name}</p>
                              </div>
                              <div className="col-4">
                                {item.avatar_url ? (
                                  <img src={item.avatar_url} alt="avatar" className={`img-fluid ${isIndividualSubs ?"py-5 px-auto ":"py-5 px-auto "}`} style={{ width: "100%", height: "100%", objectFit: "cover",borderRadius: "50%", }} />
                                ) : (
                                  getPlaceholderAvatar(item.name)
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#subscriberCarousel"
                data-bs-slide="prev"
                onClick={handlePrev}
                // disabled={activeIndex === 0}
                // style={{
                //   position: 'absolute',
                //   top: '50%',
                //   left: '-25px', // Adjust this value as needed
                //   transform: 'translateY(-50%)',
                // }}
              >
                <span aria-hidden="true">
                <FontAwesomeIcon
                    icon={faCircleChevronLeft}
                    size="xl"
                    className="text-white"
                    style={{filter: "drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.8))"}}
                  />
                </span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#subscriberCarousel"
                data-bs-slide="next"
                onClick={handleNext}
                // disabled={activeIndex === (isIndividualSubs ? chunkedIndiSubscriberData : chunkedCorpSubscriberData).length - 1}
                // style={{
                //   position: 'absolute',
                //   top: '50%',
                //   right: '-25px', // Adjust this value as needed
                //   transform: 'translateY(-50%)',
                // }}
             >
                <span aria-hidden="true">
                <FontAwesomeIcon
                    icon={faCircleChevronRight}
                    size="xl"
                    className="text-white"
                    style={{filter: "drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.8))"}}
                  />
                </span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HearOurSubscriber;
