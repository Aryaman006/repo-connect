import React from "react";
import { Button, Input, Space, notification, Form, Col, Row, Select } from "antd";
import { Axios } from "../../axios/axiosFunctions";
import config from "../../config/config";
import CONSTANTS from "../../constant/Constants";
import codes from "country-calling-code";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const EmpWellRetailForm = () => {
  const navigate= useNavigate();
  const [retailForm] = Form.useForm();

  const onRetailFormFinish = async (values) => {
    const { phone, ...value } = values;
    const { country_code, number } = values.phone;
    const phoneString = `${country_code}${number}`;
    const response = await Axios.postAxiosData(
      config.ContactUsRetail,
      { ...value, phone: phoneString }
    );

    if (response.success === true) {
      notification.success({
        message: "Thank you for your interest. We will get back to you soon.",
      });

      retailForm.resetFields();
      navigate("/thank-you")
    } else {
      notification.error({
        message: response.message,
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-center">
        <div className="col-lg-10 col-md-10 col-12">
          <Form
            form={retailForm}
            layout="vertical"
            onFinish={onRetailFormFinish}
            initialValues={{
              phone: {
                country_code: "+91",
              },
            }}
            requiredMark={false}
          >
            <Row gutter={16} justify="center">
              <Col lg={6} md={8} xs={24}>
                <Form.Item
                  name="name"
                  label={<span className="text-white fw-lighter">Name</span>}
                  rules={[
                    {
                      required: true,
                      message: "Please enter your name",
                    },
                  ]}
                >
                  <Input placeholder="Name" />
                </Form.Item>
              </Col>
              <Col lg={6} md={8} xs={24}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please enter your phone number",
                    },
                  ]}
                  label={
                    <span className="text-white fw-lighter">Mobile No.</span>
                  }
                >
                  <Space.Compact style={{width:"100%"}}>
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
                        style={{ width: "50%" }}
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
                          message: "Please enter a valid mobile number",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Mobile No."
                        className="mobile-input"
                        maxLength={10}
                      />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </Col>
              <Col lg={6} md={8} xs={24}>
                <Form.Item
                  name="email"
                  label={<span className="text-white fw-lighter">Email</span>}
                  rules={[
                    {
                      required: true,
                      message: "Please enter your email",
                    },
                    {
                      type: "email",
                      message: "Please enter a valid email address",
                    },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
              </Col>
              
              </Row>

<Row gutter={16} justify="center">
              <Col lg={6} md={8} xs={24}>
                <Form.Item
                  name="hear"
                  label={
                    <span className="text-white fw-lighter">
                      Where did you hear about us from?
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please select an option",
                    },
                  ]}
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
              <Col lg={6} md={8} xs={24}>
                <Form.Item
                  name="message"
                  label={
                    <span className="text-white fw-lighter">How can we help you?</span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter your message",
                    },
                  ]}
                >
                   <Input.TextArea
                      placeholder="Message here ..."
                      autoSize
                    />
                </Form.Item>
              </Col>
              <Col lg={6} md={8} xs={24}>
              
              </Col>
            </Row>

            <Row gutter={16} justify="center">
              <Col className="col-lg-2 col-md-3 col-12">
                <Form.Item>
                  <Button
                    className="bg-5dadec text-white border-0 my-4 fs-18px py-4"
                    htmlType="submit"
                    block
                  >
                    SUBMIT
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EmpWellRetailForm;
