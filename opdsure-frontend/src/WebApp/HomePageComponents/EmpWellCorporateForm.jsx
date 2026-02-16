import React, { useEffect, useState } from "react";
import { Button, Input, Space, notification, Form, Col, Row, Select } from "antd";
import { Axios } from "../../axios/axiosFunctions";
import config from "../../config/config";
import CONSTANTS from "../../constant/Constants";
import codes from "country-calling-code";
import { useLocation,useNavigate } from "react-router-dom";

const { Option } = Select;

const EmpWellCorporateForm = () => {
  const navigate = useNavigate();
  const [corporateForm] = Form.useForm();
  const location = useLocation();
  const [homepage, setHomepage] = useState(false);

  const onCorporateFormFinish = async (values) => {
    const { phone, ...value } = values;
    const { country_code, number } = values.phone;
    const phoneString = `${country_code}${number}`;
    const response = await Axios.postAxiosData(
      config.ContactUsCorporate,
      { ...value, phone: phoneString }
    );

    if (response.success === true) {
      notification.success({
        message: "Thank you for your interest. We will get back to you soon.",
      });

      corporateForm.resetFields();
      navigate("/thank-you")
    } else {
      notification.error({
        message: response.message,
      });
    }
  };
  useEffect(() => {
    if (location.pathname === '/homepage') {
      setHomepage(true);
    } 
    else if (location.pathname === '/'){
      setHomepage(true);
    }
    else {
      setHomepage(false);
    }
  }, [location.pathname]); 
 
  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-center">
        {!homepage ?
      <>
       <h1 className="text-white mt-5 text-center mb-3 fw-700 fs-32px " style={{zIndex: "100"}}>
              Employee Health and Wellness Program!
            </h1>
      </>  
      :<></>
      }
          
        <div className="col-lg-11 col-md-10 col-12">
          <Form
            form={corporateForm}
            layout="vertical"
            onFinish={onCorporateFormFinish}
            requiredMark={false}
            initialValues={{
              phone: {
                country_code: "+91",
              },
            }}
          >
            <Row gutter={16} justify={"center"}>
              <Col lg={6} md={12} xs={24}>
                <Form.Item
                  name="name"
                  rules={[
                    { required: true, message: "Please enter your name" },
                  ]}
                  label={
                    <span className="text-white fw-lighter">
                      Employee Name
                    </span>
                  }
                >
                  <Input placeholder="Employee Name" />
                </Form.Item>
              </Col>
              <Col lg={6} md={12} xs={24}>
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
              <Col lg={6} md={12} xs={24}>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    {
                      type: "email",
                      message: "Please enter a valid email address",
                    },
                  ]}
                  label={
                    <span className="text-white fw-lighter">
                      Business Email
                    </span>
                  }
                >
                  <Input placeholder="Business Email" />
                </Form.Item>
              </Col>
            </Row>


            <Row gutter={16} justify={"center"}>
              <Col lg={6} md={12} xs={24}>
                <Form.Item
                  name="designation"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your designation",
                    },
                  ]}
                  label={
                    <span className="text-white fw-lighter">Designation</span>
                  }
                >
                  <Input placeholder="Designation" />
                </Form.Item>
              </Col>
              <Col lg={6} md={12} xs={24}>
                <Form.Item
                  name="organization"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your organization",
                    },
                  ]}
                  label={
                    <span className="text-white fw-lighter">
                      Organization
                    </span>
                  }
                >
                  <Input placeholder="Organisation" />
                </Form.Item>
              </Col>
              <Col lg={6} md={12} xs={24}>
                <Form.Item
                  name="employees"
                  rules={[
                    {
                      required: true,
                      message: "Please enter number of employees",
                    },
                  ]}
                  label={
                    <span className="text-white fw-lighter">
                      No. of Employees
                    </span>
                  }
                >
                  <Select
                    className="text-start"
                    showSearch
                    placeholder="Select"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0

                    }
                    style={{ width: "35%" }}
                  >
                    {CONSTANTS.NO_OF_EMPLOYEES_OPTIONS?.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} justify={"center"}>
              <Col lg={6} md={12} xs={24}>
                <Form.Item
                  name="hear"
                  rules={[
                    { required: true, message: "Please select option" },
                  ]}
                  label={
                    <span className="text-white fw-lighter">
                      Where did you hear about us from?
                    </span>
                  }
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
                <Col lg={6} md={12} xs={24}>
                  <Form.Item
                    name="message"
                    rules={[
                      { required: true, message: "Please enter your message" },
                    ]}
                    label={
                      <span className="text-white fw-lighter">How can we help you ?</span>

                    }
                  >
                    <Input.TextArea
                      placeholder="Message here ..."
                      autoSize
                    />
                </Form.Item>
              </Col>
              <Col lg={6} md={12} xs={24}>
              </Col>
            </Row>

            <Row  gutter={16} justify="center">
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

export default EmpWellCorporateForm;
