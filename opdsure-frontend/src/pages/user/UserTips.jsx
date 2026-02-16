import React, { useState, useEffect } from "react";
import opdlogowhite from "../../assets/opdlogowhite.png";
import bulb from "../../assets/bulb.png";
import { useNavigate, Link } from "react-router-dom";
import {Spin, Button } from "antd";
import { LeftOutlined, RightOutlined, LoadingOutlined } from "@ant-design/icons";

const UserTips = () => {
  const carouselItems = [
    {
      id: 1,
      tip: "Tip #1",
      title: "Stay Hydrated",
      description:
        "Drink at least 8 glasses of water daily to keep your body functioning properly.",
    },
    {
      id: 2,
      tip: "Tip #2",
      title: "Eat Balanced Meals",
      description:
        "Include fruits, vegetables, lean proteins, and whole grains in your diet.",
    },
    {
      id: 3,
      tip: "Tip #3",
      title: "Exercise Regularly",
      description:
        "Aim for at least 30 minutes of physical activity most days of the week.",
    },
    {
      id: 4,
      tip: "Tip #4",
      title: "Get Enough Sleep",
      description:
        "Ensure 7-9 hours of sleep each night to help your body recover and stay healthy",
    },
    {
      id: 5,
      tip: "Tip #5",
      title: "Practice Good Hygiene",
      description:
        "Wash your hands frequently and maintain personal cleanliness.",
    },
    {
      id: 6,
      tip: "Tip #6",
      title: "Manage Stress",
      description:
        "Practice relaxation techniques like deep breathing, meditation, or yoga.",
    },
   
    {
      id: 7,
      tip: "Tip #7",
      title: "Stay Active Mentally",
      description:
        "Exercise regularly to improve your mood, focus, and overall well-being.",
    },
    {
      id: 8,
      tip: "Tip #8",
      title: "Regular Check-ups",
      description:
        "Schedule routine health check-ups to catch any issues early.",
    },
    {
      id: 9,
      tip: "Tip #9",
      title: "Avoid Smoking and Limit Alcohol",
      description:
        "Quit smoking and drink alcohol in moderation to reduce health risks.",
    },
  ];
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
  const chunkedPlanData = chunkArray(carouselItems, 3);

  const [activeIndex, setActiveIndex] = useState(0);
  const [counter, setCounter] = useState(24);

  const navigate = useNavigate();
  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

    return () => clearInterval(timer);
  }, [counter]);
  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? chunkedPlanData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === chunkedPlanData.length - 1 ? 0 : prevIndex + 1
    );
  };

  
  
  return (
    <>
      <div className="container-fluid" style={{ backgroundColor: "#486ab3" }}>
        <div
          className="row justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="col-12 ">
            <div
              className="row d-flex justify-content-center align-items-center"
              style={{ height: "40vh" }}
            >
              <div className="col-12 mx-auto text-center">
                <img src={opdlogowhite} alt="opdlogo" />
              </div>
              <div className="col-12 text-center">
                <div
                  id="carouselExampleAutoplaying"
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-inner">
                    {chunkedPlanData.map((chunk, index) => (
                      <div
                        key={`chunk-${index}`}
                        className={`carousel-item ${
                          index === activeIndex ? "active" : ""
                        }`} data-bs-interval="8000"
                      >
                        <div className="container">
                          <div className="row">
                            {chunk.map((item) => (
                              <div
                                key={item.id}
                                className="col-12 col-md-4 col-lg-4"
                              >
                                <div className="card p-1 rounded-3 m-2 bg-white">
                                  <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-center">
                                      <div>
                                        <img
                                          src={bulb}
                                          alt="tip bulb"
                                          style={{ width: "50px" }}
                                        />
                                      </div>
                                      <div className="text-start ms-3">
                                        <p>{item.tip}</p>
                                        <h5 className="card-title">
                                          {item.title}
                                        </h5>
                                        <p className="card-text">
                                          {item.description}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    onClick={handlePrev}
                    data-bs-target="#carouselExampleAutoplaying"
                    data-bs-slide="prev"
                    hidden={activeIndex === 0}
                  >
                    <span aria-hidden="true">
                      <LeftOutlined className="text-white fs-1 position-absolute start-0 ms-3" />
                    </span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    onClick={handleNext}
                    data-bs-target="#carouselExampleAutoplaying"
                    data-bs-slide="next"
                    hidden={activeIndex === chunkedPlanData.length - 1}
                  >
                    <span aria-hidden="true">
                      <RightOutlined className="text-white fs-1 position-absolute end-0 me-3" />
                    </span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
              <div
                className="col-12 text-center text-white"
                style={{ lineHeight: "0.5" }}
              >
            {counter > 0 ? (
              <div className="d-flex justify-content-center align-items-center">
             
              <p><Spin indicator={<LoadingOutlined spin className="text-white mt-3"/>} /></p>
              </div>
            ) : (
             navigate("/user/plans")
            )}
               
                <p>Wait!</p>
                <p>We are forwarding you to health plan</p>
              </div>
            </div>
            <div className="col-11 text-end mt-5 me-3">
            <Link to="/user/plans"><Button>
             Skip
            </Button></Link>
          </div>
          </div>
           
        </div>
      </div>
    </>
  );
};

export default UserTips;
