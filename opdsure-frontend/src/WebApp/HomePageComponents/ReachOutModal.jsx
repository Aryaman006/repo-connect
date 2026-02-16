import React, { useState } from "react";
import { Button, Modal, Form, Row, Col, Input, Select, Checkbox, notification, Space } from "antd";
import {Link} from 'react-router-dom';
import codes from "country-calling-code";
import config from "../../config/config";
import CONSTANTS from "../../constant/Constants";
import { Axios } from "../../axios/axiosFunctions";
import { useNavigate } from "react-router-dom";

const ReachOutModal = ({ visible, onClose }) => {
  const navigate = useNavigate();
  const [reachOutForm] = Form.useForm();
  const [agreedTerms, setAgreedTerms] = useState(false);
  const handleOk = () => {
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleReachOutSubmit = async(values) => {
    const {phone, ...value} = values;
    const { country_code, number } = values.phone;
    const phoneString = `${country_code}${number}`;
    const response = await Axios.postAxiosData(config.ContactUsRetail,  {...value,phone:phoneString});
    if (response.success === true) {
      notification.success({
        message: "Thank you for your interest. We will get back to you soon.",
      });
      reachOutForm.resetFields();
      sessionStorage.setItem('modalClosed', 'true');
      navigate("/thank-you")
    } else {
      notification.error({
        message: response.message,
      });
    }
    handleCancel();
  };
  const handleCheckboxChange = (e) => {
    setAgreedTerms(e.target.checked);
  };
  const getModalWidth = () => {
    if (window.innerWidth < 576) return '90vw'; 
    if (window.innerWidth < 768) return '80vw'; 
    if (window.innerWidth < 992) return '70vw'; 
    if (window.innerWidth < 1200) return '30vw'; 
    return '30vw';
  };
  return (
    <>
    <style>
        {`
           .ant-modal-content {
            background-color: #243673 !important;
          }
            .ant-modal-close {
            color: #ffffff !important;
            width: 24.67px !important;
            height: 24.67px !important;
            }
        `}
      </style>
    
    {/* <Modal
      title= {<h3 className="fw-600 text-white bg-243673 px-5 pt-4">Get Quote</h3>}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      centered
      width={getModalWidth()}
    >
     <div className="container">
      <div className="row">
      <Form
        form={reachOutForm}
        layout="vertical"
        onFinish={handleReachOutSubmit}
        className="bg-243673 px-3"
        initialValues={{
          phone: {
            country_code: "+91",
          },
        }}
        requiredMark={false}
      >
        <Row gutter={16} className="mb-0" justify="center">
          <Col span={20}>
            <Form.Item
              name="name"
              label={<span className="text-white fw-lighter">Full Name</span>}
              style={{ marginBottom: "0.5rem" }}
              rules={[{ required: true, message: "Please enter your first name" }]}
            >
              <Input placeholder="Full Name" />
            </Form.Item>
          </Col>
        </Row>
 <Row justify="center" >
          <Col span={20}>
            <Form.Item
              label={<span className="text-white fw-lighter">Mobile</span>}
              style={{ marginBottom: "0.5rem", 
                // width: "72%" 
              }}
            >
              <Space.Compact>
                     <Form.Item
                       name={["phone", "country_code"]}
                       noStyle
                       rules={[
                         {
                           required: true,
                           message: "Country code is required",
                         },
                         {
                           pattern: CONSTANTS.REGEX.COUNTRY_CODE,
                           message: "Invalid country code",
                         },
                       ]}
                       style={{ width: "45%" }}
                     >
                       <Select
                       className="bg-white rounded-2"
                     showSearch
                     optionFilterProp="children"
                     filterOption={(input, option) =>
                       option.children
                         .toLowerCase()
                         .indexOf(input.toLowerCase()) >= 0
                     }
                     placeholder="code"
                     
                     disabled
                   >
                     {codes?.map((country) => (
                       <Option
                         key={country.isoCode2}
                         value={country.countryCodes[0]}
                       >
                         {`+${country.countryCodes[0]}`}
                       </Option>
                     ))}
                   </Select>
                     </Form.Item>
                     <Form.Item
                       name={["phone", "number"]}
                       noStyle
                       rules={[
                         {
                           required: true,
                           message: "Mobile no. is required",
                         },
                         {
                           pattern: CONSTANTS.REGEX.PHONE,
                           message: "Please enter a valid number",
                         },
                       ]}
                     >
                       <Input
                         placeholder="Mobile No."
                         className="mobile-input1"
                         maxLength={10}
                       />
                     </Form.Item>
                   </Space.Compact>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col span={20}>
            <Form.Item
              name="email"
              label={<span className="text-white fw-lighter">Email</span>}
              style={{ marginBottom: "0.5rem" }}
              rules={[{ type: "email", message: "Please enter a valid email" },
              { required: true, message: "Please enter your email" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col span={20}>
            <Form.Item
              name="hear"
              label={<span className="text-white fw-lighter">Where did you hear about us from?</span>}
              style={{ marginBottom: "0.5rem" }}
              rules={[{ required: true, message: "Please select an option" }]}
            >
              <Select
                    className="text-start"
                      showSearch
                      placeholder="Select an option"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {CONSTANTS.HEAR_OPTIONS?.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col span={10}>
            <Form.Item>
              <Button
                htmlType="submit"
                className="border-0 bg-5dadec text-white my-3 fs-16px"
                block
              >
                Send Message
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      </div>
     </div>   
    </Modal> */}

<Modal
  title={<h3 className="fw-600 text-white bg-243673 px-5 pt-4">Get Quote</h3>}
  open={visible}
  onOk={handleOk}
  onCancel={handleCancel}
  footer={null}
  centered
  width={getModalWidth()}
>
  <div className="container">
    <div className="row">
      <Form
        form={reachOutForm}
        layout="vertical"
        onFinish={handleReachOutSubmit}
        className="bg-243673 px-3"
        initialValues={{
          phone: {
            country_code: "+91",
          },
        }}
        requiredMark={false}
      >
        <Row gutter={16} className="mb-0" justify="center">
          <Col xs={24} sm={20}>
            <Form.Item
              name="name"
              label={<span className="text-white fw-lighter">Full Name</span>}
              style={{ marginBottom: "0.5rem" }}
              rules={[{ required: true, message: "Please enter your first name" }]}
            >
              <Input placeholder="Full Name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} justify="center" className="mb-0">
          <Col xs={24} sm={20}>
            <Form.Item
              label={<span className="text-white fw-lighter">Mobile</span>}
              style={{ marginBottom: "0.5rem" }}
            >
              <Space.Compact>
                <Form.Item
                  name={["phone", "country_code"]}
                  noStyle
                  rules={[
                    { required: true, message: "Country code is required" },
                    { pattern: CONSTANTS.REGEX.COUNTRY_CODE, message: "Invalid country code" },
                  ]}
                >
                  <Select
                    className="bg-white rounded-2"
                    showSearch
                    optionFilterProp="children"
                    placeholder="Code"
                    disabled
                  >
                    {codes?.map((country) => (
                      <Option key={country.isoCode2} value={country.countryCodes[0]}>
                        {`+${country.countryCodes[0]}`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name={["phone", "number"]}
                  noStyle
                  rules={[
                    { required: true, message: "Mobile no. is required" },
                    { pattern: CONSTANTS.REGEX.PHONE, message: "Please enter a valid number" },
                  ]}
                >
                  <Input placeholder="Mobile No." className="mobile-input1" maxLength={10} />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center">
          <Col xs={24} sm={20}>
            <Form.Item
              name="email"
              label={<span className="text-white fw-lighter">Email</span>}
              style={{ marginBottom: "0.5rem" }}
              rules={[
                { type: "email", message: "Please enter a valid email" },
                { required: true, message: "Please enter your email" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center">
          <Col xs={24} sm={20}>
            <Form.Item
              name="hear"
              label={<span className="text-white fw-lighter">Where did you hear about us from?</span>}
              style={{ marginBottom: "0.5rem" }}
              rules={[{ required: true, message: "Please select an option" }]}
            >
              <Select
                className="text-start"
                showSearch
                placeholder="Select an option"
                optionFilterProp="children"
              >
                {CONSTANTS.HEAR_OPTIONS?.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center">
          <Col xs={24} sm={10}>
            <Form.Item>
              <Button htmlType="submit" className="border-0 bg-5dadec text-white my-3 fs-16px" block>
                Send Message
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  </div>

  <style jsx>{`
    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }
      .ant-modal {
        width: 90% !important;
        max-width: 100%;
      }
      .ant-form-item {
        margin-bottom: 1rem !important;
      }
      .text-white {
        font-size: 0.9rem;
      }
      .mobile-input1 {
        width: 100%;
      }
      .ant-btn {
        font-size: 0.875rem;
      }
    }

    @media (min-width: 769px) {
      .container {
        padding: 0 2rem;
      }
      .ant-modal {
        width: 600px !important;
      }
    }
  `}</style>
</Modal>
    </>
  );
};

export default ReachOutModal;
