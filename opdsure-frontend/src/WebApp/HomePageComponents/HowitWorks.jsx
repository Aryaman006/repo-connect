import React, { useState } from "react";
import plusgif from "../Assets/plusgif.gif";
import claimgif from "../Assets/claimgif.gif";
import video1 from "../Assets/video1.mp4";
import video2 from "../Assets/video2.mp4";

const HowitWorks = () => {
  const [selectedContent, setSelectedContent] = useState({
    video: video1, 
    text: "Easily browse plans, choose the best fit for individual or family, review your selection, proceed with payment, enter personal information, and save details to complete.",
    activeCard: 1
  });

  const handleCardClick = (videoSrc, text, cardNumber) => {
    setSelectedContent({
      video: videoSrc,
      text: text,
      activeCard: cardNumber
    });
  };

  return (
    <div className="container-fluid bg-f1f5ff position-relative border border-1">
      <div className="row py-0 mx-0 mb-5">
        <div className="col-12 text-center position-relative">
          <h1 className="pt-3 pb-lg-3 pb-md-3 pb-0 fw-600 fs-32px">How It Works</h1>
        </div>
        <div className="d-flex flex-column flex-md-row px-0">
          <div className="d-flex flex-column mx-0 my-4 col-lg-7 col-md-7 col-12 align-items-center order-lg-1 order-md-1 order-2">
            {/* card 1 */}
            <div
              className={`card col-lg-10 col-10 mx-auto card-shadow ${selectedContent.activeCard === 1 ? 'cardhoverblue' : ''}`}
              onClick={() =>
                handleCardClick(
                  video1,
                  "Browse plans, choose the best fit for individual, family, or corporate needs, review your selection, proceed with payment, and enter personal or company information.",
                  1
                )
              }
              style={{ cursor: "pointer" }}
            >
              <div className="card-body d-flex align-items-center">
                <div>
                  <img src={plusgif} alt="plus icon" width={80} />
                </div>
                <div className="ms-3">
                  <h5 className="fw-600">Subscribe to Our Plan.</h5>
                </div>
              </div>
            </div>
            {/* card 2 */}
            <div
              className={`card col-lg-10 col-10 mx-auto card-shadow ${selectedContent.activeCard === 2 ? 'cardhoverblue' : ''}`}
              onClick={() =>
                handleCardClick(
                  video2,
                  "To file an OPD claim, initiate your claim process by filling out the required form. Upload your prescription & Submit for Quick Claim Reimbursement.",
                  2
                )
              }
              style={{ cursor: "pointer" }}
            >
              <div className="card-body d-flex align-items-center">
                <div>
                  <img src={claimgif} alt="claim icon" width={80} />
                </div>
                <div className="ms-3">
                  <h5 className="fw-600">Claim your OPD Bills.</h5>
                </div>
              </div>
            </div>
          </div>
          {/* Video Container */}
          {selectedContent.video && (
            <div
              className="video-container position-relative col-lg-5 col-md-5 col-12 mt-4 mt-md-0 text-center my-auto order-lg-2 order-md-2 order-1"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "14px",
                overflow: "hidden"
              }}
            >
              <video 
                key={selectedContent.video}
                controls 
                autoPlay
                style={{ borderRadius: "1.5rem", width: "50%", height: "auto" }}
                className="video-size"
              >
                <source src={selectedContent.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowitWorks;
