import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import config from "../../config/config";
import { Axios } from "../../axios/axiosFunctions";
import { Utils } from "../../utils";
import { Alert } from "antd";
import arrowrightup from "../Assets/arrow-up-right.png";
import arrowright from "../Assets/arrow-right.png";
import arrow from "../Assets/ArrowLeft.png";
import blogBanner from "../Assets/blogs-banner.svg";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, FacebookIcon, TwitterIcon, LinkedinIcon} from 'react-share';
import copy from 'copy-to-clipboard';
import {FloatButton} from 'antd';
import {ArrowUpOutlined} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { LeftCircleOutlined } from "@ant-design/icons";

const IndividualBlog = () => {
    const { id } = useParams();
  const [blogData, setBlogData] = useState([]);
  const [allBlog, setAllBlog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
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

  useEffect(() => {
    setShareUrl(`${window.location.origin}/blogs/${id}`);

    if (id) {
      fetchBlogDataById(id);
    } else {
      setAllBlog(true);
      fetchAllBlogData();
    }
  }, [id]);

  const fetchBlogDataById = async (id) => {
    const response = await Axios.fetchAxiosData(`${config.GetBlog}/${id}`);
    setBlogData(response.data.records);
  };

  const fetchAllBlogData = async () => {
    const response = await Axios.fetchAxiosData(config.GetAllBlogs);
    setBlogData(response.data.records);
  };
  const handleCopyLink = () => {
    copy(shareUrl);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };
  const calculateReadingTime = (content, wordsPerMinute = 200) => {
    const text = content.replace(/<[^>]*>/g, " ").trim();
    const wordCount = text.split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTimeMinutes} minute${readingTimeMinutes > 1 ? "s" : ""} read`;
  };
  return (
//     <>
//     <div className="row mx-0">
//       <div className="col-12 p-0">
//         <div id="carouselExampleCaptions" className="carousel slide">
//           <div className="carousel-inner">
//             {/* Image Slides */}
//             {blogData?.url?.map((file, index) => (
//               <div
//                 className={`carousel-item ${
//                   index === 0 ? "active" : ""
//                 }`}
//                 key={index}
//               >
//                 <img
//                   src={file}
//                   className="d-block w-100"
//                   alt={`Slide ${index + 1}`}
//                   style={{ height: "25rem", objectFit: "cover", padding:"1rem" }}
                
//                 />
//               </div>
//             ))}
//           </div>
//           <button
//             className="carousel-control-prev"
//             type="button"
//             data-bs-target="#carouselExampleCaptions"
//             data-bs-slide="prev"
//           >
//             <span
//               className="carousel-control-prev-icon"
//               aria-hidden="true"
//             ></span>
//             <span className="visually-hidden">Previous</span>
//           </button>
//           <button
//             className="carousel-control-next"
//             type="button"
//             data-bs-target="#carouselExampleCaptions"
//             data-bs-slide="next"
//           >
//             <span
//               className="carousel-control-next-icon"
//               aria-hidden="true"
//             ></span>
//             <span className="visually-hidden">Next</span>
//           </button>
//         </div>
//       </div>
//     </div>

//     <div className="row pt-5 pb-3 px-5 mx-0">
//       <div className="col-12 mx-0">
//         <h2 className="fw-600 text-capitalize">{blogData.title}</h2>         
//           <div
//             className="mt-4"
//             dangerouslySetInnerHTML={{ __html: blogData.desciption }}
//           ></div>
       
//       </div>
//     </div>

//     {/* Share Buttons and Copy Link */}
//     <div className="row mx-5 pb-5">
//             <div className="col-12 col-md-6 p-4">
//               <h3 className="fw-600 text-capitalize text-243572">Share this Blog</h3>
//               <p>If you like this blog, please share it with your friends.</p>
//               <div className="d-flex justify-content-start gap-4 my-4">
//                 <FacebookShareButton url={shareUrl} quote={blogData.title}>
//                   <FacebookIcon size={32} round />
//                 </FacebookShareButton>
//                 <TwitterShareButton url={shareUrl} title={blogData.title}>
//                   <TwitterIcon size={32} round />
//                 </TwitterShareButton>
//                 <LinkedinShareButton url={shareUrl} title={blogData.title}>
//                   <LinkedinIcon size={32} round />
//                 </LinkedinShareButton>
//               </div>
//               <p className="fw-600">or copy the link below.</p>
//               <div className="input-group">
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={shareUrl}
//                   readOnly
//                   id="shareLink"
//                 />
//                 <button
//                   onClick={handleCopyLink}
//                   className="btn btn-primary"
//                   type="button"
//                 >
//                   Copy Link
//                 </button>
//               </div>
//               {alertVisible && (
//                 <div className="mt-3">
//                   <Alert message="Link Copied" type="success" showIcon closable />
//                 </div>
//               )}
//             </div>
//           </div>   
//           <div className="m-4 ms-5">
//           <NavLink to="/blogs" style={{ textDecoration: "none" }} className="d-flex align-items-center">
// <LeftCircleOutlined className="fs-3 text-purple me-2" /> 
// <span>Back to all Blogs</span>
// </NavLink>
// </div>       
//   </>
<>
  <div className="container-fluid bg-gradient-light p-0 m-0">
    {id && (
      <>
        <div className="row mx-0">
          <div className="col-12 p-0">
            {/* Directly show the first image */}
            {blogData?.url && blogData.url.length > 0 && (
              <img
                src={blogData.url[0]} // Show the first image
                className="d-block w-100"
                alt="First Image"
                style={{ height: "30rem", objectFit: "cover", padding: "1.5rem 2rem", }}
              />
            )}
          </div>
        </div>

        <div className="row pt-3 pb-2 px-5 " style={{ maxWidth:"90%", margin:"auto"}}>
          <div className="col-12 mx-0" >
            <h2 className="fw-600 text-capitalize">{blogData.title}</h2>
            <div
              className="mt-4"
              dangerouslySetInnerHTML={{ __html: blogData.desciption }}
              style={{textAlign:"justify",}}
            ></div>
          </div>
        </div>

        {/* Share Buttons and Copy Link */}
        <div className="row mx-5 pb-5">
          <div className="col-12 col-md-6 p-4">
            <h3 className="fw-600 text-capitalize text-243572">Share this Blog</h3>
            <p>If you like this blog, please share it with your friends.</p>
            <div className="d-flex justify-content-start gap-4 my-4">
              <FacebookShareButton url={shareUrl} quote={blogData.title}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={blogData.title}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <LinkedinShareButton url={shareUrl} title={blogData.title}>
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
                  <div className="m-4 ms-5">
           <NavLink to="/blogs" style={{ textDecoration: "none" }} className="d-flex align-items-center">
 <LeftCircleOutlined className="fs-3 text-purple me-2" /> 
 <span>Back to All Blogs</span>
 </NavLink>
 </div>    
      </>
    )}

    {/* Scroll to Top Button */}
    {showFloatButton && (
      <FloatButton
        icon={<ArrowUpOutlined />}
        tooltip="Scroll to top"
        style={{ right: 60, bottom: 40, backgroundColor: "#5dadec" }}
        onClick={handleScrollToTop}
      />
    )}
  </div>
</>

  )
}

export default IndividualBlog