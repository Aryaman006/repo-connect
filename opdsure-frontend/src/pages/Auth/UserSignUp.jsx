import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authProvider";
import {
  Form,
  Input,
  Button,
  notification,
  Row,
  Col,
  Select,
  Checkbox,
  Modal,
} from "antd";
import { UserAddOutlined, LoginOutlined } from "@ant-design/icons";
import { Axios } from "../../axios/axiosFunctions";
import codes from "country-calling-code";
import config from "../../config/config";
import loginimg from "../../assets/loginimg.png";
import threeline from "../../assets/threeline.png";
import opdlogo from "../../assets/opdlogo.png";
import googleicon from "../../assets/googleicon.png";
import phoneicon from "../../assets/phoneicon.png";
import emailicon from "../../assets/emailicon.png";
import template from "../../assets/template.png";
import axios from "axios";


export default function UserSignUp() {

  const {setToken,setUserid, setUserType,setRole,setSubscriberType,setCorporate} = useAuth();
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [signupWithEmail, setSignupWithEmail] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [formValues, setFormValues] = useState();
  const [resendAttempts, setResendAttempts] = useState(0);
  const [lastResendTime, setLastResendTime] = useState(null);
  const [resendTimer, setResendTimer] = useState(null);
  const [signupForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (resendTimer === null) return;
  
    const timerId = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(timerId);
  }, [resendTimer]);
  const handleSubmitSignup = async (values) => {
    try {

      if (!agreedTerms) {
        notification.error({
          message: "Please agree to Terms and Conditions",
        });
        return; 
      }

      values.terms_and_condition = true;
      if (signupWithEmail) {
        values.key_type = 0
      } else {
        values.key_type = 1
      }
     
      setFormValues(values);
      
      try {
        await axios.post(config.UserSignupOTP,{phone:values.phone,country_code:values.country_code});
        setIsModalVisible(true);
        setOtpSent(true);

      } catch (error) {
        notification.error({
          message: error.response.data.message,
        });
        
      }
     
    } catch (error) {
      notification.error({
        message: error.response.message,
      });
     
    }
  };
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };
  // for terms and conditions
  const handleCheckboxChange = (e) => {
    setAgreedTerms(e.target.checked);
  };

  const handleToggleSignup = () => {
    setSignupWithEmail((prev) => !prev);
    signupForm.resetFields();
  };
  
  // otp modal
  const handleOtpChange = (e) => {
    console.log(e)
    setOtpValue(e);
  };

  const handleOk = async () => {
    try {
    
      if(otpValue.length != 6){
        notification.error({
          message: "Invalid OTP",
        });
        return;
      }
     
      const verifyotp = await axios.post(config.VerifySignupOTP,{
        phone:formValues.phone,
        country_code:formValues.country_code,
        otp: parseInt(otpValue)
      });
      if(verifyotp.data.data.verified){
        const result = await Axios.postAxiosData(config.UserSignup, formValues);
    if (result.success === true) {
      notification.success({
        message: "Signup Successful",
      });
      setIsModalVisible(false);
        const token = result.data.token;
        const user_id = result.data.user_id;
        const role = result.data.role;
        const corporate = result.data.corporate;
        const subscriber_type = result.data.subscriber_type;
        const user_type = 3;
        setToken(token);
        setUserid(user_id);
        setUserType(user_type);
        setToken(token);
        setRole(role);
        setCorporate(corporate);
        setSubscriberType(subscriber_type);
        sessionStorage.setItem("token", result.data.token);
        navigate("/user/onboarding", { state: { signupWithEmail: !signupWithEmail }, replace:true});
    } else {
      notification.error({
        message: result.message,
      });
    }
      }else{
        notification.error({
          message: "Something went wrong please try again",
          description: "Please try again.",
        });
      }
      
    } catch (error) {
      notification.error({
        message: error.response.data.message,
        description: "Please try again.",
      });
      console.log("eroor in verifying otp",error)
    }
    
  };
  const handleResendOtp = async () => {
    if (resendAttempts >= 2) {
      notification.error({
        message: "Maximum resend attempts reached. Please try again later.",
      });
      return;
    }
  
    const now = new Date();
    if (lastResendTime && (now - lastResendTime < 2 * 60 * 1000)) { // Check if 2 minutes have passed
      notification.error({
        message: "Please wait before requesting a new OTP.",
      });
      return;
    }
  
    try {
      await axios.post(config.UserSignupOTP, { phone: formValues.phone, country_code: formValues.country_code });
      setLastResendTime(now);
      setResendAttempts((prev) => prev + 1);
      notification.success({
        message: "OTP has been resent.",
      });
  
      // Start the timer for the resend cooldown
      setResendTimer(120); // 2 minutes cooldown
    } catch (error) {
      notification.error({
        message: error.response.data.message,
        description: "Please try again.",
      });
    }
  };

  const handleCancel = () => {
    setOtpValue("");
    setResendAttempts(0);
    setOtpSent(false);
    setIsModalVisible(false);
  };

  return (
    <div
      className="container-fluid bg-light-blue py-3"
      style={{ height: "100vh" }}
    >
      {/* <img src={template} alt="background template" className="img-fluid z-5 position-absolute bottom-0 start-0 d-none d-lg-block d-md-block"/> */}
      {/* <a href="/"><img src="/src/WebApp/Assets/opdsure-Logo.svg" /></a> */}
      <a href="/">Go to Website</a>
      <div className="row  d-flex justify-content-center align-items-center">
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
        <div className="col-lg-6 form-container col-xl-4 col-12 col-md-8 px-5 py-4 my-auto bg-light-blue">
          <h3 className="text-center">Sign Up</h3>
          <p className="text-center text-secondary">
            Please enter your details
          </p>
          <Form
            layout="vertical"
            form={signupForm}
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
            {signupWithEmail ? (
              <>
                {/* <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please enter a valid email",
                    },
                  ]}
                >
                  <Input placeholder="Enter your email address" />
                </Form.Item> */}
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
                        disabled
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        // defaultValue="+91"
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
                        maxLength={10}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            {/* <Form.Item
              name="password"
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
            >
              <Input.Password placeholder="Create password" />
            </Form.Item>
            <Form.Item
              name="confirm_password"
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
              <Input.Password placeholder="Confirm password" />
            </Form.Item> */}

            <Form.Item name="terms_and_condition">
              <Checkbox checked={agreedTerms} onChange={handleCheckboxChange}>
                I agree to the &nbsp;
                <Link
                  //  to="/user/terms-and-conditions/SIGNUP"
                  to="#"
                  onClick={() =>
                    openInNewTab("/user/terms-and-conditions/signup")
                  }
                >
                  {" "}
                  Terms and Conditions.
                </Link>
              </Checkbox>
            </Form.Item>
            <Form.Item style={{ marginBottom: "10px" }}>
              <Button type="primary" htmlType="submit" block className="">
                Get Started
              </Button>
            </Form.Item>
          </Form>
          {/* <div className="d-flex align-items-center justify-content-center my-auto mb-2">
            <hr className="text-body-tertiary col-5" />
            <p className="text-center col-2 my-auto text-body-tertiary">or</p>
            <hr className="text-body-tertiary col-5" />
          </div> */}

          {/* <div className="d-flex align-items-center justify-content-center border rounded-3 bg-white mb-2">
            <img
              src={googleicon}
              alt="google icon"
              className="mx-2"
              width={20}
              height={20}
            />
            <p className="text-center my-auto fw-medium py-1">
              Continue with Google
            </p>
          </div> */}
{/* 
          <div className="d-flex align-items-center justify-content-center border rounded-3 bg-white">
            {!signupWithEmail ? (
              <>
                <img
                  src={emailicon}
                  alt="email icon"
                  className="mx-2"
                  width={20}
                  height={15}
                />
                <p
                  className="text-center my-auto fw-medium py-1"
                  onClick={handleToggleSignup}
                >
                  Continue with Email
                </p>
              </>
            ) : (
              <>
                <img
                  src={phoneicon}
                  alt="phone icon"
                  className="mx-2"
                  width={15}
                  height={20}
                />
                <p
                  className="text-center my-auto fw-medium py-1"
                  onClick={handleToggleSignup}
                >
                  Continue with Phone
                </p>
              </>
            )}
          </div> */}
          <p className="text-center mt-4 text-body-tertiary">
            Already have an account?{" "}
            <Link to="/user/signin" className="text-decoration-none">
              Log in
            </Link>
          </p>
        </div>
      </div>
      {/* OTP Modal */}
      <Modal
        title="Enter OTP"
        open={isModalVisible}
        onOk={handleOk}
        okText="Verify OTP"
        onCancel={handleCancel}
        centered
      >
        <p>Please enter the 6-digit code that we have sent on your registered Mobile.</p>
           <Input.OTP  value={otpValue} onChange={handleOtpChange} maxLength={6} length={6} />
           <p className="mt-4">
              Didn’t receive the OTP? 
              <Button
              type="link"
              onClick={handleResendOtp}
             disabled={resendTimer !== null}
            >
            Resend
            </Button>
            {resendTimer !== null && (
              <span> (Wait {Math.floor(resendTimer / 60)}:{resendTimer % 60} minutes)</span>
            )}
        </p>
        </Modal>
    </div>

    
  );
}
