import React, { useState, useEffect } from "react";
import CONSTANTS from "../../constant/Constants";
import retailPhotoNew from "../Assets/retail_photo_new.png";
import corporatePhotoNew from "../Assets/corporate_photo_new.png";
import shareicon from "../Assets/shareicon.png";
import { Button, Col, Form, Row, Input, Select, notification, Space } from "antd";
import { Axios } from "../../axios/axiosFunctions";
import config from "../../config/config";
import codes from "country-calling-code";
import { useLocation,useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import EmpWellCorporateForm from "../HomePageComponents/EmpWellCorporateForm"; 
import EmpWellRetailForm from "../HomePageComponents/EmpWellRetailForm"; 
import ContactUsImg from "../Assets/contactusImg.svg";
import Screenshot from "../Assets/Screenshot.png"

const ContactUsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
  }, []);
    const [isCorporateForm, setIsCorporateForm] = useState(true);
    const [ContactUsPageform] = Form.useForm();
    const navigate = useNavigate();

  const handleFormChange = (formType) => {
    setIsCorporateForm(formType === 'corporate');
  };

const ContactUsPageformSubmit = async (values) => {
  const {phone, ...value} = values;
    const { country_code, number } = values.phone;
    const phoneString = `${country_code}${number}`;
  const url = isCorporateForm ? config.ContactUsCorporate : config.ContactUsRetail;
  const response = await Axios.postAxiosData(url,  {...value, phone:phoneString});
  if (response.success === true) {
    notification.success({
      message: "Thank you for your interest. We will get back to you soon.",
    });
    ContactUsPageform.resetFields();
    navigate("/thank-you");
  } else {
    notification.error({
      message: response.message,
    });
  }
};

const [aboutusPage, setAboutusPage] = useState(false);

useEffect(() => { 
  if(window.location.pathname === '/about-us'){
    setAboutusPage(true);
  }

}, []);

  return (
    <>

<div className="my-4 py-4">
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39674.697384424486!2d77.39887362180099!3d28.48614292341985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce22ccdc55555%3A0xd33ffe428d6036dc!2sOPDSure!5e0!3m2!1sen!2sin!4v1731998287992!5m2!1sen!2sin" width="100%" height="450"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>
   <div className={`${aboutusPage ? "container" : "container-fluid bg-gradient-light"} pt-0 px-0 pb-5`}>
    <div className={`row rounded-5 align-items-center ${aboutusPage ? "p-lg-3 d-flex justify-content-center" : "p-lg-3"} p-md-3 p-2 mx-lg-5 mx-md-4 mx-2`}>
      
      <div className={`col-lg-6 col-12 d-flex justify-content-center`}>
        <img 
          src={isCorporateForm ? corporatePhotoNew : retailPhotoNew} 
          alt="contact us" 
          className="img-fluid border rounded" 
          style={{ height: '100%', objectFit: 'cover' }} 
        />
      </div>
      
      <div className={`col-lg-5 col-12 rounded-4 border border-1 p-5 d-flex align-items-center`} style={{ minHeight: '400px' }}>
        <div className="w-100">
          <p className="fw-600 fs-32px mb-0">Book a Demo</p>
          {
            isCorporateForm?
            <p className="mb-5">Simplify and make your employee health benefits affordable, all while providing an exceptional customer experience.</p>
             :
            <p className="mb-5">OPDSure, offering a comprehensive solution for Individual and Family that blends doctor consultations with preventive</p>
          }
          
          <div className="col-12 d-flex justify-content-center gap-4 mt-3">
            <Button 
              className={`${isCorporateForm ? 'bg-4a68b1 text-eeeeee' : 'bg-eeeeee button-border'} col-5`} 
              onClick={() => handleFormChange('corporate')}
            >
              Corporate
            </Button>
            <Button 
              className={`${!isCorporateForm ? 'bg-4a68b1 text-eeeeee' : 'bg-eeeeee button-border'} ms-3 col-5`} 
              onClick={() => handleFormChange('retail')}
            >
              Retail
            </Button>
          </div>

          <Form
            form={ContactUsPageform}
            layout="vertical"
            onFinish={ContactUsPageformSubmit}
            requiredMark={false}
            initialValues={{
              phone: {
                country_code: "+91",
              },
            }}
          >
            <Row className="mt-4">
              <Col span={24}>
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: "Please enter your name" }]}
                  className="form-item-margin-bottom"
                >
                  <Input placeholder="Your Name" variant="borderless" className="input-border" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item className="form-item-margin-bottom" rules={[{ required: true, message: "Please enter your phone number" }]}>
                  <Space.Compact>
                    <Form.Item name={["phone", "country_code"]} noStyle rules={[{ required: true, message: "Country code is required" }, { pattern: CONSTANTS.REGEX.COUNTRY_CODE, message: "Invalid country code" }]} className="form-item-margin-bottom">
                      <Select className="input-border" variant="borderless" showSearch optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} placeholder="code" style={{ width: "30%" }} disabled>
                        {codes?.map((country) => (
                          <Option key={country.isoCode2} value={country.countryCodes[0]}>
                            {`+${country.countryCodes[0]}`}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name={["phone", "number"]} noStyle rules={[{ required: true, message: "Mobile no. is required" }, { pattern: CONSTANTS.REGEX.PHONE, message: "Invalid mobile no.!" }]} className="form-item-margin-bottom">
                      <Input placeholder="Mobile No."  variant="borderless" className="input-border" />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Please enter a valid email address" }]}
                  className="form-item-margin-bottom"
                >
                  <Input placeholder="Your Email" variant="borderless" className="input-border" />
                </Form.Item>
              </Col>
            </Row>
            {isCorporateForm && (
              <>
                <Row>
                  <Col span={24}>
                    <Form.Item name="designation" rules={[{ required: true, message: "Please enter your designation" }]} className="form-item-margin-bottom">
                      <Input placeholder="Designation" variant="borderless" className="input-border" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name="organization" rules={[{ required: true, message: "Please enter your organization" }]} className="form-item-margin-bottom">
                      <Input placeholder="Organisation" variant="borderless" className="input-border" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name="employees" rules={[{ required: true, message: "Please enter number of employees" }]} className="form-item-margin-bottom">
                      <Select className="text-start input-border" variant="borderless" showSearch placeholder="No. of employees" optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: "35%" }}>
                        {CONSTANTS.NO_OF_EMPLOYEES_OPTIONS?.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
            <Row>
              <Col span={24}>
                <Form.Item name="hear" rules={[{ required: true, message: "Please select option" }]} className="form-item-margin-bottom">
                  <Select className="text-start input-border" showSearch placeholder="Where did you hear about us from?" optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} variant="borderless">
                    {CONSTANTS.HEAR_OPTIONS?.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name="message" rules={[{ required: true, message: "Please enter your message" }]} className="form-item-margin-bottom">
                  <Input placeholder="Message here..." variant="borderless" className="input-border" />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="start">
              <Col justify="start" className="col-lg-4 col-md-4 col-12">
                <Form.Item>
                  <Button className="bg-4a68b1 text-eeeeee border-0 mt-3 px-6 py-4 rounded-3" htmlType="submit" block style={{width:"9rem"}}>
                    <img src={shareicon} alt="share icon"/> Send Message
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  </div>


    </>
  );
};

export default ContactUsPage;
