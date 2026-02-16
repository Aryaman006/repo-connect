import React, { useState, useEffect } from "react";
import { FloatButton, notification } from 'antd'; // Import FloatButton and notification from Ant Design
import { UpOutlined } from '@ant-design/icons'; // Import the UpOutlined icon for fallback or styling purposes
import MarqueeBox from "../CommonComponents/MarqueeBox";
import BannerSection from "../HomePageComponents/BannerSection";
import formEmployee from "../Assets/corpBgImg.jpg";
import formRetailer from "../Assets/retailBgImg.jpeg";
import '../../webapp.css';
import Loader from "../CommonComponents/Loader";
import AboutUs from "../HomePageComponents/AboutUs";
import EmpWellCorporateForm from "../HomePageComponents/EmpWellCorporateForm";
import EmpWellRetailForm from "../HomePageComponents/EmpWellRetailForm";
import FollowUs from "../HomePageComponents/FollowUs";
import OurPlans from "../HomePageComponents/OurPlans";
import HowitWorks from "../HomePageComponents/HowitWorks";
import HealthCardNew from "../HomePageComponents/HealthCardNew";
import HearOurSubscriber from "../HomePageComponents/HearOurSubscriber";
import ReachOutModal from "../HomePageComponents/ReachOutModal";
import OurBlog from "../HomePageComponents/OurBlog";
import { ArrowUpOutlined } from "@ant-design/icons";
import { imageUrlsCoporateClients, imageUrlsOrganizationTrusted } from '../imageData';

const WebHomePage = () => {
  const [isCorporateForm, setIsCorporateForm] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showFloatButton, setShowFloatButton] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   window.scrollTo(0, 0); // Scroll to top on component mount
  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      window.scrollTo(0, 0);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleFormChange = (event) => {
    setIsCorporateForm(event.target.checked);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatButton(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      const timer = setTimeout(() => {
        setIsModalVisible(true);
        sessionStorage.setItem('hasVisited', 'true'); // Set the flag in session storage
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleModalClose = () => {
    setIsModalVisible(false);
    sessionStorage.setItem('modalClosed', 'true');
  };

  const handleScrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      notification.error({
        message: 'Scroll Error',
        description: 'An error occurred while scrolling to the top.',
      });
    }
  };

  return (
    <>
      {loading ? (
        <Loader /> // Show loader while loading
      ) : (
        <>
          <BannerSection />
          <OurPlans />
          <AboutUs />
          <HealthCardNew />
          <HowitWorks />
          <HearOurSubscriber />
          <OurBlog />
          <FollowUs />

          <div className="container-fluid position-relative" style={{ minHeight: "85vh" }} id="empWellCorporateForm">
            <div className="row">
              <div className="col-12 p-0">
                <img
                  src={isCorporateForm ? formEmployee : formRetailer}
                  alt="background doctor"
                  style={{ filter: "brightness(0.2)" }}
                  className={`img-fluid z-n1 position-absolute w-100 p-0 h-100 object-fit-cover`}
                />
                <div className="position-absolute top-0 left-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 200, 0.05)', pointerEvents: 'none' }} />
                <div className="btn-container d-flex justify-content-center mt-5">
                  <label className="switch btn-color-mode-switch">
                    <input
                      type="checkbox"
                      id="color_mode2"
                      name="color_mode2"
                      checked={isCorporateForm}
                      onChange={handleFormChange}
                    />
                    <label
                      className="btn-color-mode-switch-inner"
                      data-off="Retail"
                      data-on="Corporate"
                      htmlFor="color_mode2"
                    />
                  </label>
                </div>
                <h1 className={`text-white ${isCorporateForm ? "mb-4" : "my-4"} text-center mb-5 fw-600 fs-36px z-5 mt-5`}>
                  {isCorporateForm ? "Employee Health and Wellness Program!" : "Empowering Your Well-being Journey!"}
                </h1>
                {isCorporateForm ? <EmpWellCorporateForm /> : <EmpWellRetailForm />}
              </div>
            </div>
          </div>

          <div className="row mx-0">
            <div className="col-12 pb-5 pt-5 position-relative border border-1 px-0 bg-deefff">
              <h1 className="text-center fw-600 mb-5 fs-36px">Organizations That Trusted Us</h1>
              <MarqueeBox images={imageUrlsCoporateClients} direction="right" bgColor={"bg-deefff"} />
              <MarqueeBox direction={"left"} images={imageUrlsOrganizationTrusted} bgColor={"bg-deefff"} />
            </div>
          </div>

          {/* Scroll to Top Button */}
          {showFloatButton && (
            <FloatButton
              icon={<ArrowUpOutlined />}
              tooltip="Scroll to top"
              style={{ right: 20, bottom: 65, backgroundColor: "#5dadec" }}
              onClick={handleScrollToTop}
            />
          )}

          {/* Reach Out Modal */}
          <ReachOutModal visible={isModalVisible} onClose={handleModalClose} />
        </>
      )}
    </>
  );
};

export default WebHomePage;


// import React, { useState, useEffect } from "react";
// import { FloatButton, notification } from 'antd'; // Import FloatButton and notification from Ant Design
// import { UpOutlined } from '@ant-design/icons'; // Import the UpOutlined icon for fallback or styling purposes
// import MarqueeBox from "../CommonComponents/MarqueeBox";
// import BannerSection from "../HomePageComponents/BannerSection";
// import formEmployee from "../Assets/corpBgImg.jpg";
// import formRetailer from "../Assets/retailBgImg.jpeg";
// import '../../webapp.css';
// import Loader from "../CommonComponents/Loader";
// import AboutUs from "../HomePageComponents/AboutUs";
// import EmpWellCorporateForm from "../HomePageComponents/EmpWellCorporateForm";
// import EmpWellRetailForm from "../HomePageComponents/EmpWellRetailForm";
// import FollowUs from "../HomePageComponents/FollowUs";
// import OurPlans from "../HomePageComponents/OurPlans";
// import HowitWorks from "../HomePageComponents/HowitWorks";
// import HealthCardNew from "../HomePageComponents/HealthCardNew";
// import HealthCard from "../HomePageComponents/HealthCard";
// import HearOurSubscriber from "../HomePageComponents/HearOurSubscriber";
// import ReachOutModal from "../HomePageComponents/ReachOutModal";
// import OurBlog from "../HomePageComponents/OurBlog";
// import {ArrowUpOutlined} from "@ant-design/icons";
// import { imageUrlsCoporateClients, imageUrlsOrganizationTrusted } from '../imageData';

// const WebHomePage = () => {
  
//   const [isCorporateForm, setIsCorporateForm] = useState(true);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [showFloatButton, setShowFloatButton] = useState(true);
//   const [loading, setLoading] = useState(true);
  

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false); 
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, []);
//   const handleFormChange = (event) => {
//     setIsCorporateForm(event.target.checked);
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       setShowFloatButton(window.scrollY > 300);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // useEffect(() => {
//   //   const timer = setTimeout(() => {
//   //     const hasVisited = localStorage.getItem('hasVisited');
//   //     if (!hasVisited) {
//   //       setIsModalVisible(true);
//   //     }
//   //   }, 3000);

//   //   return () => clearTimeout(timer);
//   // }, []);
//   useEffect(() => {
//     const hasVisited = sessionStorage.getItem('hasVisited');
//     if (!hasVisited) {
//       const timer = setTimeout(() => {
//         setIsModalVisible(true);
//         sessionStorage.setItem('hasVisited', 'true'); // Set the flag in session storage
//       }, 3000);

//       return () => clearTimeout(timer);
//     }
//   }, []);

//   const handleModalClose = () => {
    
//     setIsModalVisible(false);
//     sessionStorage.setItem('modalClosed', 'true');
//   };

//   const handleScrollToTop = () => {
//     try {
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     } catch (error) {
//       notification.error({
//         message: 'Scroll Error',
//         description: 'An error occurred while scrolling to the top. Please try again later.',
//       });
//     }
//   };

//   return (
//     <>
//     {loading ? (
//         <Loader /> // Show loader while loading
//       ) : (
//         <>
//       <BannerSection />
//       <OurPlans />
//       <AboutUs />
//       <HealthCardNew />
//       {/* <HealthCard/> */}
      
//       <HowitWorks />
//       <HearOurSubscriber />
//       <OurBlog/>
//       <FollowUs />
     
//       {/* employee wellness form */}
//       {/* <div className="container-fluid position-relative" style={{minHeight: "85vh"}} id="empWellCorporateForm" >
//         <div className="row ">
//           <div className="col-12 p-0">
//             <img
//               src={isCorporateForm ? formEmployee : formRetailer}
//               alt="background doctor"

//               style={{filter: "brightness(0.2)"}}

//               className={`img-fluid z-n1 position-absolute w-100 p-0 h-100 object-fit-cover ${isCorporateForm ?"":""}`}
//             />
//             <div className="btn-container d-flex justify-content-center mt-5">
//               <label className="switch btn-color-mode-switch">
//                 <input
//                   type="checkbox"
//                   id="color_mode2"
//                   name="color_mode2"
//                   checked={isCorporateForm}
//                   onChange={handleFormChange}
//                 />
//                 <label
//                   className="btn-color-mode-switch-inner"
//                   data-off="Retail"
//                   data-on="Corporate"
//                   htmlFor="color_mode2"
//                 />
//               </label>
//             </div>

//             {isCorporateForm ? <h1 className="text-white mt-4 text-center fw-600 fs-36px z-5">Book Demo</h1>:<><br/><br/></>}

//             <h1 className={`text-white ${isCorporateForm ? "my-4":"my-4"} text-center mb-3 fw-600 fs-32px z-5`} >

//               {
//                 isCorporateForm ? "Employee Health and Wellness Program!" : "Empowering Your Well-being Journey!"
//               }
//             </h1>
//             {isCorporateForm ? <EmpWellCorporateForm /> : <EmpWellRetailForm />}
//           </div>
//         </div>
//       </div> */}
//       <div className="container-fluid position-relative" style={{ minHeight: "85vh" }} id="empWellCorporateForm">
//   <div className="row">
//     <div className="col-12 p-0">
//       <img
//         src={isCorporateForm ? formEmployee : formRetailer}
//         alt="background doctor"
//         style={{ filter: "brightness(0.2)" }}
//         className={`img-fluid z-n1 position-absolute w-100 p-0 h-100 object-fit-cover`}
//       />
//       {/* Blue tint overlay */}
//       <div
//         className="position-absolute top-0 left-0 w-100 h-100"
//         style={{
//           backgroundColor: 'rgba(0, 0, 200, 0.05)', 
//           pointerEvents: 'none',
//         }}
//       />
//       <div className="btn-container d-flex justify-content-center mt-5">
//         <label className="switch btn-color-mode-switch">
//           <input
//             type="checkbox"
//             id="color_mode2"
//             name="color_mode2"
//             checked={isCorporateForm}
//             onChange={handleFormChange}
//           />
//           <label
//             className="btn-color-mode-switch-inner"
//             data-off="Retail"
//             data-on="Corporate"
//             htmlFor="color_mode2"
//           />
//         </label>
//       </div>
//       {/* {isCorporateForm ? <h1 className="text-white mt-4 text-center fw-600 fs-36px z-5">Book Demo</h1> : <><br /><br /></>} */}
//       <h1 className={`text-white ${isCorporateForm ? "mb-4" : "my-4"} text-center mb-5 fw-600 fs-36px z-5 mt-5`}>
//         {isCorporateForm ? "Employee Health and Wellness Program!" : "Empowering Your Well-being Journey!"}
//       </h1>
//       {isCorporateForm ? <EmpWellCorporateForm /> : <EmpWellRetailForm />}
//     </div>
//   </div>
// </div>

//       <div className="row mx-0">
//         <div className="col-12 pb-5 pt-5 position-relative border border-1 px-0 bg-deefff">

//           {/* <img src={templateimg} alt="template image" className="img-fluid position-absolute ms-5 start-0"/> */}
//           <h1 className="text-center fw-600 mb-5 fs-36px">Organizations That Trusted Us</h1>

//           <MarqueeBox
//             images={imageUrlsCoporateClients}
//             direction="right"
//             bgColor={"bg-deefff"}
//           />
//           <MarqueeBox
//             direction={"left"}
//             images={imageUrlsOrganizationTrusted}
//             bgColor={"bg-deefff"}
//           />
//         </div>
//       </div>
//       {/* Scroll to Top Button */}
//       {showFloatButton && (
//         <FloatButton
//           icon={<ArrowUpOutlined />}
//           tooltip="Scroll to top"
//           style={{ right: 60, bottom: 40, backgroundColor: "#5dadec" }}
//           onClick={handleScrollToTop}
//         />
//       )}
//       {/* Reach Out Modal */}
//       <ReachOutModal visible={isModalVisible} onClose={handleModalClose} />
//     </>)}
//     </>
//   );
// };

// export default WebHomePage;
