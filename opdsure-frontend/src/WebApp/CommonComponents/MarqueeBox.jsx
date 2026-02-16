import React from "react";
import Marquee from "react-fast-marquee";

const MarqueeBox = ({ subtitle, title , images, direction, bgColor}) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 p-0 ">
          <h2 className="text-center fw-600 mb-0">{title}</h2>
          <h5 className="text-center text-muted">{subtitle}</h5>
          <Marquee className={`${bgColor} p-3 border-bottom border-2`} style={{borderColor:"#a9a9a9"}} direction={direction}>
            {images?.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`marquee-img-${index}`}
                style={{ margin: '0 54px' }}
                width={100}
                className="element"
              />
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default MarqueeBox;
