import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {Input, Form, Button, notification,Modal} from "antd";
import CONSTANTS from "../../constant/Constants";
import location from "../Assets/marker-pin-01.png";
import phone from "../Assets/phone-white.png";
import appstore from "../Assets/App Store.png";
import playstore from "../Assets/Play Store.png";
import { Axios } from "../../axios/axiosFunctions";
import config from "../../config/config";
import linkedin from "../Assets/linkedin1.png";
import instagram from "../Assets/instagram1.png";
import facebook from "../Assets/Facebook.png";
import youtube from "../Assets/youtube.png";
import opdlogo from "../Assets/OPDLogoH2.png";
import startupLogo from "../Assets/LogoStartUp.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareXTwitter } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {

  const [contactForm] = Form.useForm();

  const handleLinkClick = (link, e) => {
    e.preventDefault(); 
    if (link) {
      window.open(link, '_blank');
    } else {
      notification.info({
        message: 'Mobile App Coming Soon',
        placement: 'topRight',
      });
    }
  };

  const contactFormSubmit = async(values) => {
    const response = await Axios.postAxiosData(config.ContactUsEmail, values);

    if (response.success === true) {
      notification.success({
        message: "Thank you for your interest. We will get back to you soon.",
      });
      contactForm.resetFields();
    } else {
      notification.error({
        message: response.message,
      });
    }
  }

  return (
    <>
      <div className="container-fluid bg-243673 text-white px-0" >
        <div className="row px-4 pt-4 pb-2 m-0">       
          <div className="col-lg-2 col-md-6 col-12 order-lg-1 order-1 mt-3">
            <h6 className="fw-600">Helpful Links</h6>
            <hr className="col-6 border-4"/>             
              <p className="">
                <Link to="/privacy-policy" className="text-decoration-none text-white">
                  Privacy Policy
                </Link>
              </p>
              <p className="">
                <Link to="/contact-us" className="text-decoration-none text-white">
                  Support
                </Link>
              </p>
              <p className="">
                <Link to="/terms-and-conditions/signup"  className="text-decoration-none text-white">
                  Terms & Conditions
                </Link>
              </p>
              <p className="">
                <Link to="/disclaimer" className="text-decoration-none text-white">
                  Disclaimer
                </Link>
              </p>
              <p className="">
                <Link to="/FAQs" target="_blank" className="text-decoration-none text-white">
                  FAQ
                </Link>
              </p>
         
                     
              {/* <p><img src={opdlogo} alt="opd sure logo"  className=" rounded-3" style={{width: 220}}/> </p> */}
          </div>
          <div className="col-lg-2 col-md-3 col-6 order-lg-2 order-2 mt-3">
            <h6 className="fw-600">Quick Links</h6>
            <hr className="col-6 border-4"/>              
              
              <p className="">
                <Link to="/about-us" className="text-decoration-none text-white">
                  About Us
                </Link>
              </p>
              <p className="">
                <Link to="/subscription-plans"  className="text-decoration-none text-white">
                  Retail Plans
                </Link>
              </p>
              <p className="">
                <Link to="/subscription-plans-corporate"  className="text-decoration-none text-white">
                  Corporate Plans
                </Link>
              </p>
              <p className="">
                <Link to="/services"  className="text-decoration-none text-white">
                  Services
                </Link>
              </p>
              <p className="">
                <Link to="/careers" target="_blank" className="text-decoration-none text-white">
                  Careers
                </Link>
              </p>
              
             
          </div>
          <div className="col-lg-2 col-md-3 col-4 order-lg-2 order-3 mt-3 ">
            <br /><br />
          <p className="mt-2">
                <Link to="/media" target="_blank"  className="text-decoration-none text-white">
                  Media
                </Link>
              </p>
              <p className="">
                <Link to="/blogs" target="_blank" className="text-decoration-none text-white">
                  Blogs
                </Link>
              </p>
              <p className="">
                <Link to="/events" target="_blank" className="text-decoration-none text-white">
                  Events
                </Link>
              </p>
              <p className="">
                <Link to="/Join-us" target="_blank" className="text-decoration-none text-white">
                  Join Us
                </Link>
              </p>
              <p className="">
                <Link to="/contact-us" className="text-decoration-none text-white">
                  Contact Us
                </Link>
              </p>   
          </div>
          <div className="col-lg-4 col-md-6 col-12 order-lg-3 order-4 mt-3">
          <h6 className="fw-600">Contact Us</h6>
          <hr className="col-3 border-4 bg-white"/>
          <div className="d-flex align-items-center ">
  <Form
    requiredMark={false}
    form={contactForm}
    onFinish={contactFormSubmit}
    className=" d-flex border border-light-subtle rounded-4 align-items-center gap-4 p-1 mb-2"
  >
    <Form.Item
      className="mb-0"
      name="email"
      rules={[
        {
          type: "email",
          message: "Please enter a valid email address",
        },
        { required: true, message: "Please enter your email address" },
      ]}
    >
      <Input
        placeholder="Enter Email"
        variant="borderless"
        size="small"
        type="email"
        className="footer-email-input"
      />
    </Form.Item>
    <Form.Item className="mb-0">
      <Button type="primary" htmlType="submit" size="small" className="rounded-2">
        Submit
      </Button>
    </Form.Item>
  </Form>
</div>

          <p><img src={location} alt="location" width={20} className="me-1"/>{CONSTANTS.COMPANY_DETAILS.ADDRESS}</p>
          <p><img src={phone} alt="phone" width={20} className="me-1"/>{CONSTANTS.COMPANY_DETAILS.CONTACT_NO}</p>
          <div className="row">
            <div className="col-6">
            <p className="fs-12px" style={{marginBottom: 0}}>GST No.  {CONSTANTS.COMPANY_DETAILS.GST}</p>
            <p className="fs-12px" style={{marginBottom: 0}}>COI No.  {CONSTANTS.COMPANY_DETAILS.COI}</p>
            <p className="fs-12px">{CONSTANTS.COMPANY_DETAILS.NAME}</p>
            </div>
            <div className="col-6">
            <p className="fs-12px" style={{marginBottom: 0}}>Trade Mark No.  {CONSTANTS.COMPANY_DETAILS.TM}</p>
            <p className="fs-12px" style={{marginBottom: 0}}>Certificate No.  {CONSTANTS.COMPANY_DETAILS.CERT}</p>
            </div>
            <div className="col-6" >
            
            </div>
          </div>
         
         

          </div>
          <div className="col-lg-2 col-md-6 col-12 order-lg-4 order-5 mt-3">
          <h6 className="fw-600 ">Install App</h6>  
          <hr className="col-6 border-4"/>
          <div className="align-items-center gap-1 footer-icons ">
        
          <Link onClick={(e) => handleLinkClick(CONSTANTS.COMPANY_DETAILS.APP_STORE, e)}>
          <img src={appstore} alt="appstore" width={120} className="mb-2 img-fluid icon-enlarge"/>
          </Link>
       
          <br />
         
          <Link onClick={(e) => handleLinkClick(CONSTANTS.COMPANY_DETAILS.PLAY_STORE, e)}>
          <img src={playstore} alt="playstore" width={120} className="mb-2 img-fluid icon-enlarge"/>
          </Link>
         
          </div>   
          <div>

          <p className="fs-14px me-1">Recognized By <img src={startupLogo} className="img-fluid img-sizing" alt="startup india logo" /></p>
          <p className="fs-14px me-1"><img src={opdlogo} className="img-fluid rounded-3 img-margin" alt="opd sure logo" style={{width: 220}}/> </p>  

          </div>  

          <div className="d-flex gap-1 p-0 align-items-center mb-3">
              <Link to={CONSTANTS.COMPANY_DETAILS.LINKEDIN} target="_blank">
                <img src={linkedin} alt="linkedin icon" className="icon-enlarge" width={"35px"}/>
              </Link>
              <Link to={CONSTANTS.COMPANY_DETAILS.FACEBOOK} target="_blank">
                <img src={facebook} alt="facebook icon" className="icon-enlarge" width={"35px"}/>
              </Link>
              <Link to={CONSTANTS.COMPANY_DETAILS.INSTAGRAM} target="_blank">
                <img src={instagram} alt="instagram icon" className="icon-enlarge" width={"35px"}/>             
              </Link>
              <Link to={CONSTANTS.COMPANY_DETAILS.YOUTUBE} target="_blank">
                <img src={youtube} alt="youtube icon" className="icon-enlarge" width={"35px"}/>
              </Link>
              <Link to={CONSTANTS.COMPANY_DETAILS.TWITTER} target="_blank">
              <FontAwesomeIcon icon={faSquareXTwitter} size="2xl" className="icon-enlarge text-white" width={"35px"}/> 
              </Link>

            
              {/* <p className="fs-14px me-1">Recognized By <img src={startupLogo} className="img-fluid w-75 h-50" alt="startup india logo" /></p> */}
            </div>
          </div>
          
          </div>
        
      </div>
    </>
  );
};

export default Footer;
