import React, { useState, useEffect } from "react";
import {
  Form,
  Col,
  Row,
  Input,
  Select,
  InputNumber,
  Space,
  notification,
  Button,
} from "antd";
import CONSTANTS from "../../constant/Constants";
import STATES from "../../constant/States";
import { Axios } from "../../axios/axiosFunctions";
const { Search, TextArea } = Input;
const { Option } = Select;
import codes from "country-calling-code";
import config from "../../config/config";

const JoinUsPage = () => {
  const [joinUsForm] = Form.useForm();
  const [specializationList, setSpecializationList] = useState([]);

  const fetchSpecialization = async () => {
    const response = await Axios.fetchAxiosData(config.GetAllSpecialization, {
      params: { pageSize: 1000 },
    });
    setSpecializationList(response?.data?.records);
  };

  useEffect(() => {
    fetchSpecialization();
  }, []);

  const DoctorFormSubmit = async () => {
    const values = await joinUsForm.validateFields();
    const response = await Axios.postAxiosData(config.RegisterDoctor, {
      name: values.name,
      reg_no: values.reg_no,
      specialization: values.specialization,
      exp: values.exp,
      hospital: values.hospital,
      address: values.address,
      state: values.state,
      mobile: values.mobile.number,
      country_code: values.mobile.code,
      email: values.email,
      status: values.status,
    });

    joinUsForm.resetFields();
    if (response.success === true) {
      notification.success({
        message: "You are Registered Successfully",
      });
    } else {
      notification.error({
        message: response.message,
      });
    }
  };
  return (
    <>
      <div className="container-fluid bg-gradient-light">
        <div className="row">
          <div className="col-12">
           <h1 className="text-center mt-5 fw-600 text-dark">Only For Doctors</h1>
          </div>
        </div>
        <div className="row pt-3 pb-5">
          <div className="col-lg-8 col-md-8 col-12 mx-auto mt-4">
            <Form
              layout="vertical"
              form={joinUsForm}
              onFinish={DoctorFormSubmit}
              initialValues={{
                mobile: {
                  code: "+91",
                },
              }}
              requiredMark={false}
            >
              <Row gutter={16}>
                <Col lg={8} md={12} xs={24}>
                  <Form.Item
                    name="name"
                    label={
                      <span className="fw-lighter text-dark">Name</span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please enter name !",
                      },
                      {
                        pattern: /^(?!\s*$)[a-zA-Z0-9\s()_,&/-]*$/, // Allow forward slash
                        message: "Special character not allowed or just spaces.",
                      },
                    ]}
                  >
                    <Input placeholder="Full Name" />
                  </Form.Item>
                </Col>
                <Col lg={8} md={12} xs={24}>
                  <Form.Item
                    label={
                      <span className="fw-lighter text-dark">Reg. No.</span>
                    }
                    name="reg_no"
                    rules={[
                      {
                        required: true,
                        message: "Please enter registration no !",
                      },
                      {
                        pattern: /^(?!\s*$)[a-zA-Z0-9\s()_,&/-]*$/, // Allow forward slash
                        message: "Special character not allowed or just spaces.",
                      },
                    ]}
                    // labelCol={{ span: 5, offset: 2 }}
                  >
                    <Input placeholder="Enter registration no." />
                  </Form.Item>
                </Col>
                <Col lg={8} md={12} xs={24}>
                  <Form.Item
                    label={
                      <span className="fw-lighter text-dark">Specialization</span>
                    }
                    name="specialization"
                    rules={[
                      {
                        required: true,
                        message: "Please enter specialization !",
                      },
                    ]}
                    // labelCol={{ span: 5, offset: 2 }}
                  >
                    {/* <Input placeholder="Enter specialization" /> */}
                    <Select placeholder="Select Specialization">
                      {specializationList?.map((s) => (
                        <Option key={s._id} value={s.name} label={s.name}>
                          {s.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              {/* </Row>
              <Row gutter={16}> */}
                <Col lg={8} md={12} xs={24}>
             
                  <Form.Item
                    label={
                      <span className="fw-lighter text-dark">Mobile</span>
                    }
                    style={{ width: "100%" }}
                    // labelCol={{ span: 5, offset: 2 }}
                  >
                    <Space.Compact>
                      <Form.Item
                        name={["mobile", "code"]}
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
                        {/* <Input style={{ width: "25%" }} placeholder="Code" /> */}
                        <Select
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          defaultValue="+91"
                          placeholder="code"
                          style={{ width: "40%" }}
                          disabled
                          className="bg-white border-0 rounded-1" 
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
                        name={["mobile", "number"]}
                        noStyle
                        rules={[
                          {
                            required: true,
                            message: "Mobile number is required",
                          },
                          {
                            pattern: CONSTANTS.REGEX.PHONE,
                            message: "Please enter a valid number",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Mobile No."
                          // style={{
                          //   minWidth: "98%",
                          // }}
                         className="mobile-input2"
                         maxLength={10}
                        />
                      </Form.Item>
                    </Space.Compact>
                  </Form.Item>
               
                </Col>
                <Col lg={8} md={12} xs={24}>
                  <Form.Item
                    label={
                      <span className="fw-lighter text-dark">Email</span>
                    }
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please enter email!",
                      },
                      {
                        type: "email",
                        message: "Invalid email!",
                      },
                    ]}
                    // labelCol={{ span: 5, offset: 2 }}
                  >
                    <Input placeholder="Enter email" />
                  </Form.Item>
                </Col>
                <Col lg={8} md={12} xs={24}>
                  <Form.Item
                    label={
                      <span className="fw-lighter text-dark">Experience</span>
                    }
                    name="exp"
                    rules={[
                      {
                        required: true,
                        message: "Please enter experience!",
                      },
                      {
                        type: "number",
                        min: 0,
                        message: "Min exp should be greater than 0.",
                      },
                      {
                        type: "number",
                        max: 99,
                        message: "Max exp should be less than 99.",
                      },
                    ]}
                    // labelCol={{ span: 5, offset: 2 }}
                  >
                    <InputNumber placeholder="Enter experience"  style={{ width: "40%" }}/>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
               
               
              </Row>
              <Row gutter={16}>
                <Col lg={8} md={12} xs={24}>
                <Form.Item
                    label={
                      <span className="fw-lighter text-dark">Hospital</span>
                    }
                    name="hospital"
                    rules={[
                      {
                        required: true,
                        message: "Please enter hospital !",
                      },
                      {
                        max: 100,
                        message: "Name must not exceed 100 characters!",
                      },
                      {
                        pattern: /^(?!\s*$)[a-zA-Z0-9\s()_,&-]*$/,
                        message: "Special character not allowed or just spaces",
                      },
                    ]}
                    // labelCol={{ span: 5, offset: 2 }}
                  >
                    <Input placeholder="Enter hospital name" />
                  </Form.Item>
                </Col>
                <Col lg={8} md={12} xs={24}>
                  <Form.Item
                    label={
                      <span className="fw-lighter text-dark">State</span>
                    }
                    name="state"
                    rules={[
                      {
                        required: true,
                        message: "Please select state !",
                      },
                      {
                        pattern: /^(?!\s*$)[a-zA-Z0-9\s()_,&/-]*$/,
                        message: "Special character not allowed or just spaces",
                      },
                    ]}
                    labelCol={{ span: 5, offset: 2 }}
                  >
                    <Select
                      placeholder="Select State"
                      allowClear
                      style={{ width: "100%" }}
                    >
                      {STATES.map((state) => (
                        <Option
                          key={state.id}
                          value={state.id}
                          label={state.name}
                        >
                          {state.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col lg={8} md={12} xs={24}>
                  <Form.Item
                    label={
                      <span className="fw-lighter text-dark">Address</span>
                    }
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: "Please enter address name !",
                      },
                      {
                        max: CONSTANTS.STRING_LEN.ADDRESS,
                        message: `Adress must not exceed ${CONSTANTS.STRING_LEN.ADDRESS} characters!`,
                      },

                      {
                        pattern: CONSTANTS.REGEX.ADDRESS,
                        message: "Please provide valid address!",
                      },
                    ]}
                    // labelCol={{ span: 5, offset: 2 }}
                  >
                    <TextArea
                      showCount
                      maxLength={CONSTANTS.STRING_LEN.ADDRESS}
                      placeholder="Enter address"
                      style={{
                        height: 50,
                        resize: "none",
                      }}
                    />
                  </Form.Item>
                </Col>
               
              </Row>
              <Row>
               
              </Row>

              <Row justify={"center"} gutter={16} className="mt-2">
                <Col lg={8} md={12} xs={24}>
                  <Form.Item>
                    <Button className="bg-5dadec text-white fs-18px border-0" htmlType="submit" block>
                      SUBMIT
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

export default JoinUsPage;
