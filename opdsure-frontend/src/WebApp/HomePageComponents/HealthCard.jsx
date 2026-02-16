import React, { useState, useEffect, useRef } from "react";

const HealthCard = () => {
  const [showImage, setShowImage] = useState(false);
  const healthCardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowImage(true);
        }
      },
      { threshold: 0.5 }
    );

    if (healthCardRef.current) {
      observer.observe(healthCardRef.current);
    }

    return () => {
      if (healthCardRef.current) {
        observer.unobserve(healthCardRef.current);
      }
    };
  }, []);

  return (
    <div className="container-fluid bg-gradient-light border border-1">
      <div className="row">
        <h1 className="text-center mt-5">Health Card</h1>
        <div
          className="col-12 pt-3 px-3 pb-5 justify-content-center d-flex position-relative"
          ref={healthCardRef}
        >
          <img
            src={healthcard}
            alt="healthcard image"
            style={{ height: "100vh" }}
            className="img-fluid"
          />

          {showImage && (
            <div className="pop-up-container d-flex align-items-center justify-content-center">
              <img
                src={popUpImage}
                alt="Pop Up"
                className="pop-up-image"
                width={250}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthCard;
