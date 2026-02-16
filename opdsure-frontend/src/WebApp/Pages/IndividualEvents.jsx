import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import config from "../../config/config";
import { Axios } from "../../axios/axiosFunctions";
import { Utils } from "../../utils";
import arrowrightup from "../Assets/arrow-up-right.png";
import arrowright from "../Assets/arrow-right.png";
import arrow from "../Assets/ArrowLeft.png";
import eventsBanner from "../Assets/individualEventsBanner.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LeftCircleOutlined } from "@ant-design/icons";
import {faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, FacebookIcon, TwitterIcon, LinkedinIcon } from 'react-share';
import copy from 'copy-to-clipboard';
import { NavLink } from "react-router-dom";

const IndividualEvent = () => {
  const { id } = useParams();
  const [eventsData, setEventsData] = useState([]);
  const [allEvents, setAllEvents] = useState(false);

  const [shareUrl, setShareUrl] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  const handleCopyLink = () => {
    copy(shareUrl);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  const fetchEventDataById = async (id) => {
    const response = await Axios.fetchAxiosData(`${config.GetEvent}${id}`);
    setEventsData(response.data.records);
  };

  const fetchAllEventsData = async () => {
    const response = await Axios.fetchAxiosData(config.GetAllEvents);
    setEventsData(response.data.records);
  };

  useEffect(() => {
    setShareUrl(`${window.location.origin}/events/${id}`);
    if (id) {
      fetchEventDataById(id);
    } else {
      setAllEvents(true);
      fetchAllEventsData();
    }
  }, [id]);


  if (!eventsData) {
    return <div>Loading...</div>;
  }
  const numIndicators = eventsData?.url?.length || 0;
  return (
    <>
      <div className="container-fluid bg-gradient-light">
      { id && (
 <>
 <div className="row justify-content-center">
   <div className="col-12 p-0">
     <img
       src={eventsBanner}
       alt="blog banner"
       className="w-100 img-fluid d-block"
       style={{ borderRadius: "0.5rem" }} // Rounded corners for the banner
     />
   </div>
 </div>

 <div className="row p-5">
   <div className="col-12">
     <h2 className="fw-600 text-capitalize">{eventsData.title}</h2>
     <p className="text-muted" style={{ textAlign: "justify" }}>
       {Utils.DateFormatOrdinal(eventsData.date)}
     </p>
     <div
       className="my-4"
       dangerouslySetInnerHTML={{ __html: eventsData.description }}
       style={{ textAlign: "justify" }} // Justified text for description
     ></div>
   </div>
 </div>

 {/* Carousel Section */}
 <div className="row justify-content-center mb-5">
   <div className="col-12 col-md-8 p-0">
     <div id="carouselExampleCaptions" className="carousel slide">
       <div className="carousel-inner">
         {/* Image Slides */}
         {eventsData?.url?.map((file, index) => (
           <div
             className={`carousel-item ${index === 0 ? "active" : ""}`}
             key={index}
           >
             <img
               src={file}
               className="d-block w-100"
               alt={`Slide ${index + 1}`}
               style={{ height: "25rem", objectFit: "cover", padding: "1rem", borderRadius: "0.5rem" }} // Rounded corners
             />
           </div>
         ))}
       </div>
       <button
         className="carousel-control-prev"
         type="button"
         data-bs-target="#carouselExampleCaptions"
         data-bs-slide="prev"
       >
         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
         <span className="visually-hidden">Previous</span>
       </button>
       <button
         className="carousel-control-next"
         type="button"
         data-bs-target="#carouselExampleCaptions"
         data-bs-slide="next"
       >
         <span className="carousel-control-next-icon" aria-hidden="true"></span>
         <span className="visually-hidden">Next</span>
       </button>
     </div>
   </div>
 </div>

 {/* Share Buttons and Copy Link */}
 <div className="row mx-5 pb-2">
   <div className="col-12 col-md-6 p-4">
     <h3 className="fw-600 text-capitalize text-243572">Share this Event</h3>
     <p>If you like this event, please share it with your friends.</p>
     <div className="d-flex justify-content-start gap-4 my-4">
       <FacebookShareButton url={shareUrl} quote={eventsData.title}>
         <FacebookIcon size={32} round />
       </FacebookShareButton>
       <TwitterShareButton url={shareUrl} title={eventsData.title}>
         <TwitterIcon size={32} round />
       </TwitterShareButton>
       <LinkedinShareButton url={shareUrl} title={eventsData.title}>
         <LinkedinIcon size={32} round />
       </LinkedinShareButton>
     </div>
     <p className="fw-600">or copy the link below.</p>
     <div className="input-group">
       <input
         type="text"
         className="form-control"
         value={shareUrl}
         readOnly
         id="shareLink"
         style={{ borderRadius: "0.5rem" }} // Rounded corners for input
       />
       <button
         onClick={handleCopyLink}
         className="btn btn-primary"
         type="button"
         style={{ borderRadius: "0.5rem" }} // Rounded corners for button
       >
         Copy Link
       </button>
     </div>
     {alertVisible && (
       <div className="mt-3">
         <Alert message="Link Copied" type="success" showIcon closable />
       </div>
     )}
   </div>
 </div>

 <div className="m-4 ms-5">
   <NavLink to="/events" style={{ textDecoration: "none" }} className="d-flex align-items-center">
     <LeftCircleOutlined className="fs-3 text-purple me-2" />
     <span>Back to All Events</span>
   </NavLink>
 </div>
</>


)}



      </div>
    </>
  );
};

export default IndividualEvent;
