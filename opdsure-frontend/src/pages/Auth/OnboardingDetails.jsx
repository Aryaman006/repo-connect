import React, { useState } from "react";
import { Input, Button, Form, Row, Col, Select, notification } from "antd";
import codes from "country-calling-code";
import { useNavigate, useLocation } from "react-router-dom";
import { Axios } from "../../axios/axiosFunctions";
import config from "../../config/config";
import opdlogo from "../../assets/opdlogo.png";

const OnboardingDetails = () => {
  const [OnboardingForm] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { signupWithEmail } = location.state || {};
  const onFinish = async(values) => {
    const formValues = {}
    formValues.name = values.first_name
    if(values.middle_name){
      formValues.name = `${formValues.name} ${values.middle_name}`
    }
    if(values.last_name){
      formValues.name = `${formValues.name} ${values.last_name}`
    }
    if(values.email){
      formValues.email = values.email
    }
    if (values.phone) {
      formValues.phone = values.phone
    }
    if(values.country_code){
      formValues.country_code = values.country_code
    }
    const result = await Axios.putAxiosData(config.UpdateProfile, formValues);
    if(result.success === true){
      notification.success({
        message: "Profile updated successfully",
      });
      navigate("/user/tips");
    }
    else{
      notification.error({
        message: result.message,
      });
    }
  };

  return (
    <>
      <div className="container-fluid bg-light-blue"style={{ height: "100vh" }}>
        <div
          className="row d-flex justify-content-center align-items-center"
          style={{ height: "90vh" }}
        >
          <div
            className="col-lg-4 col-md-8 col-12 rounded-3 border-0 mx-auto"
            style={{ height: "50vh" }}
          >
            <div className="col-3 mx-auto mb-3">
          <img src={opdlogo} width={130} height={40} alt="logo" />
           </div>
            <h4 className="text-center">Welcome To OPD Sure</h4>
            <p className="text-center my-auto text-secondary mb-5">
              Enter Required Details.
            </p>

            <Form onFinish={onFinish} form={OnboardingForm}
             initialValues={{country_code : "+91"} }>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="first_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your first name.",
                      },
                    ]}
                  >
                    <Input type="text" placeholder="Enter First Name*" />
                  </Form.Item>
                </Col>
                
               
              </Row>
              <Row>
              <Col span={24}>
                  <Form.Item name="middle_name">
                    <Input type="text" placeholder="Enter Middle Name" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
              <Col span={24}>
                  <Form.Item name="last_name">
                    <Input type="text" placeholder="Enter Last Name" />
                  </Form.Item>
                </Col>
              </Row>
              {signupWithEmail? (
                <>
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Please input your email.",
                          },
                          { type: "email", message: "Enter valid E-mail!" },
                        ]}
                      >
                        <Input
                          // type='email'
                          placeholder="Enter Email address*"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Row gutter={0}>
                    <Col span={5}>
                      <Form.Item
                        name="country_code"
                        rules={[{ required: true }]}
                        style={{ margin: 0, padding: 0 }}
                      >
                        <Select
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          placeholder="code"
                          style={{ width: "100%" }}
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
                    </Col>
                    <Col span={19}>
                      <Form.Item
                        name="phone"
                        colon={false}
                        rules={[
                          { required: true, message: "Mobile is required" },
                          {
                            pattern: /^[0-9]+$/,
                            message: "Mobile no. must be digits",
                          },
                        ]}
                        style={{ padding: 0 }}
                        labelCol={{ span: 0 }}
                      >
                        <Input
                          type="tel"
                          style={{
                            width: "100%",
                          }}
                          placeholder="Enter your mobile no."
                          maxLength={13}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}

              <Row>
                <Col span={24}>
                  <Form.Item className="mt-3">
                    <Button type="primary" htmlType="submit" block>
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingDetails;
