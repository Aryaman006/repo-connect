import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, notification, Row, Col, Select, Checkbox } from "antd";
import { UserAddOutlined, LoginOutlined } from "@ant-design/icons";
import {Axios} from "../../axios/axiosFunctions";
import codes from "country-calling-code";
import config from "../../config/config";
import loginimg from "../../assets/loginimg.png";
import threeline from "../../assets/threeline.png";
import opdlogo from "../../assets/opdlogo.png";
export default function UserSignup() {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmitSignup = async (values) => {
    try {

      if (!agreedTerms) {
        notification.error({
          message: "Please agree to Terms and Conditions",
        });
        return; 
      }

      values.terms_and_condition = true;

      const result = await Axios.postAxiosData(config.UserSignup, values);

      if (result.success === true) {
        notification.success({
          message: "Signup Successful",
        });

        navigate("/user/login");
      }
    } catch (error) {
      notification.error({
        message: error.response.data.message,
      });
    }
  };
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };
// for terms and conditions
const handleCheckboxChange = (e) => {
  setAgreedTerms(e.target.checked); // Update state based on checkbox checked status
};

  return (
    <div className="container-fluid bggrey py-3" style={{ height: "100vh" }}>
      <div className="row rounded-4 h-20 d-flex justify-content-around align-items-center mb-5 bg-white shadow-sm py-2 mx-5 mb-5">
        <div className="col-5">
          <img src={opdlogo} width={100} height={30} alt="logo" />
        </div>
        <div className="col-6 d-flex gap-3">
          <Link to="/user/signup" className="text-decoration-none">
            <p className="text-center">
              <UserAddOutlined className="text-secondary me-2" />
              Sign Up
            </p>
          </Link>
          <Link to="/user/login" className="text-decoration-none">
            <p className="text-center">
              <LoginOutlined className="text-secondary me-2" />
              Sign In
            </p>
          </Link>
        </div>
        <div className="col-1">
          <Button type="primary">Go Back</Button>
        </div>
      </div>
      <div className="row h-80 d-flex justify-content-center align-items-center mt-4">
        {/* for image section */}
        <div className="col-lg-6 col-xl-4 col-12 col-md-8 pt-4 px-4 my-auto bglightblue">
          <span className="d-flex gap-0">
            <h1 className=" mb-5 text-white">Seamless Claims Journey</h1>
            <img
              src={threeline}
              alt="sound icon"
              className=""
              width={40}
              height={40}
            />
          </span>
          <span className="d-flex justify-content-center">
            <img src={loginimg} alt="login img" width="80%" height="78%" />
          </span>
        </div>
        {/* for sign up form */}
        <div className="col-lg-6 form-container col-xl-4 col-12 col-md-8 px-5 py-4 my-auto bg-white">
          <h1 className="text-center mb-4">Sign Up</h1>
          <Form
            layout="vertical"
            name="signupForm"
            initialValues={{
              name: "",
              phone: "",
              country_code: "+91",
              email: "",
              password: "",
              confirm_password: "",
            }}
            onFinish={handleSubmitSignup}
            validateMessages={{ required: "${label} is required!" }}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: " Name is required",
                },
                {
                  pattern: /^[&,.\-_\w\s]{1,20}$/,
                  message:
                    "Please enter a valid Name (up to 20 characters, only &, , ., -, _ special characters are allowed)",
                },
              ]}
              style={{ marginBottom: "10px" }}
            >
              <Input placeholder="Enter name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
              style={{ marginBottom: "10px" }}
            >
              <Input placeholder="you@opdsure.com" />
            </Form.Item>
            <Row gutter={0}>
              <Col span={5}>
                <Form.Item
                  name="country_code"
                  label={<span className="text-black">Mobile</span>}
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
                    defaultValue="+91"
                    placeholder="code"
                    style={{ width: "100%" }}
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
                  label={<span className="text-black d-none">Mobile</span>}
                  colon={false}
                  rules={[
                    { required: true, message: "Mobile is required" },
                    {
                      pattern: /^[0-9]+$/,
                      message: "Mobile no. must be digits",
                    },
                    
                  ]}
                  style={{ padding: 0, marginTop: "1.9rem" }}
                  labelCol={{ span: 0 }}
                >
                  <Input
                    type="tel"
                    style={{
                      width: "100%",
                    }}
                    placeholder="mobile no."
                    maxLength={13}
                  
                  />
                </Form.Item>
              </Col>
              {/* </div> */}
            </Row>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  validator: (_, value) => {
                    if (
                      !value ||
                      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,15}$/.test(
                        value
                      )
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Password must contain at least one number, one alphabet, one special character, and be 8 to 15 characters long!"
                      )
                    );
                  },
                },
              ]}
              style={{ marginBottom: "10px" }}
            >
              <Input.Password placeholder="password" />
            </Form.Item>
            <Form.Item
              name="confirm_password"
              label="Confirm Password"
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="confirm password" />
            </Form.Item>
            <Form.Item name="terms_and_condition">
              <Checkbox checked={agreedTerms} onChange={handleCheckboxChange}>
                I agree to the &nbsp;
                 <Link 
                //  to="/user/terms-and-conditions/SIGNUP"
                 to="#"
                 onClick={() => openInNewTab("/user/terms-and-conditions/SIGNUP")}
                 > Terms and Conditions</Link>
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block className="mt-3">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
