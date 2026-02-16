import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import config from "../../config/config";
import { Axios } from "../../axios/axiosFunctions";
import { Utils } from "../../utils";
import arrowrightup from "../Assets/arrow-up-right.png";
import arrowright from "../Assets/arrow-right.png";
import arrow from "../Assets/ArrowLeft.png";
import eventsBanner from "../Assets/events-banner.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LeftCircleOutlined } from "@ant-design/icons";
import {faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, FacebookIcon, TwitterIcon, LinkedinIcon } from 'react-share';
import copy from 'copy-to-clipboard';
import { NavLink } from "react-router-dom";

const EventsPage = () => {
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
        {id && (
          <>
            <div className="row">
              <div className="col-12 p-0">
                <div id="carouselExampleCaptions" className="carousel slide">
                  {/* <div className="carousel-indicators">
                    <button
                      type="button"
                      data-bs-target="#carouselExampleCaptions"
                      data-bs-slide-to="0"
                      className="active"
                      aria-current="true"
                      aria-label="Slide 1"
                    ></button>
                    {Array.from({ length: numIndicators }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide-to={index + 1}
                        aria-label={`Slide ${index + 2}`}
                      ></button>
                    ))}
                  </div> */}
                  <div className="carousel-inner">
                    {/* Image Slides */}
                    {eventsData?.url?.map((file, index) => (
                      <div
                        className={`carousel-item ${
                          index === 0 ? "active" : ""
                        }`}
                        key={index}
                      >
                        <img
                          src={file}
                          className="d-block w-100 "
                          alt={`Slide ${index + 1}`}
                          style={{ height: "25rem", objectFit: "cover", padding:"1rem" }}
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
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="row p-5">
              <div className="col-12">
                <h2 className="fw-600 text-capitalize">{eventsData.title}</h2>

                
                  {/* <img
                  className="w-25 h-50 img-fluid rounded float-end imgshadow"
                  src={mediaData?.files[0]}
                  alt="images"
                /> */}
                  <div
                    className="my-4"
                    dangerouslySetInnerHTML={{ __html: eventsData.description }}
                  ></div>
               
              </div>
            </div>
             {/* Share Buttons and Copy Link */}
             <div className="row mx-5 pb-2">
                    <div className="col-12 col-md-6 p-4">
                      <h3 className="fw-600 text-capitalize text-243572">Share this Event.</h3>
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
                        />
                        <button
                          onClick={handleCopyLink}
                          className="btn btn-primary"
                          type="button"
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
                  {/* <div className="m-4 ms-5">
                  <NavLink to="/events" style={{ textDecoration: "none" }} className="d-flex align-items-center">
  <LeftCircleOutlined className="fs-3 text-purple me-2" /> 
  <span>back to all Events</span>
</NavLink>
</div> */}
          </>
        )}

        {allEvents && (
          <>
            <div className="row">
              <div className="col-12 p-0">
                <Link to="/homepage">
                  <img
                    src={arrow}
                    alt="arrow for back to homepage"
                    className="img-fluid z-5 position-absolute start-0 mt-2 ms-lg-5 ms-3 arrowSize bg-5dadec rounded-circle"
                  />
                </Link>
                <img
                  src={eventsBanner}
                  alt="blog banner"
                  className="w-100 img-fluid d-block"
                />
              </div>
            </div>

            <div className="row p-5">
              <h3 className="fw-600 pt-1 mb-5">Latest Events</h3>
              {/* <p className="fw-400 text-muted mb-5">
                Event content is essential for generating excitement, informing
                attendees, and driving participation. It provides crucial
                information about event details, schedules, and key speakers,
                ensuring that potential attendees are well-informed and
                motivated to attend. Well-crafted event content also helps in
                creating anticipation and building momentum leading up to the
                event, enhancing overall engagement and attendance.
              </p> */}

            
              {eventsData?.map((item, index) => (
                 <div className="col-lg-4 col-md-6 col-12 mb-3" key={index}>
                  <Link to={`/events/${item?._id}`} target="_blank" className="text-decoration-none">
                 
                 <div
                   className="card bg-c4def7 border-0 h-100"
                   style={{ maxHeight: "30rem" }}
                 >
                   <div className="card-header border-0 bg-transparent text-start">
                   <Link to={`/events/${item?._id}`} target="_blank" className="text-decoration-none">
                     {/* <h5 className="fw-600 text-capitalize text-black fs-22 col-4 rounded-2 text-start mt-1">
                         {item.title} &nbsp;<FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs"/>
                       </h5> */}
                       <h5 
    className="fw-600 text-capitalize text-black fs-22 flex-grow-1 mb-0 ms-2 mt-2" 
    style={{ textAlign: "justify" }}
  >
    {item.title}
  </h5>
                     </Link>
                   </div>
                   <div className="card-body">
                     <div className="d-flex justify-content-between">
                      
                     </div>
                    
                     <img
                       src={item?.fileUrls[0]}
                       alt="img"
                       className="rounded-4 img-fluid"
                       style={{ height: "16rem", width: "100%",objectFit: "cover" }}
                     />
                     
                       
                      
                       <p className="card-text text-muted my-2 text-end">
                         {Utils.DateFormatOrdinal(item.date)}
                       </p>
                     
                 
                     {/* <div className="card-footer h-25 border-0 bg-transparent">
                       <div
                         className="text-truncated text-muted"
                         dangerouslySetInnerHTML={{ __html: item?.description }}
                       ></div>
                     </div> */}
                   </div>
                 </div>
                 </Link>
               </div>
              ))}

              {/* <p className="fw-400 text-muted mt-2 mb-5">
                Additionally, event content plays a critical role in post-event
                activities, such as recapping highlights, sharing key takeaways,
                and maintaining connections with attendees. It can extend the
                event’s impact by generating ongoing discussions and providing
                valuable insights, which can be leveraged for future events or
                marketing efforts. Effective event content maximizes the event's
                reach and effectiveness, contributing to a successful and
                memorable experience for all involved.{" "}
              </p> */}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EventsPage;
