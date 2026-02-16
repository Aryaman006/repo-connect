import React,{useState, useEffect} from "react";
import arrowrightup from "../Assets/arrow-up-right.png";
import arrowright from "../Assets/arrow-right.png";
import { Link } from "react-router-dom";
import {Axios} from "../../axios/axiosFunctions";
import config from "../../config/config";
import { Utils } from "../../utils";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import {faCircleChevronRight,faCircleChevronLeft, faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const OurBlog = () => {
  
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [chunkSize, setChunkSize] = useState(3);

  const fetchBlogData = async () => {
    const response = await Axios.fetchAxiosData(config.GetAllBlogs);
    setBlogData(response?.data?.records);
  }
  useEffect(() => {
    fetchBlogData();
  }, [])

  const calculateReadingTime = (content, wordsPerMinute = 200) => {
   
    const text = content.replace(/<[^>]*>/g, ' ').trim();
    const wordCount = text.split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  
    return `${readingTimeMinutes} minute${readingTimeMinutes > 1 ? 's' : ''} read`;
  }

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

  const chunkedBlogData = chunkArray(blogData,  chunkSize);
  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? chunkedBlogData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === chunkedBlogData.length - 1 ? 0 : prevIndex + 1
    );
  };
  return (
    <>
      <div className="container-fluid bg-gradient-lighter position-relative">
        <div className="row ">
          <div className="col-12 text-center ">
            <h1 className="fs-32px fw-600 pt-3 mt-3">Our Blogs</h1>
            {/* <span className="fw-400 text-muted fs-20px">
            Stay updated with Industry related Article and Insights
            </span> */}

          </div>
          <div className="col-11 pt-3 mx-auto text-end">
          <Link to="/blogs">
            <Button className="bg-243673 text-white rounded-pill">View All</Button>
            </Link>
          </div>
        </div>
        <div id="blogCarousel" className="carousel slide">
        <div className="carousel-inner">
  {chunkedBlogData?.map((chunk, index) => (
    <div
      key={index}
      className={`carousel-item ${index === activeIndex ? "active" : ""}`}
    >
      <div className="row pb-5 pt-3 d-flex justify-content-center mx-5">
        {chunk?.map((item, i) => (
          <div className="col-lg-4 col-md-6 col-12 mb-3" key={i}>
            <Link to={`/blogs/${item._id}`} target="_blank" className="text-decoration-none">
              <div className="card bg-deefff rounded-4 cardarrow border-0 h-100" style={{ maxHeight: "20rem" }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5 className="fw-600 text-capitalize fs-22">{item.title}</h5>
                    <div className="arrow-icons me-4">
                      <img
                        src={arrowrightup}
                        alt="arrow to redirect"
                        width={20}
                        height={20}
                        className="arrow-right-up"
                      />
                      <img
                        src={arrowright}
                        alt="arrow to redirect"
                        width={30}
                        height={30}
                        className="arrow-right"
                      />
                    </div>
                  </div>
                  <div className="d-flex">
                    <p className="card-text text-muted">{Utils.DateFormat(item.createdAt)}</p>
                    <p className="card-text text-muted mx-2">|</p>
                    <p className="card-text text-muted">{calculateReadingTime(item.desciption)}</p>
                  </div>
                  <img src={item?.fileUrls[0]} alt="img" className="rounded-4 img-fluid" style={{ height: "9.25rem", width: "25.5rem" }} />
                  <div className="card-footer h-25 border-0 mt-2 bg-transparent">
                    <div className="text-truncated text-muted" dangerouslySetInnerHTML={{
                      __html: item?.desciption,
                    }}></div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>


        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#blogCarousel"
          data-bs-slide="prev"
          hidden={activeIndex === 0}
          onClick={handlePrev}
        >
          <span aria-hidden="true"><FontAwesomeIcon icon={faCircleChevronLeft} size="2xl" className="text-243572" /></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#blogCarousel"
          data-bs-slide="next"
          hidden={activeIndex === chunkedBlogData.length - 1}
          onClick={handleNext}
        >
          <span aria-hidden="true"><FontAwesomeIcon icon={faCircleChevronRight} size="2xl" className="text-243572" /></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>

    </>
  );
};

export default OurBlog;
