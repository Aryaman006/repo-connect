import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, notification, Row, Col, Select } from "antd";
import { UserAddOutlined, LoginOutlined } from "@ant-design/icons";
import {Axios} from "../../axios/axiosFunctions";
import codes from "country-calling-code";
import config from "../../config/config";
import loginimg from "../../assets/loginimg.png";
import threeline from "../../assets/threeline.png";
import opdlogo from "../../assets/opdlogo.png";
import { useAuth } from "../../context/authProvider";
import googleicon from "../../assets/googleicon.png";
import phoneicon from "../../assets/phoneicon.png";
import emailicon from "../../assets/emailicon.png";
import template from "../../assets/template.png";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import axios from "axios";
import CONSTANTS from "../../constant/Constants";
const {Option} = Select;
import { useGeneralUser } from "../../context/generalUserProvider";

export default function UserSignIn() {
  const [loginWithEmail, setLoginWithEmail] = useState(false);
  const [phone,setPhone] = useState('');
  const [country_code,setCountry_code] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [formValues, setFormValues] = useState();
  const [resendAttempts, setResendAttempts] = useState(0);
  const [lastResendTime, setLastResendTime] = useState(null);
  const [resendTimer, setResendTimer] = useState(null);
  const { setToken, setUserid, setRole, setSubscriberType, setUserType, setCorporate } = useAuth();
  const { setName, setEmail, setMobile, setPlanPurchaseStatus, setFirstPlanPurchase } = useGeneralUser();
  const navigate = useNavigate();
  const [loginForm] = Form.useForm();
  localStorage.clear();
  sessionStorage.clear();

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

  const handleSubmit = async (values) => {
    if (!otpSent) {
      // OTP fetching logic
      setPhone(values.phone);
      setCountry_code(values.country_code)
      try {
        const resp = await axios.post(config.UserLogininOTP, {
          phone: values.phone,
          country_code: values.country_code
        });
        setOtpSent(true);
        notification.success({
          message: "OTP has been sent to your registered Mobile and Email"
        });
        // Start resend timer after OTP is sent
        setResendTimer(120); // Set the resend timer to 2 minutes
      } catch (error) {
        notification.error({
          message: error.response.data.message
        });
      }
    } else {
      // Login with OTP logic
      try {
        if (loginWithEmail) {
          values.key_type = 0;
        } else {
          values.key_type = 1;
        }
        // Add OTP to the login values
       

        const result = await axios.post(config.UserLogin, {
          phone: values.phone,
          country_code: values.country_code,
          otp:parseInt(values.otp),
          key_type:1
        });
        if (result.status === 200) {
          const token = result.data.data.token;
          const user_id = result.data.data.user_id;
          const role = result.data.data.role;
          const corporate = result.data.data.corporate ? result.data.data.corporate : null;
          const subscriber_type = result.data.data.subscriber_type;
          setToken(token);
          setUserid(user_id);
          setUserType(3);
          setSubscriberType(subscriber_type);
          setRole(role);
          setCorporate(corporate);

          const headers = { 'Authorization': `Bearer ${token}` };
          sessionStorage.setItem("token", result.data.data.token);
          let resp;
          try {
            resp = await axios.get(`${config.ApiBaseUrl}${config.GetProfile}`, { headers });
            if (resp.status === 200) {
              notification.success({
                message: "Login Successful"
              });

              const userName = resp.data.data.name;
              const userEmail = resp.data.data.email;
              const userMobile = resp.data.data.country_code + resp.data.data.phone;
              const plan = resp.data.data.plan.purchased;
              const firstPlanPurchase = resp.data.data.first_plan_purchase;
              console.log("userEmail" , userEmail);
              
              setName(userName);
              setEmail(userEmail);
              setMobile(userMobile);
              setPlanPurchaseStatus(plan ? 1 : 0);
              setFirstPlanPurchase(firstPlanPurchase ? firstPlanPurchase : false);

              if (firstPlanPurchase === CONSTANTS.FIRST_PURCHASE.TRUE) {
                  if(userEmail ==="" || userEmail ===undefined || userEmail ===null){
                    console.log("navigating to onboarding")
                    navigate("/user/resubmit-details")
                    // return;
                  }else{
                    navigate("/user/dashboard", { replace: true });
                  }
                    
                
              } else {
                navigate("/user/plans", { replace: true });
              }
            }
          } catch (error) {
            notification.error({
              message: "Failed to login"
            });
            navigate("/user/login", { replace: true });
          }
        }
      } catch (error) {
        notification.error({
          message: error.response?.data?.message || "Login failed"
        });
      }
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
      await axios.post(config.UserLogininOTP, { phone: phone, country_code: country_code });
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
  
  const handleOtpChange = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) { // Ensure only digits are entered
      setOtpValue(value);
    }
  };

  const handleToggleLogin = () => {
    setLoginWithEmail((prev) => !prev);
  };

  return (
    <>

      <div className="container-fluid bg-light-blue py-3" style={{ height: "100vh" }}>
      {/* <a href="/"><img src="/src/WebApp/Assets/opdsure-Logo.svg" /></a> */}
      <a href="/">Go to Website</a>
        <div className="row mt-4  d-flex justify-content-center align-items-center">
          <div className="col-lg-6 col-xl-4 col-12 col-md-8 pt-4 px-4 my-auto bglightblue">
            <span className="d-flex gap-0">
              <h1 className="text-center mb-5 text-white">Effortless OPD Claims</h1>
              <img src={threeline} alt="sound icon" className="" width={40} height={40} />
            </span>
            <span className="d-flex justify-content-center">
              <img src={loginimg} alt="login img" width="62%" height="60%" />
            </span>
          </div>
          <div className="col-lg-6 form-container col-xl-4 col-12 col-md-8 p-5 my-auto bg-light-blue">
            <h4 className="text-center">Welcome to OPDSure</h4>
            <p className="text-center text-secondary mb-4">Please enter your details</p>
            <Form
              layout="vertical"
              name="loginForm"
              form={loginForm}
              initialValues={{ country_code: "+91", email: "", password: "" }}
              onFinish={handleSubmit}
              validateMessages={{ required: "${label} is required!" }}
            >
              {loginWithEmail ? (
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input placeholder="Enter your email address" />
                </Form.Item>
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
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          defaultValue="+91"
                          placeholder="code"
                          style={{ width: "100%" }}
                          disabled
                        >
                          {codes?.map((country) => (
                            <Option key={country.isoCode2} value={country.countryCodes[0]}>
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
                          {  pattern: /^[0-9]{10}$/, message: "Please enter a valid Mobile number" }
                        ]}
                        style={{ padding: 0 }}
                        labelCol={{ span: 0 }}
                      >
                        <Input
                          type="tel"
                          style={{ width: "100%" }}
                          placeholder="Enter your mobile no."
                          maxLength={10}
                          disabled ={otpSent}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
              {!otpSent && (
                <Form.Item style={{ marginBottom: "10px" }}>
                  <Button type="primary" htmlType="submit" block>
                    Continue
                  </Button>
                </Form.Item>
              )}
              {otpSent && (
                <>
                  <Form.Item
                    name="otp"
                    label="One Time Password"
                    rules={[{ required: true, message: "Please enter the OTP" }]}
                  >
                    {/* <Input
                      placeholder="Enter OTP"
                      value={otpValue}
                      onChange={handleOtpChange}
                      maxLength={6}
                    /> */}
                       {/* <p>Please enter the 6-digit code sent on your registered Mobile and Email.</p> */}
                     <Input.OTP  
                     maxLength={6} length={6} size='large'/>
                  </Form.Item>
                  <Row>
               
          
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
                  </Row>
                  <Form.Item style={{ marginBottom: "10px" }}>
                    <Button type="primary" htmlType="submit" block>
                      Sign In
                    </Button>
                  </Form.Item>
                  <Row>
                  { otpSent && <Button type="secondary" onClick={()=>{
                    setOtpSent(false);
                    setPhone("");
                    loginForm.resetFields();
                  }} block>
                      Cancel
                    </Button>}
                  </Row>
                </>
              )}
            </Form>
            <div className="d-flex align-items-center justify-content-center my-auto mb-2">
              <hr className="text-body-tertiary col-5" />
              <p className="text-center col-2 my-auto text-body-tertiary">or</p>
              <hr className="text-body-tertiary col-5" />
            </div>
            <p className="text-center mt-4 text-body-tertiary">
              Don't have an account?{" "}
              <Link to="/user/register" className="text-decoration-none">Sign Up</Link>
            </p>
            <div className="d-flex align-items-center justify-content-center my-auto mb-2">
              <hr className="text-body-tertiary col-5" />
              <p className="text-center col-2 my-auto text-body-tertiary">or</p>
              <hr className="text-body-tertiary col-5" />
            </div>
            <p className="text-center mt-4 text-body-tertiary">
              Are you Admin?{" "}
              <Link to="/admin/login" className="text-decoration-none">Login</Link>
            </p>
            <div className="d-flex align-items-center justify-content-center my-auto mb-2">
              <hr className="text-body-tertiary col-5" />
              <p className="text-center col-2 my-auto text-body-tertiary">or</p>
              <hr className="text-body-tertiary col-5" />
            </div>
            <p className="text-center mt-4 text-body-tertiary">
              Are you HR?{" "}
              <Link to="/hr/login" className="text-decoration-none">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

