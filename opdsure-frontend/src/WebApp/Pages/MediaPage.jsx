import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Avatar} from "antd";
import config from "../../config/config";
import { Axios } from "../../axios/axiosFunctions";
import { Utils } from "../../utils";
import arrowrightup from "../Assets/arrow-up-right.png";
import arrowright from "../Assets/arrow-right.png";
import arrow from "../Assets/ArrowLeft.png";
import mediaBanner from "../Assets/media-banner.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
import {FloatButton} from 'antd';
import {ArrowUpOutlined} from "@ant-design/icons";

const MediaPage = () => {
  const { id } = useParams();
  const [mediaData, setMediaData] = useState([]);
  const [allMedia, setAllMedia] = useState(false);
  const navigate = useNavigate();
  const [showFloatButton, setShowFloatButton] = useState(true);
  const handleScrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      notification.error({
        message: 'Scroll Error',
        description: 'An error occurred while scrolling to the top. Please try again later.',
      });
    }
  };

  const fetchMediaDataById = async (id) => {
    const response = await Axios.fetchAxiosData(`${config.GetMedia}/${id}`);
    setMediaData(response.data.records);
  };

  const fetchAllMediaData = async () => {
    const response = await Axios.fetchAxiosData(config.GetAllMedias);
    setMediaData(response.data.records);
  };

  useEffect(() => {
    if (id) {
      fetchMediaDataById(id);
    } else {
      setAllMedia(true);
      fetchAllMediaData();
    }
  }, [id]);

  if (!mediaData) {
    return <div>Loading...</div>;
  }

  const numIndicators = mediaData?.url?.length || 0;
  return (
    <>
      <div className="container-fluid bg-gradient-light">
        {/* {id && (
          <>
            <div className="row">
              <div className="col-12">
                <div id="carouselExampleCaptions" className="carousel slide">
                  <div className="carousel-indicators">
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
                  </div>
                  <div className="carousel-inner">
                  
                    {mediaData?.url?.map((file, index) => (
                      <div
                        className={`carousel-item ${
                          index === 0 ? "active" : ""
                        }`}
                        key={index}
                      >
                        <img
                          src={file}
                          className="d-block w-100"
                          alt={`Slide ${index + 1}`}
                          style={{ height: "20rem", objectFit: "cover" }}
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
                <h2 className="fw-600 text-capitalize">{mediaData.title}</h2>

                <div className="col-12">
               
                  <div
                    className="my-4"
                    dangerouslySetInnerHTML={{ __html: mediaData.desciption }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        )} */}

        {allMedia && (
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
                  src={mediaBanner}
                  alt="media banner"
                  className="w-100 img-fluid d-block"
                />
              </div>
            </div>

            <div className="row p-5">
              <h3 className="fw-600 pt-1">Media & News</h3>
              {/* <p className="fw-400 text-muted mb-5">
              The media and news industry play a critical role in the health tech sector by raising awareness, driving innovation, and ensuring transparency. Through timely reporting on emerging technologies, advancements in telemedicine, AI-powered diagnostics, and wearable health devices, media outlets inform both professionals and the general public about groundbreaking solutions. They also act as a bridge between developers, investors, and healthcare providers, fostering collaborations that propel the industry forward. Additionally, news platforms offer an essential space for sharing expert opinions, ethical concerns, and regulatory updates, ensuring that health tech innovations are both safe and accessible for all.The media and news industry play a critical role in the health tech sector by raising awareness, driving innovation, and ensuring transparency. Through timely reporting on emerging technologies, advancements in telemedicine, AI-powered diagnostics, and wearable health devices, media outlets inform both professionals and the general public about groundbreaking solutions. They also act as a bridge between developers, investors, and healthcare providers, fostering collaborations that propel the industry forward. Additionally, news platforms offer an essential space for sharing expert opinions, ethical concerns, and regulatory updates, ensuring that health tech innovations are both safe and accessible for all.
              </p> */}

           
              {/* <span className="fw-400 text-muted fs-4 mb-5">
              Stay updated with Industry related Article and Insights
            </span> */}
{mediaData?.map((item, index) => (
  <div className="col-lg-4 col-md-6 col-12 mb-3 mt-4" key={index}>
    <Link to={item.media_url} target="_blank" className="text-decoration-none">
      <div
        className="card border-0 h-100"
        style={{ maxHeight: "30rem", backgroundColor: "#c4def7" }}
      >
       <div className="card-header border-0 bg-transparent d-flex align-items-center mt-2">
  <img 
    src={item?.mediaIconUrl} 
    alt="media icon" 
    style={{ 
      width: "50px", 
      height: "50px", 
      borderRadius: "50%" // This makes the image round
    }} 
  />
  <h6 
    className="fw-600 text-capitalize text-black fs-22 flex-grow-1 mb-0 ms-2" 
    // style={{ textAlign: "justify" }}
  >
    {item.title}
  </h6>
</div>
        <div className="card-body">
          <img
            src={item?.fileUrls[0]}
            alt="img"
            className="rounded-4 img-fluid mb-2"
            style={{ height: "16rem", width: "100%", objectFit: "fill" }}
          />
          {/* <p className="card-text text-muted my-1 text-end">
            by <span className="text-black text-capitalize">{item.author}</span>
          </p> */}
          <p className="card-text text-muted my-1 text-end">
            {Utils.DateFormatOrdinal(item.createdAt)}
          </p>
          <div className="card-footer h-25 border-0 bg-transparent">
            <div
              className="text-truncated text-muted"
              dangerouslySetInnerHTML={{ __html: item?.desciption }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  </div>
))}


            </div>
          </>
        )}
      </div>
       {/* Scroll to Top Button */}
       {/* {showFloatButton && (
        <FloatButton
          icon={<ArrowUpOutlined />}
          tooltip="Scroll to top"
          style={{ right: 10, bottom: 10, backgroundColor: "#5dadec" }}
          onClick={handleScrollToTop}
        />
      )} */}
    </>
  );
};

export default MediaPage;
